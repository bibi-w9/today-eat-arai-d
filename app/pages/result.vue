<template>
  <div class="relative min-h-screen bg-pink-50 flex flex-col items-center py-10 px-4 overflow-hidden">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง -->
    <div class="absolute top-10 left-4 md:left-20 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">✨</div>
    <div class="absolute bottom-20 left-10 md:left-32 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">🎉</div>
    <div class="absolute top-32 right-10 md:right-24 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">💖</div>
    <div class="absolute bottom-32 right-8 md:right-32 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">🍽️</div>

    <div class="relative z-10 w-full max-w-xl lg:max-w-5xl bg-white/90 backdrop-blur-xl rounded-[3rem] p-6 md:p-10 lg:p-12 shadow-sm border-2 border-white my-auto transition-all">
      
      <!-- ปุ่ม "ดูเมนูที่บันทึกไว้" -->
      <div class="w-full flex justify-end mb-4 -mt-2 md:-mt-6">
        <button @click="router.push('/saved')" class="group inline-flex items-center gap-2 font-bold text-pink-500 bg-white border-2 border-pink-200 px-5 py-2.5 rounded-2xl shadow-[0_4px_0_0_#fbcfe8] hover:bg-pink-50 hover:border-pink-300 hover:shadow-[0_2px_0_0_#f9a8d4] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all">
          สมุดจดเมนู <span class="group-hover:scale-125 transition-transform duration-300 text-lg">📖</span>
        </button>
      </div>

      <!-- ================= หน้าที่ 1: แสดงรายการ 5 กล่อง ================= -->
      <div v-if="!selectedRecipe" class="flex flex-col items-center w-full animate-fade-in">
        <div class="text-center mb-10">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">เลือกเมนูเลย! ✨</h1>
          <p class="text-pink-500 font-bold mt-3 text-lg bg-pink-100 inline-block px-6 py-2 rounded-full">เจอเมนูแนะนำ จำนวน {{ matchedRecipes.length }} อย่าง</p>
        </div>

        <!-- Grid กล่องเมนู -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
          <div 
            v-for="(recipe, index) in matchedRecipes" :key="index"
            @click="selectedRecipe = recipe"
            class="cursor-pointer bg-pink-50/50 rounded-[2.5rem] p-6 shadow-sm border-2 border-pink-100 hover:shadow-[0_8px_0_0_#fbcfe8] hover:-translate-y-2 hover:border-pink-300 transition-all duration-300 group flex flex-col items-center text-center"
          >
            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-md mb-5 relative">
              <img :src="recipe.image || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            </div>
            <h3 class="font-extrabold text-xl text-gray-800 mb-3 line-clamp-1 group-hover:text-pink-600 transition-colors">{{ recipe.name }}</h3>
            <div class="flex gap-2">
              <span class="text-xs font-bold bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full">🎯 {{ recipe.matchPercent }}%</span>
              <span class="text-xs font-bold bg-rose-100 text-rose-600 px-3 py-1.5 rounded-full">🔥 {{ recipe.caloriesTotal || 0 }} kcal</span>
            </div>
          </div>
        </div>

        <button @click="router.push('/')" class="text-gray-400 hover:text-pink-500 font-bold transition-colors">
          ↺ กลับไปหน้าแรก
        </button>
      </div>

      <!-- ================= หน้าที่ 2: แสดงรายละเอียดเมนู ================= -->
      <div v-else class="w-full animate-fade-in">
        
        <button @click="selectedRecipe = null" class="mb-6 text-gray-400 hover:text-pink-500 font-bold flex items-center gap-1 transition-colors">
          ◂ กลับไปหน้าเลือกเมนู
        </button>

        <div class="flex flex-col items-center mb-12 border-b-2 border-pink-100/50 pb-10">
          <div class="text-center mb-8">
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">ทาด๊าาา! ✨</h1>
            <p class="text-pink-500 font-bold mt-3 text-lg bg-pink-100 inline-block px-6 py-2 rounded-full">เสกเมนูนี้มาให้คุณ</p>
          </div>

          <div class="w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-pink-200 overflow-hidden shadow-xl mb-6 relative group">
            <img :src="selectedRecipe.image || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"/>
            <div class="absolute inset-0 bg-pink-500/10 rounded-full pointer-events-none"></div>
          </div>

          <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-5 leading-snug">{{ selectedRecipe.name }}</h2>
          
          <div class="flex flex-wrap gap-3 justify-center">
            <span class="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-6 py-2.5 rounded-2xl font-extrabold text-base shadow-sm border-2 border-rose-200 cursor-default">
              🔥 {{ selectedRecipe.caloriesTotal || 0 }} kcal
            </span>
            <span class="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-6 py-2.5 rounded-2xl font-extrabold text-base shadow-sm border-2 border-purple-200 cursor-default">
              🎯 ความเป๊ะ {{ selectedRecipe.matchPercent || 0 }}%
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-12">
          <!-- คอลัมน์ซ้าย: วัตถุดิบ -->
          <div class="h-fit bg-pink-50 p-6 md:p-8 rounded-[2rem] border-2 border-pink-100 shadow-sm">
            <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span class="text-3xl">🛒</span> สิ่งที่คุณมี
            </h3>
            <ul class="space-y-3 mb-6">
              <li v-for="(item, index) in selectedRecipe.matched" :key="'match-'+index" class="flex justify-between items-center text-green-600 font-medium border-b border-pink-100/50 pb-2">
                <span class="flex items-center gap-2"><span class="text-xl">✅</span> {{ item }}</span>
              </li>
            </ul>

            <h3 class="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span class="text-2xl">🏃</span> สิ่งที่ต้องซื้อเพิ่ม
            </h3>
            <ul class="space-y-3">
              <li v-if="!selectedRecipe.missing || selectedRecipe.missing.length === 0" class="text-gray-500 italic">มีครบทุกอย่างแล้ว เย้!</li>
              <li v-for="(item, index) in selectedRecipe.missing" :key="'miss-'+index" class="flex justify-between items-center text-red-500 font-medium border-b border-pink-100/50 pb-2">
                <span class="flex items-center gap-2"><span class="text-xl">❌</span> {{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- คอลัมน์ขวา: วิธีทำ -->
          <div>
            <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 px-2">
              <span class="text-3xl">👩🏻‍🍳</span> วิธีการทำ
            </h3>
            <div class="space-y-5">
              <div v-for="(step, index) in selectedRecipe.steps" :key="index" class="flex gap-4 md:gap-5 bg-white border-2 border-pink-100 rounded-3xl p-5 md:p-6 shadow-sm group">
                <div class="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-extrabold text-xl shadow-inner">{{ index + 1 }}</div>
                <p class="text-gray-600 font-medium pt-2 leading-relaxed text-base">{{ step }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <button @click="saveRecipe" class="group flex-1 inline-flex items-center justify-center font-bold text-xl py-4 px-8 rounded-[1.5rem] transition-all duration-200 bg-pink-500 text-white shadow-[0_6px_0_0_#9d174d] hover:bg-pink-600 hover:shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]">
            <span class="mr-2 group-hover:scale-110 transition-transform">🍽️</span> บันทึกเมนูนี้
          </button>
          <button @click="selectedRecipe = null" class="group flex-1 inline-flex items-center justify-center font-bold text-xl py-4 px-8 rounded-[1.5rem] transition-all duration-200 text-pink-500 bg-white border-2 border-pink-200 shadow-[0_6px_0_0_#fbcfe8] hover:bg-pink-50 hover:border-pink-300 hover:shadow-[0_4px_0_0_#f9a8d4] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]">
            <span class="mr-2 group-hover:-rotate-45 transition-transform">↺</span> ทำเมนูอื่นต่อ
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const router = useRouter()

// 1. ดึงข้อมูล Array ของเมนูทั้งหมดมา
const matchedRecipesState = useState('matchedRecipes')

// ถ้าเปิดมาหน้านี้โดยตรง ไม่มีข้อมูลสูตร ให้เด้งกลับไปหน้าแรก
if (!matchedRecipesState.value || matchedRecipesState.value.length === 0) {
  router.push('/')
}

const matchedRecipes = computed(() => matchedRecipesState.value || [])

// 2. State สำหรับเก็บเมนูที่ผู้ใช้คลิกเลือก (ถ้าเป็น null จะแสดงหน้ารายการ)
const selectedRecipe = ref(null)

// 3. ฟังก์ชันบันทึกสูตรอาหารลง DB
const saveRecipe = async () => {
  if (!selectedRecipe.value) return
  
  try {
    const response = await $fetch('/api/recipes', {
      method: 'POST',
      body: selectedRecipe.value
    })

    if (response.success) {
      alert(response.message || 'บันทึกเมนูเรียบร้อย!')
      router.push('/saved')
    } else {
      alert(response.message || 'เคยบันทึกเมนูนี้ไปแล้วน้า') 
    }

  } catch (error) {
    console.error('API Error:', error)
    alert('บันทึกไม่ได้ เกิดข้อผิดพลาด 🥺')
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>