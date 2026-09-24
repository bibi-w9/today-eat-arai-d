<template>
  <div class="relative min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 overflow-hidden">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง (หมวดหมู่อาหาร) -->
    <div class="absolute top-10 left-10 md:left-32 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">🥗</div>
    <div class="absolute bottom-20 left-16 md:left-40 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">🍱</div>
    <div class="absolute top-40 right-10 md:right-32 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">🌶️</div>
    <div class="absolute bottom-32 right-16 md:right-40 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">🍰</div>

    <!-- กล่องเนื้อหาหลัก -->
    <div class="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-sm border-2 border-white transition-all">
      
      <!-- ปุ่มย้อนกลับไปหน้าแรก -->
      <NuxtLink to="/" class="absolute top-6 left-6 text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-1 text-sm font-bold">
        <span>◂ กลับหน้าแรก</span>
      </NuxtLink>

      <div class="text-center mb-8 mt-4">
        <h2 class="text-3xl font-extrabold text-gray-800 tracking-tight">เลือกสไตล์<span class="text-pink-500">อาหาร</span>ที่ใช่! 😋</h2>
        <p class="text-gray-500 mt-2 font-medium text-sm bg-pink-100 inline-block px-4 py-1 rounded-full text-pink-600">สเต็ป 1 / 3</p>
      </div>

      <!-- หมวดหมู่อาหาร (ทำเป็นปุ่มการ์ดใหญ่ๆ ให้น่ากด) -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <button 
          v-for="cat in categories" :key="cat.id"
          @click="selectedCategory = cat.id"
          class="flex flex-col items-center justify-center p-6 rounded-3xl border-4 transition-all duration-300 group"
          :class="selectedCategory === cat.id ? 'bg-pink-50 border-pink-400 text-pink-600 shadow-md scale-105' : 'bg-white border-pink-100 text-gray-400 hover:bg-pink-50 hover:border-pink-200 hover:-translate-y-1'"
        >
          <span class="text-5xl mb-3 group-hover:scale-110 transition-transform">{{ cat.icon }}</span>
          <span class="font-bold text-lg" :class="selectedCategory === cat.id ? 'text-pink-600' : 'text-gray-600'">{{ cat.label }}</span>
          <span class="text-xs opacity-70 mt-1" :class="selectedCategory === cat.id ? 'text-pink-500' : 'text-gray-400'">{{ cat.desc }}</span>
        </button>
      </div>

      <!-- ปุ่มถัดไป (จะกดได้ก็ต่อเมื่อเลือกหมวดหมู่แล้ว) -->
      <button 
        @click="goToNextStep"
        :disabled="!selectedCategory"
        class="group w-full inline-flex items-center justify-center font-bold text-xl py-4 px-8 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        :class="selectedCategory ? 'bg-pink-400 text-white shadow-[0_6px_0_0_#be185d] hover:bg-pink-500 hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-[4px] active:scale-95' : 'bg-gray-200 text-gray-400 shadow-[0_6px_0_0_#d1d5db]'"
      >
        ต่อไป (วิธีทำ)
        <span class="group-hover:translate-x-2 transition-transform duration-300 ease-in-out ml-2">➭</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// ใช้งาน Router ของ Nuxt เพื่อเปลี่ยนหน้า
const router = useRouter()

// State เก็บค่าที่ผู้ใช้เลือก
const selectedCategory = ref('')

// ข้อมูลหมวดหมู่อาหาร (เพิ่มคำบรรยายสั้นๆ ให้น่าอ่าน)
const categories = [
  { id: 'clean', label: 'อาหารคลีน', icon: '🥗', desc: 'ผักแน่น โปรตีนสูง' },
  { id: 'normal', label: 'ทั่วไป', icon: '🍱', desc: 'เมนูตามสั่งยอดฮิต' },
  { id: 'spicy', label: 'รสจัดจ้าน', icon: '🌶️', desc: 'เผ็ดเปรี้ยว แซ่บถึงใจ' },
  { id: 'dessert', label: 'ของหวาน', icon: '🍰', desc: 'เติมน้ำตาลหน่อย' }
]

// ฟังก์ชันสำหรับไปหน้าถัดไป
const goToNextStep = () => {
  if (!selectedCategory.value) return
  
  // นำทางไปหน้า /method พร้อมแนบค่า category ไปด้วยผ่าน URL (Query Parameter)
  router.push({ 
    path: '/method', 
    query: { category: selectedCategory.value } 
  })
}
</script>