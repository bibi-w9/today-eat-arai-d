<template>
  <div class="relative flex min-h-screen items-center justify-center bg-pink-50 p-4 sm:p-6">
    <main
      class="relative z-10 mt-16 w-full max-w-3xl rounded-[2.5rem] border-2 border-white bg-white/90 p-6 shadow-sm sm:p-7 md:p-10">
      <button @click="router.back()"
        class="mb-6 inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white/80 px-4 py-2 font-semibold text-pink-600 shadow-sm transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700">
        <span>◂ กลับ</span>
      </button>
      <header class="mb-6  text-center">
        <h1 class="text-2xl font-extrabold text-gray-800 sm:text-3xl">ตรวจ<span
            class="text-pink-500">วัตถุดิบ</span>จากรูป 📸</h1>
        <p class="mt-2 inline-block rounded-full bg-pink-100 px-4 py-1 text-sm font-medium text-pink-600">สเต็ป 3 / 4
        </p>
        <p class="mt-3 text-sm text-gray-500">ถ่ายรูปหรืออัปโหลดหลายรูป แล้วให้โมเดลช่วยระบุวัตถุดิบ</p>
      </header>

      <section class="mb-5">
        <div
          class="relative flex min-h-64 w-full items-center justify-center overflow-hidden rounded-[2rem] border-4 bg-pink-50"
          :class="selectedImage || isCameraOpen ? 'border-pink-300 border-solid' : 'border-pink-200 border-dashed bg-white'">
          <template v-if="isCameraOpen">
            <div class="relative w-full max-h-[32rem] aspect-[4/3] overflow-hidden bg-black">
              <video ref="videoRef" autoplay playsinline class="absolute inset-0 h-full w-full object-cover" />
              <div class="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-3">
                <button @click="stopCamera" class="h-10 w-10 rounded-full bg-white/90 font-bold text-gray-500 shadow-lg"
                  aria-label="ปิดกล้อง">✕</button>
                <button @click="capturePhoto"
                  class="rounded-full bg-pink-500 px-5 py-2 font-bold text-white shadow-lg sm:px-6">📸 ถ่ายภาพ</button>
              </div>
            </div>
          </template>

          <template v-else-if="selectedImage">
            <div class="relative max-w-full" :style="previewStyle">
              <img ref="imageRef" :src="selectedImage.preview" class="absolute inset-0 h-full w-full object-contain"
                alt="รูปวัตถุดิบ" @load="setImageSize" />
              <div v-for="(detection, index) in selectedImage.detections" :key="`${detection.label}-${index}`"
                class="absolute rounded-md border-[3px] border-pink-500" :style="boxStyle(detection)">
                <span
                  class="absolute -top-7 left-0 whitespace-nowrap rounded-md bg-pink-500 px-2 py-1 text-xs font-bold text-white shadow">{{
                  detection.label }} {{ detection.confidence.toFixed(1) }}%</span>
              </div>
            </div>
            <div class="absolute right-3 top-3 z-20 flex gap-2">
              <button @click="startCamera"
                class="rounded-xl bg-white px-3 py-2 text-xs font-bold text-pink-600 shadow sm:text-sm">📸
                ถ่ายเพิ่ม</button>
              <label
                class="cursor-pointer rounded-xl bg-white px-3 py-2 text-xs font-bold text-blue-500 shadow sm:text-sm">🖼️
                เพิ่มรูป<input type="file" accept="image/*" multiple class="hidden"
                  @change="handleFileChange" /></label>
            </div>
          </template>

          <div v-else class="p-6 text-center opacity-70"><span class="mb-3 block text-6xl">🧺</span>
            <p class="text-lg font-bold text-pink-400">รอรูปวัตถุดิบอยู่นะ</p>
          </div>
        </div>
        <canvas ref="canvasRef" class="hidden" />
      </section>

      <div v-if="images.length" class="mb-6">
        <div class="mb-2 flex items-center justify-between px-1">
          <p class="text-sm font-bold text-gray-600">รูปที่เลือก {{ images.length }} รูป</p><button @click="clearImages"
            class="text-sm font-bold text-pink-500 hover:text-pink-700">ลบทั้งหมด</button>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div v-for="(image, index) in images" :key="image.id" class="relative shrink-0">
            <button @click="selectImage(index)" class="h-20 w-20 overflow-hidden rounded-2xl border-[3px] bg-pink-50"
              :class="selectedIndex === index ? 'border-pink-500' : 'border-pink-100'"><img :src="image.preview"
                class="h-full w-full object-cover" :alt="`รูปที่ ${index + 1}`" /></button>
            <button @click="removeImage(index)"
              class="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-gray-700 text-xs text-white shadow"
              :aria-label="`ลบรูปที่ ${index + 1}`">✕</button>
            <span
              class="absolute bottom-1 left-1 rounded-full bg-white/90 px-1.5 text-[10px] font-bold text-pink-600">{{
              index + 1 }}</span>
          </div>
        </div>
      </div>

      <div v-if="!isCameraOpen" class="mb-6 flex justify-center gap-3 sm:gap-4">
        <button @click="startCamera"
          class="flex-1 rounded-[1.5rem] bg-pink-500 py-4 font-bold text-white shadow-[0_5px_0_0_#9d174d]">📸 {{
            images.length
              ? 'ถ่ายเพิ่ม' : 'ถ่ายรูป' }}</button>
        <label
          class="flex-1 cursor-pointer rounded-[1.5rem] border-2 border-pink-200 bg-white py-4 text-center font-bold text-pink-500 shadow-[0_5px_0_0_#fbcfe8]">🖼️
          {{ images.length ? 'เพิ่มรูป' : 'อัปโหลดรูป' }}<input type="file" accept="image/*" multiple class="hidden"
            @change="handleFileChange" /></label>
      </div>

      <button v-if="images.length && !hasDetected" @click="analyzeImages" :disabled="isDetecting"
        class="w-full rounded-2xl bg-pink-500 px-6 py-4 text-lg font-bold text-white shadow-[0_6px_0_0_#9d174d] disabled:opacity-60 sm:text-xl">{{
          isDetecting ? `กำลังประมวลผลรูป ${detectingProgress}/${images.length}...` : `ตรวจสอบวัตถุดิบใน ${images.length}
        รูป ✨`
        }}</button>

      <section v-if="hasDetected" class="mt-6 rounded-3xl border-2 border-pink-100 bg-pink-50 p-5">
        <h2 class="text-xl font-extrabold text-gray-800">พบวัตถุดิบ {{ allDetections.length }} รายการ จาก {{
          images.length }}
          รูป</h2>
        <p v-if="!allDetections.length" class="mt-2 text-gray-500">ยังไม่พบวัตถุดิบที่โมเดลรู้จัก
          ลองใช้รูปที่ชัดและมีแสงเพียงพอ</p>
        <div v-else class="mt-3 flex flex-wrap gap-2"><span v-for="(detection, index) in allDetections" :key="index"
            class="rounded-full border border-pink-200 bg-white px-3 py-1.5 text-sm font-bold text-pink-600">{{
              detection.label }} · {{ detection.confidence.toFixed(1) }}%</span></div>
        <button v-if="allDetections.length" @click="findMenus" :disabled="isMatching"
          class="mt-5 w-full rounded-2xl bg-pink-500 px-6 py-4 text-lg font-bold text-white shadow-[0_6px_0_0_#9d174d] disabled:opacity-60 sm:text-xl">{{
            isMatching ? 'กำลังค้นหาเมนู...' : 'ค้นหาเมนูจากวัตถุดิบ 🍽️' }}</button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type Detection = { label: string; confidence: number; box: { x: number; y: number; width: number; height: number } }
type ImageItem = { id: string; file: File; preview: string; detections: Detection[] }

const router = useRouter()
const route = useRoute()
const { notify } = useAppToast()
const selectedCategory = String(route.query.category || '')
const selectedMethod = String(route.query.method || '')
const images = ref<ImageItem[]>([])
const selectedIndex = ref(0)
const imageRef = ref<HTMLImageElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageSize = ref({ width: 1, height: 1 })
const isCameraOpen = ref(false)
const isDetecting = ref(false)
const detectingProgress = ref(0)
const isMatching = ref(false)
const hasDetected = ref(false)
const matchedRecipesState = useState<any[]>('matchedRecipes', () => [])
let videoStream: MediaStream | null = null

const selectedImage = computed(() => images.value[selectedIndex.value] || null)
const allDetections = computed(() => images.value.flatMap(image => image.detections))
const previewStyle = computed(() => {
  const ratio = imageSize.value.width / imageSize.value.height
  return { width: `min(100%, calc(32rem * ${ratio}))`, aspectRatio: `${imageSize.value.width} / ${imageSize.value.height}` }
})
const boxStyle = (d: Detection) => ({ left: `${(d.box.x / imageSize.value.width) * 100}%`, top: `${(d.box.y / imageSize.value.height) * 100}%`, width: `${(d.box.width / imageSize.value.width) * 100}%`, height: `${(d.box.height / imageSize.value.height) * 100}%` })

const resetDetection = () => { hasDetected.value = false; images.value.forEach(image => { image.detections = [] }) }
const setImageSize = () => { if (imageRef.value) imageSize.value = { width: imageRef.value.naturalWidth, height: imageRef.value.naturalHeight } }
const selectImage = async (index: number) => { selectedIndex.value = index; await nextTick(); setImageSize() }
const addFiles = (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  if (!imageFiles.length) return
  resetDetection()
  images.value.push(...imageFiles.map(file => ({ id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file, preview: URL.createObjectURL(file), detections: [] })))
  selectedIndex.value = images.value.length - 1
}
const removeImage = (index: number) => {
  const [removed] = images.value.splice(index, 1)
  if (removed) URL.revokeObjectURL(removed.preview)
  selectedIndex.value = Math.max(0, Math.min(selectedIndex.value, images.value.length - 1))
  resetDetection()
}
const clearImages = () => { images.value.forEach(image => URL.revokeObjectURL(image.preview)); images.value = []; selectedIndex.value = 0; hasDetected.value = false }

const startCamera = async () => {
  resetDetection(); isCameraOpen.value = true
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, aspectRatio: { ideal: 4 / 3 } } })
    await nextTick()
    if (videoRef.value) videoRef.value.srcObject = videoStream
  } catch { notify('เปิดกล้องไม่ได้ ลองอนุญาตการใช้งานกล้องหรืออัปโหลดรูปแทนนะ', 'error'); isCameraOpen.value = false }
}
const stopCamera = () => { videoStream?.getTracks().forEach(track => track.stop()); videoStream = null; isCameraOpen.value = false }
const capturePhoto = () => {
  const video = videoRef.value; const canvas = canvasRef.value
  if (!video || !canvas || !video.videoWidth || !video.videoHeight) return
  const targetRatio = 4 / 3; const sourceRatio = video.videoWidth / video.videoHeight
  const sourceWidth = sourceRatio > targetRatio ? video.videoHeight * targetRatio : video.videoWidth
  const sourceHeight = sourceRatio > targetRatio ? video.videoHeight : video.videoWidth / targetRatio
  const sourceX = (video.videoWidth - sourceWidth) / 2; const sourceY = (video.videoHeight - sourceHeight) / 2
  canvas.width = 1600; canvas.height = 1200
  canvas.getContext('2d')?.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height)
  canvas.toBlob(blob => { if (blob) { addFiles([new File([blob], `captured-ingredients-${Date.now()}.jpg`, { type: 'image/jpeg' })]); selectImage(images.value.length - 1) } }, 'image/jpeg', 0.92)
}
const handleFileChange = (event: Event) => { const input = event.target as HTMLInputElement; addFiles(Array.from(input.files || [])); input.value = '' }
const analyzeImages = async () => {
  if (!images.value.length) return
  isDetecting.value = true; detectingProgress.value = 0
  try {
    for (const [index, image] of images.value.entries()) {
      detectingProgress.value = index + 1
      const form = new FormData(); form.append('image', image.file)
      const response = await $fetch<{ success: boolean; detections: Detection[] }>('/api/detect', { method: 'POST', body: form })
      image.detections = response.detections
    }
    hasDetected.value = true
  } catch (error: any) { notify(error?.data?.message || 'ตรวจสอบรูปไม่สำเร็จ ลองอีกครั้งนะ', 'error') } finally { isDetecting.value = false }
}
const findMenus = async () => {
  isMatching.value = true
  try {
    const mappedIngredients = [...new Set(allDetections.value.flatMap(item => item.label === 'บะหมี่กึ่งสำเร็จรูป' ? ['บะหมี่กึ่งสำเร็จรูป', 'มาม่า'] : [item.label]))]
    const response = await $fetch<{ success: boolean; data: any[] }>('/api/recipes/match', { method: 'POST', body: { category: selectedCategory, method: selectedMethod, ingredients: mappedIngredients } })
    if (response.success && response.data.length) { matchedRecipesState.value = response.data; router.push('/result') } else notify('ยังไม่พบเมนูที่ตรงกับวัตถุดิบและตัวเลือกนี้ ลองเปลี่ยนวิธีทำหรือถ่ายรูปเพิ่มนะ', 'info')
  } catch { notify('ค้นหาเมนูไม่สำเร็จ ลองอีกครั้งนะ', 'error') } finally { isMatching.value = false }
}
onBeforeUnmount(() => { stopCamera(); images.value.forEach(image => URL.revokeObjectURL(image.preview)) })
</script>
