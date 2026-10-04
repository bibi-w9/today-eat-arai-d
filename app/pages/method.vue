<template>
  <div class="relative min-h-[calc(100dvh-4rem)] bg-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden sm:min-h-[calc(100dvh-4.5rem)] sm:p-6">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง (อุปกรณ์และไฟ) -->
    <div class="absolute top-10 left-10 md:left-32 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">🍳</div>
    <div class="absolute bottom-20 left-16 md:left-40 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">🍲</div>
    <div class="absolute top-40 right-10 md:right-32 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">🔥</div>
    <div class="absolute bottom-32 right-16 md:right-40 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">🔪</div>

    <!-- กล่องเนื้อหาหลัก -->
    <div class="relative z-10 w-full max-w-3xl rounded-[2rem] border-2 border-white bg-white/80 p-4 shadow-sm backdrop-blur-xl transition-all sm:rounded-[2.5rem] sm:p-8 md:p-10">
      
      <!-- ปุ่มย้อนกลับ (ใช้ router.back() เพื่อกลับไปหน้าก่อนหน้าพร้อมจำค่าเดิม) -->
      <div class="mb-6 flex items-center justify-between">
        <button @click="router.push({ path: '/category', query: { category: route.query.category } })" class="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white/80 px-3 py-2 text-sm font-semibold text-pink-600 shadow-sm transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 sm:px-4 sm:text-base">
          <span>◂ กลับ</span>
        </button>
        <NuxtLink to="/" aria-label="หน้าแรก"
          class="group inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white p-0 font-bold text-gray-500 shadow-[0_4px_0_0_#e5e7eb] transition-all hover:bg-gray-50 hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm">
          <span aria-hidden="true" class="motion-wiggle">🏠</span>
          <span class="sr-only sm:not-sr-only">หน้าแรก</span>
        </NuxtLink>
      </div>


      <div class="text-center mb-8 mt-4">
        <h2 class="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">อยากให้<span class="text-pink-500">ทำอาหาร</span>แบบไหน? 🧑‍🍳</h2>
        <p class="text-gray-500 mt-2 font-medium text-sm bg-pink-100 inline-block px-4 py-1 rounded-full text-pink-600">สเต็ป 2 / 4</p>
      </div>

      <!-- วิธีการทำอาหาร (วนลูปจาก filteredMethods แทน methods เดิม) -->
        <div class="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
        <button
          v-for="method in filteredMethods" :key="method.id"
          @click="selectMethod(method.id)"
          class="group flex flex-col items-center justify-center rounded-3xl border-4 p-3 transition-all duration-300 sm:p-5"
          :class="selectedMethod === method.id ? 'bg-pink-50 border-pink-400 text-pink-600 shadow-md md:scale-105' : 'bg-white border-pink-100 text-gray-400 hover:bg-pink-50 hover:border-pink-200 md:hover:-translate-y-1'"
        >
          <span class="motion-bounce mb-2 text-3xl sm:mb-3 sm:text-4xl">{{ method.icon }}</span>
          <span class="text-center text-sm font-bold sm:text-lg" :class="selectedMethod === method.id ? 'text-pink-600' : 'text-gray-600'">{{ method.label }}</span>
        </button>
      </div>

      <!-- ปุ่มถัดไป -->
      <button 
        @click="goToNextStep"
        :disabled="!selectedMethod"
        class="group inline-flex w-full items-center justify-center rounded-2xl px-4 py-4 text-lg font-bold transition-all disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 sm:px-8 sm:text-xl"
        :class="selectedMethod ? 'bg-pink-400 text-white shadow-[0_6px_0_0_#be185d] hover:bg-pink-500 hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-[4px] active:scale-95' : 'bg-gray-200 text-gray-400 shadow-[0_6px_0_0_#d1d5db]'"
      >
         ต่อไป (อัปโหลดรูปวัตถุดิบ) 👀
        <span class="motion-bounce ml-2">➭</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute() 

const selectedMethod = ref(String(route.query.method || ''))
watch(() => route.query.method, (value) => {
  selectedMethod.value = String(value || '')
})

const selectMethod = (method) => {
  selectedMethod.value = method
  router.replace({ query: { ...route.query, method } })
}

// ข้อมูลวิธีการทำอาหารทั้งหมด (เก็บไว้เป็นฐานข้อมูลหลัก)
const allMethods = [
  { id: 'fry', label: 'ทอด', icon: '🍳' },
  { id: 'stir_fry', label: 'ผัด', icon: '🥘' },
  { id: 'boil', label: 'ต้ม / แกง', icon: '🍲' },
  { id: 'microwave', label: 'ไมโครเวฟ / อบ', icon: '♨️' },
  { id: 'steamed', label: 'นึ่ง', icon: '🥟' },
]

// สร้าง Computed คัดกรองวิธีการทำอาหารแบบเรียลไทม์
const filteredMethods = computed(() => {
  // ดึงค่าหมวดหมู่ที่ส่งมาจากหน้าแรก
  const category = route.query.category 

  // ถ้าหมวดหมู่คือ 'healthy' ให้ตัดเมนูทอดออก
  if (category === 'healthy') {
    return allMethods.filter(method => method.id !== 'fry' && method.id !== 'salad')
  }
  
  // ถ้าเป็นหมวดหมู่อื่น ให้แสดงวิธีทำอาหารทั้งหมดตามปกติ
  return allMethods
})

const goToNextStep = () => {
  if (!selectedMethod.value) return

  const category = route.query.category
  // กันคนเข้าหน้านี้ตรงๆ โดยไม่ผ่านหน้าเลือกหมวดหมู่
  if (!category) {
    router.replace('/category')
    return
  }

  router.push({ path: '/upload', query: { category, method: selectedMethod.value } })
}
</script>
