<template>
  <div class="relative min-h-screen bg-pink-50 flex items-center justify-center p-6 overflow-hidden">
    <main class="relative z-10 w-full max-w-2xl bg-white/90 rounded-[2.5rem] p-7 md:p-10 shadow-sm border-2 border-white">
      
      <!-- ปุ่มกลับ -->
      <button 
        @click="router.back()" 
        class="absolute top-6 left-6 text-gray-400 hover:text-pink-500 text-sm font-bold"
      >
        ◂ กลับ
      </button>
      
      <!-- Header -->
      <header class="text-center mb-7 mt-4">
        <h1 class="text-3xl font-extrabold text-gray-800">
          ตรวจ<span class="text-pink-500">วัตถุดิบ</span>จากรูป 📸
        </h1>
        <p class="text-gray-500 mt-2 font-medium text-sm bg-pink-100 inline-block px-4 py-1 rounded-full text-pink-600">
          สเต็ป 3 / 4
        </p>
        <p class="text-sm text-gray-500 mt-3">
          ถ่ายรูปหรืออัปโหลดรูป แล้วให้โมเดลช่วยระบุวัตถุดิบ
        </p>
      </header>

      <!-- ส่วนแสดงรูปภาพและกล้อง -->
      <section class="mb-6">
        <div 
          class="relative flex items-center justify-center min-h-64 w-full border-4 rounded-[2rem] overflow-hidden bg-pink-50" 
          :class="imagePreview || isCameraOpen ? 'border-pink-300 border-solid' : 'border-pink-200 border-dashed bg-white'"
        >
          <!-- กรณีเปิดกล้อง -->
          <template v-if="isCameraOpen">
            <video 
              ref="videoRef" 
              autoplay 
              playsinline 
              class="absolute inset-0 w-full h-full object-cover" 
            />
            <div class="absolute bottom-3 flex gap-3 z-10">
              <button 
                @click="stopCamera" 
                class="bg-white/90 text-gray-500 w-10 h-10 rounded-full font-bold shadow-lg"
              >
                ✕
              </button>
              <button 
                @click="capturePhoto" 
                class="bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg"
              >
                📸 ถ่ายภาพ
              </button>
            </div>
          </template>
          
          <!-- กรณีมีรูป Preview -->
          <template v-else-if="imagePreview">
            <div class="relative max-w-full max-h-[26rem]" :style="previewStyle">
              <img 
                ref="imageRef" 
                :src="imagePreview" 
                class="absolute inset-0 w-full h-full" 
                alt="รูปวัตถุดิบ" 
                @load="setImageSize" 
              />
              
              <!-- กล่อง Bounding Box ตรวจจับวัตถุดิบ -->
              <div 
                v-for="(detection, index) in detections" 
                :key="`${detection.label}-${index}`" 
                class="absolute border-[3px] border-pink-500 rounded-md" 
                :style="boxStyle(detection)"
              >
                <span class="absolute -top-7 left-0 whitespace-nowrap rounded-md bg-pink-500 px-2 py-1 text-xs font-bold text-white shadow">
                  {{ detection.label }} {{ detection.confidence.toFixed(1) }}%
                </span>
              </div>
            </div>
            
            <div class="absolute right-3 top-3 flex gap-2 z-20">
              <button 
                @click="startCamera" 
                class="bg-white text-pink-600 font-bold px-3 py-2 rounded-xl text-sm shadow"
              >
                📸 ถ่ายใหม่
              </button>
              <label class="bg-white text-blue-500 font-bold px-3 py-2 rounded-xl text-sm shadow cursor-pointer">
                🖼️ เปลี่ยนรูป
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </label>
            </div>
          </template>
          
          <!-- กรณีเริ่มต้น (ไม่มีรูป/ไม่ได้เปิดกล้อง) -->
          <div v-else class="text-center p-6 opacity-70">
            <span class="text-6xl block mb-3">🧺</span>
            <p class="text-pink-400 font-bold text-lg">รอรูปวัตถุดิบอยู่นะ</p>
          </div>
        </div>
        
        <canvas ref="canvasRef" class="hidden" />
      </section>

      <!-- ปุ่มถ่ายรูป / อัปโหลด (แสดงตอนไม่มีรูป) -->
      <div v-if="!imagePreview && !isCameraOpen" class="flex gap-4 justify-center mb-6">
        <button 
          @click="startCamera" 
          class="flex-1 bg-pink-500 text-white rounded-[1.5rem] py-4 font-bold shadow-[0_5px_0_0_#9d174d]"
        >
          📸 ถ่ายรูป
        </button>
        <label class="flex-1 text-center bg-white border-2 border-pink-200 text-pink-500 rounded-[1.5rem] py-4 font-bold cursor-pointer shadow-[0_5px_0_0_#fbcfe8]">
          🖼️ อัปโหลดรูป
          <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
        </label>
      </div>

      <!-- ปุ่มตรวจสอบวัตถุดิบ (AI) -->
      <button 
        v-if="imagePreview && !hasDetected" 
        @click="analyzeImage" 
        :disabled="isDetecting" 
        class="w-full font-bold text-xl py-4 px-8 rounded-2xl bg-pink-500 text-white shadow-[0_6px_0_0_#9d174d] disabled:opacity-60"
      >
        {{ isDetecting ? 'กำลังประมวลผลวัตถุดิบ...' : 'ตรวจสอบวัตถุดิบในรูป ✨' }}
      </button>

      <!-- ส่วนผลลัพธ์จาก AI และปุ่มค้นหาเมนู -->
      <section v-if="hasDetected" class="mt-6 rounded-3xl border-2 border-pink-100 bg-pink-50 p-5">
        <h2 class="font-extrabold text-xl text-gray-800">
          พบวัตถุดิบ {{ detections.length }} รายการ
        </h2>
        
        <p v-if="!detections.length" class="mt-2 text-gray-500">
          ยังไม่พบวัตถุดิบที่โมเดลรู้จัก ลองใช้รูปที่ชัดและมีแสงเพียงพอ
        </p>
        
        <div v-else class="mt-3 flex flex-wrap gap-2">
          <span 
            v-for="(detection, index) in detections" 
            :key="index" 
            class="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-pink-600 border border-pink-200"
          >
            {{ detection.label }} · {{ detection.confidence.toFixed(1) }}%
          </span>
        </div>
        
        <button 
          v-if="detections.length" 
          @click="findMenus" 
          :disabled="isMatching" 
          class="mt-5 w-full font-bold text-xl py-4 px-8 rounded-2xl bg-pink-500 text-white shadow-[0_6px_0_0_#9d174d] disabled:opacity-60"
        >
          {{ isMatching ? 'กำลังค้นหาเมนู...' : 'ค้นหาเมนูจากวัตถุดิบ 🍽️' }}
        </button>
      </section>
      
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// --- Types ---
type Detection = { 
  label: string; 
  confidence: number; 
  box: { x: number; y: number; width: number; height: number } 
}

// --- Setup Router & Variables ---
const router = useRouter()
const route = useRoute()

const selectedCategory = String(route.query.category || '')
const selectedMethod = String(route.query.method || '')

const imagePreview = ref<string | null>(null)
const imageFile = ref<File | null>(null)

const imageRef = ref<HTMLImageElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const imageSize = ref({ width: 1, height: 1 })
const isCameraOpen = ref(false)
const isDetecting = ref(false)
const isMatching = ref(false)
const hasDetected = ref(false)
const detections = ref<Detection[]>([])

const matchedRecipesState = useState<any[]>('matchedRecipes', () => [])
let videoStream: MediaStream | null = null

// --- Computed Styles ---
const previewStyle = computed(() => ({ 
  width: '100%', 
  aspectRatio: `${imageSize.value.width} / ${imageSize.value.height}` 
}))

const boxStyle = (d: Detection) => ({ 
  left: `${(d.box.x / imageSize.value.width) * 100}%`, 
  top: `${(d.box.y / imageSize.value.height) * 100}%`, 
  width: `${(d.box.width / imageSize.value.width) * 100}%`, 
  height: `${(d.box.height / imageSize.value.height) * 100}%` 
})

// --- Methods ---
const setImageSize = () => { 
  if (imageRef.value) {
    imageSize.value = { 
      width: imageRef.value.naturalWidth, 
      height: imageRef.value.naturalHeight 
    } 
  }
}

const resetDetection = () => { 
  hasDetected.value = false
  detections.value = [] 
}

const startCamera = async () => { 
  resetDetection()
  imagePreview.value = null
  isCameraOpen.value = true
  
  try { 
    videoStream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    })
    
    if (videoRef.value) {
      videoRef.value.srcObject = videoStream 
    }
  } catch { 
    alert('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้งานกล้อง หรือเลือกอัปโหลดรูปแทน')
    isCameraOpen.value = false 
  } 
}

const stopCamera = () => { 
  videoStream?.getTracks().forEach(track => track.stop())
  videoStream = null
  isCameraOpen.value = false 
}

const capturePhoto = () => { 
  if (!videoRef.value || !canvasRef.value) return
  
  const video = videoRef.value
  const canvas = canvasRef.value
  
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d')?.drawImage(video, 0, 0)
  
  canvas.toBlob(blob => { 
    if (blob) { 
      imageFile.value = new File([blob], 'captured-ingredients.jpg', { type: 'image/jpeg' })
      imagePreview.value = URL.createObjectURL(blob)
      resetDetection() 
    } 
  }, 'image/jpeg', 0.9)
  
  stopCamera() 
}

const handleFileChange = (event: Event) => { 
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  stopCamera()
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
  resetDetection() 
}

const analyzeImage = async () => { 
  if (!imageFile.value) return
  
  isDetecting.value = true
  
  try { 
    const form = new FormData()
    form.append('image', imageFile.value)
    
    const response = await $fetch<{ success: boolean; detections: Detection[] }>('/api/detect', { 
      method: 'POST', 
      body: form 
    })
    
    detections.value = response.detections
    hasDetected.value = true 
  } catch (error: any) { 
    alert(error?.data?.message || 'ตรวจสอบรูปไม่สำเร็จ ลองอีกครั้งนะ') 
  } finally { 
    isDetecting.value = false 
  } 
}

const findMenus = async () => { 
  isMatching.value = true
  
  try { 
    // แปลงคำศัพท์ให้ครอบคลุมการค้นหา
    const mappedIngredients = detections.value.flatMap(item => {
      if (item.label === 'บะหมี่กึ่งสำเร็จรูป') {
        return ['บะหมี่กึ่งสำเร็จรูป', 'มาม่า']
      }
      return [item.label]
    })

    const response = await $fetch<{ success: boolean; data: any[] }>('/api/recipes/match', { 
      method: 'POST', 
      body: { 
        category: selectedCategory, 
        method: selectedMethod, 
        ingredients: mappedIngredients 
      } 
    })
    
    if (response.success && response.data.length) { 
      matchedRecipesState.value = response.data
      router.push('/result') 
    } else {
      alert('ยังไม่พบเมนูที่ตรงกับวัตถุดิบและตัวเลือกนี้ ลองเปลี่ยนวิธีทำหรือถ่ายรูปเพิ่มนะ') 
    }
  } catch { 
    alert('ค้นหาเมนูไม่สำเร็จ ลองอีกครั้งนะ') 
  } finally { 
    isMatching.value = false 
  } 
}

// --- Lifecycle Hooks ---
onBeforeUnmount(stopCamera)
</script>