<template>
  <div class="relative min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 overflow-hidden">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง -->
    <div class="absolute top-10 left-10 md:left-32 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">🥕</div>
    <div class="absolute bottom-20 left-16 md:left-40 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">🍗</div>
    <div class="absolute top-40 right-10 md:right-32 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">🥬</div>
    <div class="absolute bottom-32 right-16 md:right-40 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">🥚</div>

    <!-- กล่องเนื้อหาหลัก -->
    <div class="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-white transition-all">
      
      <!-- ปุ่มย้อนกลับ -->
      <button @click="router.back()" class="absolute top-6 left-6 text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-1 text-sm font-bold">
        <span>◂ กลับ</span>
      </button>

      <div class="text-center mb-6 mt-4">
        <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight">แอบดู<span class="text-pink-500">ตู้เย็น</span>หน่อย! 👀</h2>
        <p class="text-gray-500 mt-2 font-medium text-sm bg-pink-100 inline-block px-4 py-1 rounded-full text-pink-600">สเต็ป 3 / 3</p>
      </div>

      <!-- พื้นที่อัปโหลด/ถ่ายรูป -->
      <div class="mb-8 w-full">
        
        <!-- 1. กรอบแสดงรูปภาพ / กล้องสด (Preview Box) -->
        <div 
          class="relative flex flex-col items-center justify-center w-full h-64 border-4 rounded-[2rem] transition-all duration-300 overflow-hidden mb-6"
          :class="imagePreview || isCameraOpen ? 'border-pink-300 bg-pink-50 border-solid shadow-inner' : 'border-pink-200 bg-white border-dashed'"
        >
          
          <!-- โหมด A: กำลังเปิดกล้องสด -->
          <template v-if="isCameraOpen">
            <!-- วิดีโอสตรีมจากกล้อง (ใส่ scale-x-[-1] เพื่อกลับซ้ายขวาเหมือนกระจก จะได้ไม่งงเวลาขยับตัว) -->
            <video ref="videoRef" autoplay playsinline class="absolute inset-0 w-full h-full object-cover z-0"></video>
            
            <!-- ปุ่มกดถ่ายรูปทับบนวิดีโอ -->
            <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-3 z-10">
              <button @click="stopCamera" class="bg-white/90 text-gray-500 w-10 h-10 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">✕</button>
              <button @click="capturePhoto" class="bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#9d174d] active:shadow-none active:translate-y-[4px] border-2 border-white transition-all">📸 แชะ!</button>
            </div>
          </template>

          <!-- โหมด B: มีรูปภาพแล้ว -->
          <template v-else-if="imagePreview">
            <img :src="imagePreview" class="absolute inset-0 w-full h-full object-cover z-0" alt="Fridge Preview"/>
            <!-- เมนูตอน Hover -->
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 hover:opacity-100 transition-opacity z-10">
              <button @click="startCamera" class="bg-white text-pink-600 font-bold px-3 py-2 rounded-xl text-sm cursor-pointer hover:scale-105 transition-transform shadow-lg">📸 ถ่ายใหม่</button>
              <label class="bg-white text-blue-500 font-bold px-3 py-2 rounded-xl text-sm cursor-pointer hover:scale-105 transition-transform shadow-lg">
                🖼️ เปลี่ยนรูป
                <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
              </label>
            </div>
          </template>
          
          <!-- โหมด C: ว่างเปล่า -->
          <div v-else class="flex flex-col items-center justify-center text-center p-6 opacity-70">
            <span class="text-6xl mb-3 animate-[pulse_3s_ease-in-out_infinite]">🧊</span>
            <p class="text-pink-400 font-bold text-lg">พื้นที่ว่าง รอรูปอยู่นะ!</p>
          </div>
        </div>

        <!-- Canvas สำหรับใช้แปลงวิดีโอเป็นรูปภาพ (ซ่อนเอาไว้) -->
        <canvas ref="canvasRef" class="hidden"></canvas>

        <div class="text-center mb-4">
          <p class="text-pink-600 font-extrabold text-xl tracking-wide">เปิดกล้องถ่ายตู้เย็นเลย! ✨</p>
          <p class="text-sm text-gray-500 mt-1 font-medium">หรือเลือกรูปจากอัลบั้มก็ได้นะ</p>
        </div>

        <!-- 2. ปุ่มถ่ายรูปและเลือกรูป -->
        <div class="flex gap-4 justify-center w-full">
          
          <!-- ปุ่มที่ 1: เปิดกล้องสด (เปลี่ยนจากแท็ก <label> เป็น <button>) -->
          <button @click="startCamera" class="group flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-pink-400 to-pink-500 text-white rounded-[1.5rem] py-4 cursor-pointer transition-all duration-200 shadow-[0_6px_0_0_#9d174d] hover:brightness-110 hover:shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]">
            <div class="bg-white/20 p-3 rounded-full mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <span class="text-3xl drop-shadow-md">📸</span>
            </div>
            <span class="text-lg font-bold tracking-wide">ถ่ายรูป</span>
          </button>

          <!-- ปุ่มที่ 2: เลือกรูป (คงเดิม) -->
          <label class="group flex-1 flex flex-col items-center justify-center bg-white border-2 border-pink-200 text-pink-500 rounded-[1.5rem] py-4 cursor-pointer transition-all duration-200 shadow-[0_6px_0_0_#fbcfe8] hover:border-pink-300 hover:bg-pink-50 hover:shadow-[0_4px_0_0_#f9a8d4] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]">
            <div class="bg-pink-50 p-3 rounded-full mb-2 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
              <span class="text-3xl drop-shadow-sm">🖼️</span>
            </div>
            <span class="text-lg font-bold tracking-wide">อัลบั้ม</span>
            <input type="file" accept="image/*" class="hidden" @change="handleFileChange" />
          </label>

        </div>
      </div>

      <!-- ปุ่ม Submit -->
      <button 
        v-if="imagePreview  || USE_MOCK_DETECTION"
        @click="analyzeIngredients"
        :disabled="isLoading"
        class="group w-full inline-flex items-center justify-center font-bold text-xl py-4 px-8 rounded-2xl transition-all duration-200 bg-pink-500 text-white shadow-[0_6px_0_0_#9d174d] hover:bg-pink-600 hover:shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]"
      >
        <span v-if="isLoading" class="animate-spin mr-2">⏳</span>
        <span v-else class="group-hover:translate-x-2 transition-transform duration-300 ease-in-out mr-2">✨</span>
        {{ isLoading ? 'AI กำลังคิดเมนู...' : 'ให้ AI เสกเมนูเลย!' }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedCategory = route.query.category || ''
const selectedMethod = route.query.method || ''
const selectionId = route.query.selectionId || ''
const USE_MOCK_DETECTION = true

const imagePreview = ref(null)
const imageFile = ref(null)
const isLoading = ref(false)

// ตัวแปรสำหรับระบบกล้อง
const isCameraOpen = ref(false)
const videoRef = ref(null)
const canvasRef = ref(null)
let videoStream = null

// สร้าง Global State เพื่อรอรับสูตรอาหารที่ Backend ส่งกลับมา
const currentRecipeState = useState('currentRecipe', () => null)

// ชื่อต้องตรงกับ ingredients[].name ในคอลเลกชัน recipes ทุกตัว
// (recipeService เทียบชื่อแบบ exact match) ใส่ให้ครอบคลุมเพื่อให้เห็นผลการกรองชัด
const MOCK_INGREDIENTS = [
  'ไข่ไก่', 'อกไก่', 'ข้าวกล้อง', 'หมูสับ', 'แครอท',
  'ต้นหอม', 'กะหล่ำปลี', 'เต้าหู้', 'กระเทียม', 'พริก'
]
// const response = await $fetch('/api/recipes/match', {
//   method: 'POST',
//   body: {
//     selectionId,
//     category: selectedCategory,
//     method: selectedMethod,
//   }
// })
// 1. ฟังก์ชันเปิดกล้อง
const startCamera = async () => {
  imagePreview.value = null // ล้างรูปเก่าออกก่อน
  isCameraOpen.value = true

  try {
    // ขออนุญาตใช้งานกล้องจากเบราว์เซอร์ (ใช้ได้ทั้ง Laptop และ มือถือ)
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } // พยายามเปิดกล้องหลังมือถือ (ถ้าบนคอมจะเปิดเว็บแคมปกติ)
    })
    videoStream = stream
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (err) {
    alert('ไม่สามารถเปิดกล้องได้ครับ รบกวนกด "Allow (อนุญาต)" ให้เบราว์เซอร์เข้าถึงกล้องด้วยน้า 🥺')
    isCameraOpen.value = false
  }
}

// 2. ฟังก์ชันปิดกล้อง
const stopCamera = () => {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop())
  }
  isCameraOpen.value = false
}

// 3. ฟังก์ชันกดถ่ายรูป
const capturePhoto = () => {
  if (videoRef.value && canvasRef.value) {
    const video = videoRef.value
    const canvas = canvasRef.value
    const context = canvas.getContext('2d')
    
    // ตั้งขนาดภาพให้เท่ากับที่กล้องถ่ายได้
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // วาดภาพจากวิดีโอลงบนผืนผ้าใบ (Canvas)
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // สร้างรูปภาพเพื่อแสดงผลบนหน้าจอ (Preview)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    imagePreview.value = dataUrl
    
    // แปลงข้อมูลเป็นไฟล์ File Object เอาไว้เตรียมส่ง API
    canvas.toBlob((blob) => {
      imageFile.value = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' })
    }, 'image/jpeg', 0.8)
    
    stopCamera() // ถ่ายเสร็จแล้วปิดกล้อง
  }
}

// เมื่อเปลี่ยนหน้าเว็บ ต้องสั่งปิดกล้องเสมอ (ป้องกันไฟกล้องค้าง)
onBeforeUnmount(() => {
  stopCamera()
})

// 4. ฟังก์ชันเลือกรูปจากอัลบั้ม
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

// 5. ฟังก์ชันส่งข้อมูลไปหา Backend เพื่อให้ระบบ YOLO / Object Detection ตรวจจับวัตถุดิบ
const analyzeIngredients = async () => {
  // โหมดจริงต้องมีรูป แต่โหมด mock ไม่ต้อง
  if (!USE_MOCK_DETECTION && !imageFile.value) return
  isLoading.value = true

  try {
    let body

    if (USE_MOCK_DETECTION) {
      // JSON: ไม่มีรูป ส่ง ingredients ปลอมไปตรงๆ
      body = {
        selectionId,
        category: selectedCategory,
        method: selectedMethod,
        ingredients: MOCK_INGREDIENTS
      }
    } else {
      // multipart: ส่งรูปให้ backend เอาไปเข้า YOLO
      // ห้ามใส่ Content-Type เอง ให้ browser ใส่ boundary ให้
      body = new FormData()
      body.append('image', imageFile.value)
      body.append('selectionId', selectionId)
      body.append('category', selectedCategory)
      body.append('method', selectedMethod)
    }

    const response = await $fetch('/api/recipes/match', {
      method: 'POST',
      body
    })

    if (response?.success && response.data.length > 0) {
      currentRecipeState.value = response.data[0]
      router.push('/result')
    } else {
      alert('ไม่พบเมนูที่ตรงกับวัตถุดิบ ลองใหม่อีกครั้งนะ 🥺')
    }
  } catch (error) {
    console.error('API Error:', error)
    alert('ไม่สามารถเชื่อมต่อกับระบบตรวจสอบวัตถุดิบได้ ลองใหม่อีกครั้ง')
  } finally {
    isLoading.value = false
  }
}
// const analyzeIngredients = async () => {
//   if (!imageFile.value) return // ต้องมีไฟล์ภาพจริง
//   isLoading.value = true
  
//   try {
//     // 1. สร้าง FormData เพื่อเตรียมส่งไฟล์ภาพข้ามไปฝั่ง Backend
//     const formData = new FormData()
//     formData.append('image', imageFile.value)

//     // 2. ยิง API ไปที่ Backend ของคุณที่ต่อกับโมเดล YOLO (เช่น /api/detect หรือ /api/recipes/match)
//     // หรือถ้า Backend ของคุณรวมการ Detect ไว้ใน /api/recipes/match แล้ว ก็สามารถส่ง FormData ไปตรงๆ ได้เลย
//     const response = await $fetch('/api/recipes/match', {
//       method: 'POST',
//       body: {
//         // หากต้องการแยกสเต็ป ให้ส่งรูปไปdetectก่อน แล้วค่อยเอาผลลัพธ์มาส่ง 
//         // แต่นี่คือตัวอย่างการส่งข้อมูลที่ผ่านการประมวลผลจาก Backend แล้ว
//         category: selectedCategory, 
//         method: selectedMethod,
//         // (สมุดภาพ/ไฟล์จะถูกจัดการที่ฝั่ง Node.js Backend เพื่อส่งต่อให้ YOLO Model ทำงาน)
//       }
//     })

//     // 3. ตรวจสอบผลลัพธ์ที่ได้จากการ Match ของระบบ Rule-based
//     if (response && response.success && response.data.length > 0) {
//       // นำเมนูที่แมตช์ได้ดีที่สุด (Match % สูงสุด) ใส่ลงใน Global State
//       currentRecipeState.value = response.data[0] 
      
//       // ไปยังหน้าแสดงผลลัพธ์
//       router.push('/result')
//     } else {
//       alert('ไม่พบเมนูที่ตรงกับวัตถุดิบในภาพ ลองถ่ายใหม่อีกครั้งนะ 🥺')
//     }

//   } catch (error) {
//     console.error('API Error:', error)
//     alert('ไม่สามารถเชื่อมต่อกับระบบตรวจสอบวัตถุดิบได้ ลองใหม่อีกครั้ง')
//   } finally {
//     isLoading.value = false
//   }
// }
</script>