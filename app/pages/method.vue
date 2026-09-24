<template>
  <div class="relative min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 overflow-hidden">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง (อุปกรณ์และไฟ) -->
    <div class="absolute top-10 left-10 md:left-32 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">🍳</div>
    <div class="absolute bottom-20 left-16 md:left-40 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">🍲</div>
    <div class="absolute top-40 right-10 md:right-32 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">🔥</div>
    <div class="absolute bottom-32 right-16 md:right-40 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">🔪</div>

    <!-- กล่องเนื้อหาหลัก -->
    <div class="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-white transition-all">
      
      <!-- ปุ่มย้อนกลับ (ใช้ router.back() เพื่อกลับไปหน้าก่อนหน้าพร้อมจำค่าเดิม) -->
      <button @click="router.back()" class="absolute top-6 left-6 text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-1 text-sm font-bold">
        <span>◂ กลับ</span>
      </button>

      <div class="text-center mb-8 mt-4">
        <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight">อยากให้<span class="text-pink-500">ทำอาหาร</span>แบบไหน? 🧑‍🍳</h2>
        <p class="text-gray-500 mt-2 font-medium text-sm bg-pink-100 inline-block px-4 py-1 rounded-full text-pink-600">สเต็ป 2 / 3</p>
      </div>

      <!-- วิธีการทำอาหาร (วนลูปจาก filteredMethods แทน methods เดิม) -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <button 
          v-for="method in filteredMethods" :key="method.id"
          @click="selectedMethod = method.id"
          class="flex flex-col items-center justify-center p-5 rounded-3xl border-4 transition-all duration-300 group"
          :class="selectedMethod === method.id ? 'bg-pink-50 border-pink-400 text-pink-600 shadow-md scale-105' : 'bg-white border-pink-100 text-gray-400 hover:bg-pink-50 hover:border-pink-200 hover:-translate-y-1'"
        >
          <span class="text-4xl mb-3 group-hover:scale-110 transition-transform">{{ method.icon }}</span>
          <span class="font-bold text-lg" :class="selectedMethod === method.id ? 'text-pink-600' : 'text-gray-600'">{{ method.label }}</span>
        </button>
      </div>

      <!-- ปุ่มถัดไป -->
      <button 
        @click="goToNextStep"
        :disabled="!selectedMethod|| isSaving"
        class="group w-full inline-flex items-center justify-center font-bold text-xl py-4 px-8 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        :class="selectedMethod ? 'bg-pink-400 text-white shadow-[0_6px_0_0_#be185d] hover:bg-pink-500 hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-[4px] active:scale-95' : 'bg-gray-200 text-gray-400 shadow-[0_6px_0_0_#d1d5db]'"
      >
         {{ isSaving ? 'กำลังบันทึก...' : 'ต่อไป (แอบดูตู้เย็น) 👀' }}
        <span class="group-hover:translate-x-2 transition-transform duration-300 ease-in-out ml-2">➭</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue' // ดึง computed เข้ามาใช้งาน
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute() 

const selectedMethod = ref('')
const isSaving = ref(false)

// ข้อมูลวิธีการทำอาหารทั้งหมด (เก็บไว้เป็นฐานข้อมูลหลัก)
const allMethods = [
  { id: 'fry', label: 'ทอด', icon: '🍳' },
  { id: 'stir-fry', label: 'ผัด', icon: '🥘' },
  { id: 'boil', label: 'ต้ม / แกง', icon: '🍲' },
  { id: 'bake', label: 'ย่าง / อบ', icon: '🔥' },
  { id: 'steam', label: 'นึ่ง', icon: '🥟' },
]

// สร้าง Computed คัดกรองวิธีการทำอาหารแบบเรียลไทม์
const filteredMethods = computed(() => {
  // ดึงค่าหมวดหมู่ที่ส่งมาจากหน้าแรก
  const category = route.query.category 

  // ถ้าหมวดหมู่คือ 'healthy' ให้ตัด 'fry' (ทอด) และ 'salad' (ยำ) ทิ้งไป
  if (category === 'healthy') {
    return allMethods.filter(method => method.id !== 'fry' && method.id !== 'salad')
  }
  
  // ถ้าเป็นหมวดหมู่อื่น ให้แสดงวิธีทำอาหารทั้งหมดตามปกติ
  return allMethods
})

const goToNextStep = async () => {
  if (!selectedMethod.value || isSaving.value) return

  const category = route.query.category
  // กันคนเข้าหน้านี้ตรงๆ โดยไม่ผ่านหน้าเลือกหมวดหมู่
  if (!category) {
    router.replace('/category')
    return
  }

  isSaving.value = true
  try {
    const res = await $fetch('/api/selections', {
      method: 'POST',
      body: { category, method: selectedMethod.value }
    })

    router.push({
      path: '/upload',
      query: {
        category,
        method: selectedMethod.value,
        selectionId: res.data.selectionId
      }
    })
  } catch (error) {
    console.error('บันทึกตัวเลือกไม่สำเร็จ:', error)
    alert('บันทึกตัวเลือกไม่สำเร็จ ลองอีกครั้งนะ 🥺')
  } finally {
    isSaving.value = false
  }
}
</script>