import * as ort from 'onnxruntime-node'
import sharp from 'sharp'
import { resolve } from 'node:path'

const MODEL_PATH = resolve(process.cwd(), 'server/models/assets/ingredient-detector.onnx')
const IMAGE_SIZE = 640
const CONFIDENCE_THRESHOLD = 0.25
const IOU_THRESHOLD = 0.45

// ลำดับคลาสนี้อ่านจาก metadata ของ best (6).onnx
const CLASS_NAMES = [
  'แครอท', 'ไก่', 'ไข่', 'บะหมี่กึ่งสำเร็จรูป', 'เห็ดออริจิ', 'หอมใหญ่',
  'หมู', 'ข้าว', 'กุ้ง', 'กะเพรา', 'มะเขือเทศ', 'ผักบุ้ง'
]

export interface IngredientDetection {
  label: string
  confidence: number
  box: { x: number; y: number; width: number; height: number }
}

let sessionPromise: Promise<ort.InferenceSession> | undefined

function getSession() {
  sessionPromise ||= ort.InferenceSession.create(MODEL_PATH)
  return sessionPromise
}

function iou(a: IngredientDetection, b: IngredientDetection) {
  const left = Math.max(a.box.x, b.box.x)
  const top = Math.max(a.box.y, b.box.y)
  const right = Math.min(a.box.x + a.box.width, b.box.x + b.box.width)
  const bottom = Math.min(a.box.y + a.box.height, b.box.y + b.box.height)
  const intersection = Math.max(0, right - left) * Math.max(0, bottom - top)
  const union = a.box.width * a.box.height + b.box.width * b.box.height - intersection
  return union ? intersection / union : 0
}

function nonMaximumSuppression(detections: IngredientDetection[]) {
  const chosen: IngredientDetection[] = []
  for (const detection of [...detections].sort((a, b) => b.confidence - a.confidence)) {
    if (!chosen.some(item => item.label === detection.label && iou(item, detection) > IOU_THRESHOLD)) {
      chosen.push(detection)
    }
  }
  return chosen
}

export async function detectIngredients(image: Buffer): Promise<IngredientDetection[]> {
  const source = sharp(image).rotate()
  const metadata = await sharp(image).metadata()
  const orientation = metadata.orientation
  const swapsDimensions = orientation !== undefined && orientation >= 5 && orientation <= 8
  const originalWidth = swapsDimensions ? metadata.height : metadata.width
  const originalHeight = swapsDimensions ? metadata.width : metadata.height
  if (!originalWidth || !originalHeight) throw createError({ statusCode: 400, message: 'ไฟล์นี้ไม่ใช่รูปภาพที่ใช้ตรวจจับได้' })

  // Keep the original aspect ratio while preparing the square tensor expected by YOLO.
  // The model sees gray padding instead of a geometrically distorted image.
  const scale = Math.min(IMAGE_SIZE / originalWidth, IMAGE_SIZE / originalHeight)
  const resizedWidth = Math.max(1, Math.round(originalWidth * scale))
  const resizedHeight = Math.max(1, Math.round(originalHeight * scale))
  const padX = (IMAGE_SIZE - resizedWidth) / 2
  const padY = (IMAGE_SIZE - resizedHeight) / 2
  const pixels = await source.resize(IMAGE_SIZE, IMAGE_SIZE, {
    fit: 'contain',
    position: 'centre',
    background: { r: 114, g: 114, b: 114, alpha: 1 }
  }).removeAlpha().raw().toBuffer()
  const input = new Float32Array(3 * IMAGE_SIZE * IMAGE_SIZE)
  for (let pixel = 0; pixel < IMAGE_SIZE * IMAGE_SIZE; pixel++) {
    input[pixel] = pixels[pixel * 3] / 255
    input[IMAGE_SIZE * IMAGE_SIZE + pixel] = pixels[pixel * 3 + 1] / 255
    input[IMAGE_SIZE * IMAGE_SIZE * 2 + pixel] = pixels[pixel * 3 + 2] / 255
  }

  const session = await getSession()
  const inputName = session.inputNames[0]
  const outputName = session.outputNames[0]
  const results = await session.run({
    [inputName]: new ort.Tensor('float32', input, [1, 3, IMAGE_SIZE, IMAGE_SIZE])
  })
  const outputTensor = results[outputName]
  const output = outputTensor.data as Float32Array
  const candidates: IngredientDetection[] = []
  const outputDims = outputTensor.dims
  if (outputDims.length !== 3 || outputDims[0] !== 1) {
    throw createError({ statusCode: 500, message: 'รูปแบบผลลัพธ์ของโมเดลไม่รองรับ' })
  }

  // Ultralytics exports detection output as [1, attributes, predictions].
  // รองรับ [1, predictions, attributes] ไว้ด้วยเพื่อไม่ผูกกับ exporter รุ่นใดรุ่นหนึ่ง
  const channelFirst = Number(outputDims[1]) <= Number(outputDims[2])
  const attributes = Number(outputDims[channelFirst ? 1 : 2])
  const predictions = Number(outputDims[channelFirst ? 2 : 1])
  const classCount = attributes - 4
  if (classCount !== CLASS_NAMES.length) {
    throw createError({ statusCode: 500, message: 'จำนวนคลาสในโมเดลไม่ตรงกับการตั้งค่าในระบบ' })
  }

  const valueAt = (attribute: number, prediction: number) => (
    channelFirst
      ? output[attribute * predictions + prediction]
      : output[prediction * attributes + attribute]
  )

  for (let index = 0; index < predictions; index++) {
    let classIndex = -1
    let confidence = 0
    for (let classOffset = 4; classOffset < attributes; classOffset++) {
      const score = valueAt(classOffset, index)
      if (score > confidence) {
        confidence = score
        classIndex = classOffset - 4
      }
    }
    const label = CLASS_NAMES[classIndex]
    if (confidence < CONFIDENCE_THRESHOLD || !label) continue

    const centerX = valueAt(0, index)
    const centerY = valueAt(1, index)
    const width = valueAt(2, index)
    const height = valueAt(3, index)
    const left = (centerX - width / 2 - padX) / scale
    const top = (centerY - height / 2 - padY) / scale
    const right = (centerX + width / 2 - padX) / scale
    const bottom = (centerY + height / 2 - padY) / scale
    const x = Math.max(0, Math.min(originalWidth, left))
    const y = Math.max(0, Math.min(originalHeight, top))
    candidates.push({
      label,
      confidence: Math.round(confidence * 1000) / 10,
      box: {
        x: Math.round(x), y: Math.round(y),
        width: Math.round(Math.max(0, Math.min(originalWidth - x, right - x))),
        height: Math.round(Math.max(0, Math.min(originalHeight - y, bottom - y)))
      }
    })
  }

  return nonMaximumSuppression(candidates)
}
