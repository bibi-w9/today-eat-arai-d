<template>
  <div class="relative min-h-[calc(100dvh-4rem)] bg-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden sm:min-h-[calc(100dvh-4.5rem)] sm:p-6">

    <!-- ของตกแต่งลอยๆ พื้นหลัง (หมวดหมู่อาหาร) -->
    <div class="absolute top-10 left-10 md:left-32 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">🥗</div>
    <div
      class="absolute bottom-20 left-16 md:left-40 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">
      🍱</div>
    <div class="absolute top-40 right-10 md:right-32 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">🌶️
    </div>
    <div
      class="absolute bottom-32 right-16 md:right-40 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">
      🍰</div>

    <!-- กล่องเนื้อหาหลัก -->
    <div
      class="relative z-10 w-full max-w-3xl rounded-[2rem] border-2 border-white bg-white/80 p-4 shadow-sm backdrop-blur-xl transition-all sm:rounded-[2.5rem] sm:p-8 md:p-10">

      <div class="mb-6 flex items-center justify-between">
        <button @click="router.push('/')"
          class="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white/80 px-3 py-2 text-sm font-semibold text-pink-600 shadow-sm transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 sm:px-4 sm:text-base">
          ◂ กลับ
        </button>
        <NuxtLink to="/" aria-label="หน้าแรก"
          class="group inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white p-0 font-bold text-gray-500 shadow-[0_4px_0_0_#e5e7eb] transition-all hover:bg-gray-50 hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm">
          <span aria-hidden="true" class="group-hover:rotate-12 transition-transform">🏠</span>
          <span class="sr-only sm:not-sr-only">หน้าแรก</span>
        </NuxtLink>
      </div>

      <div class="text-center mb-8 mt-4">
        <h2 class="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">เลือกสไตล์<span
            class="text-pink-500">อาหาร</span>ที่ใช่! 😋</h2>
        <p class="text-gray-500 mt-2 font-medium text-sm bg-pink-100 inline-block px-4 py-1 rounded-full text-pink-600">
          สเต็ป 1 / 4</p>
      </div>

      <!-- หมวดหมู่อาหาร (ทำเป็นปุ่มการ์ดใหญ่ๆ ให้น่ากด) -->
      <div class="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        <button v-for="cat in categories"
          :key="cat.id" @click="selectCategory(cat.id)"
          class="group flex flex-col items-center justify-center rounded-3xl border-4 p-3 transition-all duration-300 sm:p-6"
          :class="selectedCategory === cat.id ? 'bg-pink-50 border-pink-400 text-pink-600 shadow-md md:scale-105' : 'bg-white border-pink-100 text-gray-400 hover:bg-pink-50 hover:border-pink-200 md:hover:-translate-y-1'">
          <span class="mb-2 text-4xl transition-transform group-hover:scale-110 sm:mb-3 sm:text-5xl">{{ cat.icon }}</span>
          <span class="text-center text-base font-bold sm:text-lg" :class="selectedCategory === cat.id ? 'text-pink-600' : 'text-gray-600'">{{
            cat.label }}</span>
          <span class="mt-1 text-center text-[11px] opacity-70 sm:text-xs"
            :class="selectedCategory === cat.id ? 'text-pink-500' : 'text-gray-400'">{{ cat.desc }}</span>
        </button>
      </div>

      <!-- ปุ่มถัดไป (จะกดได้ก็ต่อเมื่อเลือกหมวดหมู่แล้ว) -->
      <button @click="goToNextStep" :disabled="!selectedCategory"
        class="group inline-flex w-full items-center justify-center rounded-2xl px-4 py-4 text-lg font-bold transition-all disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 sm:px-8 sm:text-xl"
        :class="selectedCategory ? 'bg-pink-400 text-white shadow-[0_6px_0_0_#be185d] hover:bg-pink-500 hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-[4px] active:scale-95' : 'bg-gray-200 text-gray-400 shadow-[0_6px_0_0_#d1d5db]'">
        ต่อไป (วิธีทำ)
        <span class="group-hover:translate-x-2 transition-transform duration-300 ease-in-out ml-2">➭</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// ใช้งาน Router ของ Nuxt เพื่อเปลี่ยนหน้า
const router = useRouter()
const route = useRoute()

// State เก็บค่าที่ผู้ใช้เลือก
const selectedCategory = ref(String(route.query.category || ''))
watch(() => route.query.category, (value) => {
  selectedCategory.value = String(value || '')
})

const selectCategory = (category) => {
  selectedCategory.value = category
  router.replace({ query: { category } })
}

// ข้อมูลหมวดหมู่อาหาร (เพิ่มคำบรรยายสั้นๆ ให้น่าอ่าน)
const categories = [
  { id: 'healthy', label: 'อาหารคลีน', icon: '🥗', desc: 'ผักแน่น โปรตีนสูง' },
  { id: 'normal', label: 'ทั่วไป', icon: '🍱', desc: 'เมนูตามสั่งยอดฮิต' },
  { id: 'high protein', label: 'โปรตีนสูง', icon: '🥩', desc: 'เน้นเนื้อสัตว์ สร้างกล้ามเนื้อ' },
  { id: 'vegan', label: 'มังสวิรัติ', icon: '🥦', desc: 'ไร้เนื้อสัตว์ ดีต่อสุขภาพ' }
]

// ฟังก์ชันสำหรับไปหน้าถัดไป
const goToNextStep = () => {
  if (!selectedCategory.value) return

  // นำทางไปหน้า /method พร้อมแนบค่า category ไปด้วยผ่าน URL (Query Parameter)
  router.push({
    path: '/method',
    query: { ...route.query, category: selectedCategory.value }
  })
}
</script>
