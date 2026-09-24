<template>
  <div class="relative min-h-screen bg-pink-50 flex flex-col items-center py-10 px-4 overflow-hidden">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง -->
    <div class="absolute top-10 left-4 md:left-20 text-4xl animate-[bounce_4s_infinite_alternate] opacity-40">✨</div>
    <div class="absolute bottom-20 left-10 md:left-32 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-40">🎀</div>
    <div class="absolute top-32 right-10 md:right-24 text-5xl animate-[bounce_6s_infinite_alternate] opacity-40">💖</div>
    <div class="absolute bottom-32 right-8 md:right-32 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-40">📖</div>

    <!-- Container หลัก -->
    <div class="relative z-10 w-full max-w-6xl">
      
      <!-- ================= Header ================= -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <!-- ปุ่มย้อนกลับไปหน้า Result (ถ้าเพิ่งเสกเมนูมา) หรือกลับหน้าแรก -->
        <button @click="router.back()" class="group inline-flex items-center justify-center font-bold text-lg py-3 px-6 rounded-2xl transition-all duration-200 text-pink-500 bg-white border-2 border-pink-200 shadow-[0_4px_0_0_#fbcfe8] hover:bg-pink-50 hover:shadow-[0_2px_0_0_#f9a8d4] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]">
          <span class="mr-2 group-hover:-translate-x-1 transition-transform">◀</span> ย้อนกลับ
        </button>

        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-center flex-1">
          สมุดจดเมนูแสนอร่อย 📖
        </h1>
        
        <!-- ปุ่มกลับหน้าหลัก (วางขวาเพื่อ Balance Layout) -->
        <button @click="router.push('/')" class="group inline-flex items-center justify-center font-bold text-lg py-3 px-6 rounded-2xl transition-all duration-200 text-gray-500 bg-white border-2 border-gray-200 shadow-[0_4px_0_0_#e5e7eb] hover:bg-gray-50 hover:shadow-[0_2px_0_0_#d1d5db] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]">
          <span class="mr-1 group-hover:rotate-12 transition-transform">🏠</span> หน้าแรก
        </button>
      </div>

      <!-- ================= กรณีมีเมนู (Grid Layout) ================= -->
      <div v-if="savedRecipes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        
        <!-- การ์ดเมนูแต่ละอัน -->
        <div v-for="(recipe, index) in savedRecipes" :key="recipe.id || index" class="bg-white/90 backdrop-blur-xl rounded-[2rem] p-5 shadow-sm border-2 border-white hover:shadow-md hover:border-pink-200 transition-all duration-300 relative group flex flex-col">
          
          <!-- ปุ่มลบเมนู (ถังขยะ) -->
          <button @click="deleteRecipe(index)" class="absolute top-7 right-7 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm text-red-400 rounded-full flex items-center justify-center text-lg font-bold border-2 border-red-100 shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
            🗑️
          </button>

          <!-- รูปอาหาร -->
          <div class="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative">
            <img :src="recipe.image" :alt="recipe.menuName" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
            <div class="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent pointer-events-none"></div>
          </div>

          <!-- ข้อมูลเมนู -->
          <h2 class="text-xl font-extrabold text-gray-800 mb-3 line-clamp-1">{{ recipe.menuName }}</h2>
          
          <div class="flex flex-wrap gap-2 mb-6">
            <span class="inline-flex items-center gap-1 bg-rose-50 text-rose-500 px-3 py-1.5 rounded-xl font-bold text-xs border border-rose-100">
              🔥 {{ recipe.calories }} kcal
            </span>
            <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-500 px-3 py-1.5 rounded-xl font-bold text-xs border border-blue-100">
              ⏱️ {{ recipe.time }} นาที
            </span>
          </div>

          <!-- ปุ่มดูวิธีทำ -->
          <button @click="viewRecipe(recipe)" class="mt-auto w-full inline-flex items-center justify-center font-bold text-base py-3 rounded-2xl transition-all duration-200 bg-pink-100 text-pink-600 border-2 border-pink-200 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:shadow-[0_4px_0_0_#9d174d] hover:-translate-y-1 active:shadow-none active:translate-y-[2px]">
            ดูวิธีทำ 👩🏻‍🍳
          </button>
        </div>

      </div>

      <!-- ================= กรณีไม่มีเมนู (Empty State) ================= -->
      <div v-else class="flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 shadow-sm border-2 border-white max-w-2xl mx-auto mt-10 text-center">
        <div class="text-7xl mb-6 animate-[bounce_2s_infinite]">🥺</div>
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4">สมุดจดยังว่างเปล่าเลย!</h2>
        <p class="text-gray-500 font-medium mb-8 text-lg">คุณยังไม่ได้บันทึกเมนูไหนไว้เลย ลองให้ AI ช่วยคิดเมนูอร่อยๆ จากของในตู้เย็นดูไหม?</p>
        <button @click="router.push('/upload')" class="group inline-flex items-center justify-center font-bold text-xl py-4 px-10 rounded-[1.5rem] transition-all duration-200 bg-pink-500 text-white shadow-[0_6px_0_0_#9d174d] hover:bg-pink-600 hover:shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]">
          <span class="mr-2 group-hover:scale-125 transition-transform duration-300">✨</span> ไปเสกเมนูกันเลย!
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const savedRecipes = ref([])

// เมื่อโหลดหน้าเว็บ ให้ดึงข้อมูลจริงๆ จาก localStorage มาแสดง
onMounted(() => {
  const existingSavedItems = localStorage.getItem('savedRecipes')
  if (existingSavedItems) {
    savedRecipes.value = JSON.parse(existingSavedItems)
  }
})

// ฟังก์ชันลบเมนู
const deleteRecipe = (index) => {
  if(confirm('แน่ใจนะว่าจะลบเมนูนี้ออกจากสมุดจด? 🥺')) {
    // 1. ลบออกจากตัวแปรบนหน้าจอ
    savedRecipes.value.splice(index, 1)
    
    // 2. บันทึกข้อมูลที่อัปเดตแล้วกลับไปทับใน localStorage
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes.value))
  }
}

// ฟังก์ชันกดดูวิธีทำ
const viewRecipe = (recipe) => {
  // เปลี่ยนไปหน้า Result
  router.push('/result')
}
</script>