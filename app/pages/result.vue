<template>
  <div class="relative min-h-[calc(100dvh-4rem)] bg-pink-50 flex flex-col items-center py-5 px-3 overflow-hidden sm:min-h-[calc(100dvh-4.5rem)] sm:px-4 sm:py-8">
    <ConfettiEffect :show="showConfetti" />

    <!-- ของตกแต่งลอยๆ พื้นหลัง -->
    <div class="absolute top-10 left-4 md:left-20 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">✨</div>
    <div
      class="absolute bottom-20 left-10 md:left-32 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">
      🎉</div>
    <div class="absolute top-32 right-10 md:right-24 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">💖
    </div>
    <div
      class="absolute bottom-32 right-8 md:right-32 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">
      🍽️</div>
    <div
      class="relative z-10 w-full max-w-xl rounded-[2rem] border-2 border-white bg-white/90 p-4 shadow-sm backdrop-blur-xl transition-all sm:rounded-[3rem] sm:p-6 md:p-10 lg:max-w-5xl lg:p-12">
      <div class="mb-6 flex items-center justify-between">
        <button @click="goBack"
          class="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white/80 px-4 py-2 font-semibold text-pink-600 shadow-sm transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700">
          ◂ กลับ
        </button>
        <NuxtLink to="/" aria-label="หน้าแรก"
          class="group inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white p-0 font-bold text-gray-500 shadow-[0_4px_0_0_#e5e7eb] transition-all hover:bg-gray-50 hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm">
          <span aria-hidden="true" class="motion-wiggle">🏠</span>
          <span class="sr-only sm:not-sr-only">หน้าแรก</span>
        </NuxtLink>
      </div>
      <!-- ================= หน้าที่ 1: แสดงรายการเมนู ================= -->
      <div v-if="isRestoringSavedRecipe" class="flex min-h-64 flex-col items-center justify-center text-center" role="status">
        <span class="mb-3 text-5xl">📖</span>
        <p class="text-lg font-bold text-pink-600">กำลังเปิดเมนูที่บันทึกไว้...</p>
      </div>

      <div v-else-if="!selectedRecipe" class="flex flex-col items-center w-full animate-fade-in">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl md:text-5xl">เลือกเมนูเลย! ✨</h1>
          <p class="mt-5 inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-pink-500 sm:mt-8 sm:px-6 sm:text-lg">เจอเมนูแนะนำ
            จำนวน {{ matchedRecipes.length }} อย่าง</p>
        </div>

        <div class="mb-6 grid w-full grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <div v-for="(recipe, index) in matchedRecipes" :key="index" @click="selectedRecipe = recipe"
            @keydown.enter.prevent="selectedRecipe = recipe" @keydown.space.prevent="selectedRecipe = recipe"
            role="button" tabindex="0" :aria-label="`ดูรายละเอียดเมนู ${recipe.name}`"
            class="group flex cursor-pointer flex-col items-center rounded-[2rem] border-2 border-pink-100 bg-pink-50/50 p-4 text-center shadow-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_8px_0_0_#fbcfe8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 sm:rounded-[2.5rem] sm:p-6 sm:hover:-translate-y-2">
            <div
              class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden shadow-md mb-5 relative">
              <img
                :src="getRecipeImage(recipe)"
                :alt="recipe.name || 'เมนูอาหาร'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            </div>
            <h3
              class="font-extrabold text-xl text-gray-800 mb-3 line-clamp-1 group-hover:text-pink-600 transition-colors">
              {{ recipe.name }}</h3>
            <div class="flex flex-wrap justify-center gap-2">
              <span class="rounded-full bg-purple-100 px-2.5 py-1.5 text-[11px] font-bold text-purple-600 sm:px-3 sm:text-xs">🎯 {{
                recipe.matchPercent }}%</span>
              <span class="rounded-full bg-rose-100 px-2.5 py-1.5 text-[11px] font-bold text-rose-600 sm:px-3 sm:text-xs">🔥 {{
                recipe.caloriesTotal || 0 }} kcal</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= หน้าที่ 2: แสดงรายละเอียดเมนู ================= -->
      <div v-else-if="selectedRecipe" class="w-full animate-fade-in">

        <div class="flex flex-col items-center mb-12 border-b-2 border-pink-100/50 pb-10">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl md:text-5xl">ทาด๊าาา! ✨</h1>
            <p class="mt-3 inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-pink-500 sm:px-6 sm:text-lg">
              เสกเมนูนี้มาให้คุณ</p>
          </div>

          <div
            class="w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-pink-200 overflow-hidden shadow-xl mb-6 relative group">
            <img
              :src="getRecipeImage(selectedRecipe)"
              :alt="selectedRecipe.name || 'เมนูอาหาร'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
            <div class="absolute inset-0 bg-pink-500/10 rounded-full pointer-events-none"></div>
          </div>

          <h2 class="mb-5 break-words text-center text-2xl font-extrabold leading-snug text-gray-800 sm:text-3xl md:text-4xl">{{
            selectedRecipe.name }}</h2>

          <div class="flex flex-wrap justify-center gap-2 sm:gap-3">
            <span
              class="inline-flex items-center gap-2 rounded-2xl border-2 border-rose-200 bg-rose-100 px-4 py-2.5 text-sm font-extrabold text-rose-600 shadow-sm sm:px-6 sm:text-base">
              🔥 {{ selectedRecipe.caloriesTotal || 0 }} kcal
            </span>
            <span
              class="inline-flex items-center gap-2 rounded-2xl border-2 border-purple-200 bg-purple-100 px-4 py-2.5 text-sm font-extrabold text-purple-600 shadow-sm sm:px-6 sm:text-base">
              🎯 ความเป๊ะ {{ selectedRecipe.matchPercent || 0 }}%
            </span>
          </div>
        </div>

        <div class="mb-8 grid grid-cols-1 gap-6 sm:mb-12 sm:gap-10 lg:grid-cols-2 lg:gap-14">
          <!-- คอลัมน์ซ้าย: วัตถุดิบ -->
          <div class="flex h-fit flex-col rounded-[1.5rem] border-2 border-pink-100 bg-pink-50 p-4 shadow-sm sm:rounded-[2rem] sm:p-6 md:p-8">
            <h3 class="mb-5 flex items-center gap-3 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">
              <span class="text-3xl">🛒</span> สิ่งที่คุณมี
            </h3>
            <ul class="space-y-3 mb-6">
              <li v-for="(item, index) in selectedRecipe.matched" :key="'match-' + index"
                class="flex items-start gap-2 border-b border-pink-100/50 pb-2 font-medium text-green-600">
                <span class="shrink-0" aria-hidden="true">✅</span><span class="min-w-0 break-words">{{ formatIngredient(item) }}</span>
              </li>
            </ul>

            <h3 class="mb-4 flex items-center gap-2 text-lg font-bold text-gray-700 sm:text-xl">
              <span class="text-2xl">🏃</span> สิ่งที่ต้องซื้อเพิ่ม
            </h3>
            <ul class="space-y-3 mb-6">
              <li v-if="!selectedRecipe.missing || selectedRecipe.missing.length === 0" class="text-gray-500 italic">
                มีครบทุกอย่างแล้ว เย้!</li>
              <li v-for="(item, index) in selectedRecipe.missing" :key="'miss-' + index"
                class="flex items-start gap-2 border-b border-pink-100/50 pb-2 font-medium text-red-500">
                <span class="shrink-0" aria-hidden="true">❌</span><span class="min-w-0 break-words">{{ formatIngredient(item) }}</span>
              </li>
            </ul>

            <div v-if="selectedRecipe.missing && selectedRecipe.missing.length > 0" class="mt-auto">
              <button @click="openDeliveryApp"
                class="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-4 py-3.5 text-sm font-extrabold text-white shadow-[0_4px_0_0_#15803d] transition-all hover:bg-green-600 hover:shadow-[0_2px_0_0_#15803d] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] sm:px-5 sm:text-base">
                <span class="shrink-0 text-xl">🛵</span><span>เปิดแอป Delivery เพื่อสั่งของที่ขาด</span>
              </button>
            </div>
          </div>

          <!-- คอลัมน์ขวา: วิธีทำ -->
          <div>
            <h3 class="mb-5 flex items-center gap-3 px-1 text-xl font-bold text-gray-800 sm:mb-6 sm:px-2 sm:text-2xl">
              <span class="text-3xl">👩🏻‍🍳</span> วิธีการทำ
            </h3>
            <div class="space-y-5">
              <div v-for="(step, index) in selectedRecipe.steps" :key="index"
                class="group flex gap-3 rounded-2xl border-2 border-pink-100 bg-white p-4 shadow-sm sm:gap-4 sm:rounded-3xl sm:p-5 md:gap-5 md:p-6">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 text-lg font-extrabold text-pink-600 shadow-inner sm:h-12 sm:w-12 sm:text-xl">
                  {{ index + 1 }}</div>
                <p class="min-w-0 break-words pt-1 text-sm font-medium leading-relaxed text-gray-600 sm:pt-2 sm:text-base">{{ step }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <button v-if="!fromSaved" @click="saveRecipe"
            class="group inline-flex flex-1 items-center justify-center rounded-2xl bg-pink-500 px-4 py-3.5 text-base font-bold text-white shadow-[0_6px_0_0_#9d174d] transition-all duration-200 hover:bg-pink-600 hover:shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] sm:rounded-[1.5rem] sm:px-8 sm:py-4 sm:text-xl">
            <span class="motion-bounce mr-2">🍽️</span> บันทึกเมนูนี้
          </button>
          <button @click="router.push('/upload')"
            class="group inline-flex flex-1 items-center justify-center rounded-2xl border-2 border-pink-200 bg-white px-4 py-3.5 text-base font-bold text-pink-500 shadow-[0_6px_0_0_#fbcfe8] transition-all duration-200 hover:border-pink-300 hover:bg-pink-50 hover:shadow-[0_4px_0_0_#f9a8d4] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] sm:rounded-[1.5rem] sm:px-8 sm:py-4 sm:text-xl">
            <span class="motion-wiggle mr-2">↺</span> ทำเมนูอื่นต่อ
          </button>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const { status, signIn } = useAuth()
const { notify } = useAppToast()
const showConfetti = ref(false)
let confettiTimeout
const celebrate = () => {
  showConfetti.value = false
  requestAnimationFrame(() => { showConfetti.value = true })
  if (confettiTimeout) clearTimeout(confettiTimeout)
  confettiTimeout = setTimeout(() => { showConfetti.value = false; confettiTimeout = undefined }, 1500)
}

const matchedRecipesState = useState('matchedRecipes', () => [])
if ((!matchedRecipesState.value || matchedRecipesState.value.length === 0) && import.meta.client) {
  const stored = sessionStorage.getItem('matchedRecipes')
  if (stored) matchedRecipesState.value = JSON.parse(stored)
}
const fromSaved = route.query.fromSaved === 'true'
if ((!matchedRecipesState.value || matchedRecipesState.value.length === 0) && !fromSaved) {
  router.push('/')
}
const matchedRecipes = computed(() => matchedRecipesState.value || [])
const requestedSavedId = String(route.query.savedId || '')
const selectedRecipe = ref(null)
const goBack = () => {
  if (fromSaved) {
    router.push('/saved')
    return
  }

  if (selectedRecipe.value) {
    selectedRecipe.value = null
    return
  }

  router.push({ path: '/upload', query: route.query })
}
if (fromSaved && matchedRecipes.value.length > 0) {
  selectedRecipe.value = matchedRecipes.value.find(recipe => String(recipe.savedId || '') === requestedSavedId)
    || (requestedSavedId ? null : matchedRecipes.value[0])
}
const isRestoringSavedRecipe = ref(fromSaved && !selectedRecipe.value)
const saveRecipeToServer = async () => {
  if (!selectedRecipe.value) return false
  try {
    const response = await $fetch('/api/recipes', { method: 'POST', body: selectedRecipe.value })
    notify(response.message || 'บันทึกเมนูเรียบร้อยแล้ว!', response.success ? 'success' : 'info')
    if (response.success) celebrate()
    return response.success
  } catch (error) {
    notify(error?.data?.statusMessage || 'บันทึกไม่ได้ เกิดข้อผิดพลาด 🥺', 'error')
    return false
  }
}

const saveRecipe = async () => {
  if (!selectedRecipe.value) return

  if (status.value !== 'authenticated') {
    sessionStorage.setItem('pendingRecipe', JSON.stringify(selectedRecipe.value))
    sessionStorage.setItem('matchedRecipes', JSON.stringify(matchedRecipes.value))
    router.push('/saved')
    return
  }
  await saveRecipeToServer()
}

const resumePendingSave = async () => {
  if (status.value !== 'authenticated' || !import.meta.client) return
  const pending = sessionStorage.getItem('pendingRecipe')
  if (!pending) return
  try {
    selectedRecipe.value = JSON.parse(pending)
    sessionStorage.removeItem('pendingRecipe')
    await saveRecipeToServer()
  } catch { sessionStorage.removeItem('pendingRecipe') }
}

const restoreSavedRecipe = async () => {
  if (!fromSaved || selectedRecipe.value || !import.meta.client) return

  try {
    const storedRecipe = sessionStorage.getItem('viewedSavedRecipe')
    if (storedRecipe) {
      const recipe = JSON.parse(storedRecipe)
      if (!requestedSavedId || String(recipe.savedId || '') === requestedSavedId) {
        selectedRecipe.value = recipe
        matchedRecipesState.value = [recipe]
      }
    }

    if (!selectedRecipe.value && requestedSavedId) {
      const response = await $fetch('/api/recipes')
      const recipe = (response.data || []).find(item => String(item.savedId || '') === requestedSavedId)
      if (recipe) {
        selectedRecipe.value = recipe
        matchedRecipesState.value = [recipe]
      }
    }
  } catch {
    // If the saved item cannot be restored, return to the saved recipes page below.
  } finally {
    isRestoringSavedRecipe.value = false
  }

  if (!selectedRecipe.value) router.replace('/saved')
}

onMounted(async () => {
  await restoreSavedRecipe()
  await resumePendingSave()
})
watch(status, resumePendingSave)
onBeforeUnmount(() => { if (confettiTimeout) clearTimeout(confettiTimeout) })

const getRecipeImage = (recipe) => {
  const image = Array.isArray(recipe?.image) ? recipe.image[0] : recipe?.image
  return image || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80'
}

const formatIngredient = (name) => {
  const ingredient = selectedRecipe.value?.ingredients?.find(item => item?.name === name)
  if (!ingredient || ingredient.amount === undefined || ingredient.amount === null || ingredient.amount === '') return name
  return `${name} · ${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ''}`
}

const openDeliveryApp = () => {
  if (!selectedRecipe.value?.missing?.length) return
  notify('ฟีเจอร์เชื่อมต่อแอป Delivery ยังไม่พร้อมใช้งาน', 'info')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
