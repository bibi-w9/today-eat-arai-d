import * as ort from 'onnxruntime-node'
import sharp from 'sharp'
import { resolve } from 'node:path'

const MODEL_PATH = resolve(process.cwd(), 'server/models/assets/ingredient-detector.onnx')
const IMAGE_SIZE = 640
const CONFIDENCE_THRESHOLD = 0.25
const IOU_THRESHOLD = 0.45

// ลำดับคลาสนี้มาจาก metadata ในไฟล์ best.pt ที่ส่งมาพร้อมโมเดล
const CLASS_NAMES: Array<string | null> = [
  'เห็ดออริจิ', 'แครอท', 'ไก่', 'ไข่', 'บะหมี่กึ่งสำเร็จรูป',
  'หอมใหญ่', 'หมู', 'ข้าว', 'กุ้ง', 'กะเพรา', 'มะเขือเทศ', null, 'ผักบุ้ง'
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
  const metadata = await source.metadata()
  const originalWidth = metadata.width
  const originalHeight = metadata.height
  if (!originalWidth || !originalHeight) throw createError({ statusCode: 400, message: 'ไฟล์นี้ไม่ใช่รูปภาพที่ใช้ตรวจจับได้' })

  const pixels = await source.resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'fill' }).removeAlpha().raw().toBuffer()
  const input = new Float32Array(3 * IMAGE_SIZE * IMAGE_SIZE)
  for (let pixel = 0; pixel < IMAGE_SIZE * IMAGE_SIZE; pixel++) {
    input[pixel] = pixels[pixel * 3] / 255
    input[IMAGE_SIZE * IMAGE_SIZE + pixel] = pixels[pixel * 3 + 1] / 255
    input[IMAGE_SIZE * IMAGE_SIZE * 2 + pixel] = pixels[pixel * 3 + 2] / 255
  }

  const session = await getSession()
  const output = (await session.run({ images: new ort.Tensor('float32', input, [1, 3, IMAGE_SIZE, IMAGE_SIZE]) })).output0.data as Float32Array
  const candidates: IngredientDetection[] = []
  const predictions = 8400
  const attributes = 17 // x, y, width, height + ความน่าจะเป็นของ 13? export นี้มี 9 คลาสที่ใช้

  for (let index = 0; index < predictions; index++) {
    let classIndex = -1
    let confidence = 0
    for (let classOffset = 4; classOffset < attributes; classOffset++) {
      const score = output[classOffset * predictions + index]
      if (score > confidence) {
        confidence = score
        classIndex = classOffset - 4
      }
    }
    const label = CLASS_NAMES[classIndex]
    if (confidence < CONFIDENCE_THRESHOLD || !label) continue

    const centerX = output[index]
    const centerY = output[predictions + index]
    const width = output[predictions * 2 + index]
    const height = output[predictions * 3 + index]
    const x = Math.max(0, (centerX - width / 2) * originalWidth / IMAGE_SIZE)
    const y = Math.max(0, (centerY - height / 2) * originalHeight / IMAGE_SIZE)
    candidates.push({
      label,
      confidence: Math.round(confidence * 1000) / 10,
      box: {
        x: Math.round(x), y: Math.round(y),
        width: Math.round(Math.min(width * originalWidth / IMAGE_SIZE, originalWidth - x)),
        height: Math.round(Math.min(height * originalHeight / IMAGE_SIZE, originalHeight - y))
      }
    })
  }

  return nonMaximumSuppression(candidates)
}
