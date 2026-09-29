<template>
  <div class="relative min-h-[calc(100dvh-4rem)] bg-pink-50 flex flex-col items-center py-5 px-3 overflow-hidden sm:min-h-[calc(100dvh-4.5rem)] sm:px-4 sm:py-8">

    <!-- ของตกแต่งลอยๆ พื้นหลัง -->
    <div class="absolute top-10 left-4 md:left-20 text-4xl animate-[bounce_4s_infinite_alternate] opacity-40">✨</div>
    <div
      class="absolute bottom-20 left-10 md:left-32 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-40">
      🎀</div>
    <div class="absolute top-32 right-10 md:right-24 text-5xl animate-[bounce_6s_infinite_alternate] opacity-40">💖
    </div>
    <div
      class="absolute bottom-32 right-8 md:right-32 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-40">
      📖</div>

    <div class="relative z-10 w-full max-w-6xl">
      <!-- ปุ่มกลับและหน้าแรก -->
      <div class="mb-6 flex items-center justify-between">
        <button @click="router.back()" aria-label="ย้อนกลับ"
          class="group inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-pink-200 bg-white/90 p-0 text-sm font-bold text-pink-500 shadow-[0_4px_0_0_#fbcfe8] backdrop-blur-sm transition-all hover:bg-pink-50 hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#f9a8d4] active:shadow-none active:translate-y-[4px] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm">
          <span aria-hidden="true" class="group-hover:-translate-x-1 transition-transform sm:text-lg">◀</span>
          <span class="sr-only sm:not-sr-only">ย้อนกลับ</span>
        </button>
        <NuxtLink to="/" aria-label="หน้าแรก"
          class="group inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white p-0 font-bold text-gray-500 shadow-[0_4px_0_0_#e5e7eb] transition-all hover:bg-gray-50 hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm">
          <span aria-hidden="true" class="group-hover:rotate-12 transition-transform">🏠</span>
          <span class="sr-only sm:not-sr-only">หน้าแรก</span>
        </NuxtLink>
      </div>

      <!-- หัวข้อหน้าสมุดจดเมนู -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          สมุดจดเมนูแสนอร่อย 📖
        </h1>
      </div>

      <div v-if="status === 'loading'" class="mx-auto mt-10 max-w-2xl rounded-[3rem] border-2 border-white bg-white/80 p-10 text-center shadow-sm" role="status">
        <div class="mb-4 text-6xl">📖</div>
        <p class="font-bold text-pink-600">กำลังเปิดสมุดจดของคุณ...</p>
      </div>

      <!-- ================= กรณียังไม่ได้เข้าสู่ระบบ ================= -->
      <div v-if="status === 'unauthenticated'"
        class="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center rounded-[2rem] border-2 border-red-400 bg-white/80 p-6 text-center shadow-sm backdrop-blur-xl sm:mt-10 sm:rounded-[3rem] sm:p-10 md:p-16">
        <div class="text-7xl mb-6">🔒</div>
        <h2 class="mb-4 text-xl font-extrabold text-gray-800 sm:text-2xl md:text-3xl">กรุณาเข้าสู่ระบบก่อนนะ</h2>
        <p class="mb-8 text-base font-medium text-gray-500 sm:text-lg">เข้าสู่ระบบด้วยบัญชี Google ของคุณ
          เพื่อดู<br>และเก็บเมนูโปรดของคุณไว้ในสมุดจด</p>
        <button @click="goToLogin"
          class="inline-flex items-center justify-center rounded-[1.5rem] bg-pink-500 px-6 py-4 text-lg font-bold text-white shadow-[0_6px_0_0_#9d174d] transition-all hover:bg-pink-600 hover:translate-y-[2px] sm:px-10 sm:text-xl">
          👤 ไปเข้าสู่ระบบ
        </button>
      </div>

      <!-- ================= กรณีมีเมนู (Grid Layout) ================= -->
      <div v-else-if="savedRecipes.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">

        <!-- การ์ดเมนูแต่ละอัน -->
        <div v-for="(recipe, index) in savedRecipes" :key="recipe.savedId || index"
          class="group relative flex flex-col rounded-[1.5rem] border-2 border-white bg-white/90 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-pink-200 hover:shadow-md sm:rounded-[2rem] sm:p-5">

          <!-- ปุ่มลบเมนู (ถังขยะ) -->
          <button @click="openDeleteModal(recipe)"
            :aria-label="`ลบเมนู ${recipe.name}`"
            class="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-100 bg-white/95 text-lg font-bold text-red-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-500 active:scale-90 sm:right-7 sm:top-7 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            🗑️
          </button>

          <!-- รูปอาหาร -->
          <div class="w-full aspect-square rounded-2xl overflow-hidden mb-4 relative">
            <img :src="getRecipeImage(recipe)" :alt="recipe.name || 'เมนูอาหาร'"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent pointer-events-none"></div>
          </div>

          <!-- ข้อมูลเมนู -->
          <h2 class="text-xl font-extrabold text-gray-800 mb-3 line-clamp-1">{{ recipe.name }}</h2>

          <div class="flex flex-wrap gap-2 mb-6">
            <span
              class="inline-flex items-center gap-1 bg-rose-50 text-rose-500 px-3 py-1.5 rounded-xl font-bold text-xs border border-rose-100">
              🔥 {{ recipe.caloriesTotal || 0 }} kcal
            </span>
            <span
              class="inline-flex items-center gap-1 bg-blue-50 text-blue-500 px-3 py-1.5 rounded-xl font-bold text-xs border border-blue-100">
              🎯 {{ recipe.matchPercent || 0 }}% ตรงใจ
            </span>
          </div>

          <!-- ปุ่มดูวิธีทำ -->
          <button @click="viewRecipe(recipe)"
            class="mt-auto w-full inline-flex items-center justify-center font-bold text-base py-3 rounded-2xl transition-all duration-200 bg-pink-100 text-pink-600 border-2 border-pink-200 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:shadow-[0_4px_0_0_#9d174d] hover:-translate-y-1 active:shadow-none active:translate-y-[2px]">
            ดูวิธีทำ 👩🏻‍🍳
          </button>
        </div>

      </div>

      <!-- ================= กรณีไม่มีเมนู (Empty State) ================= -->
      <div v-else-if="status === 'authenticated'"
        class="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center rounded-[2rem] border-2 border-white bg-white/80 p-6 text-center shadow-sm backdrop-blur-xl sm:mt-10 sm:rounded-[3rem] sm:p-10 md:p-16">
        <div class="text-7xl mb-6 animate-[bounce_2s_infinite]">🥺</div>
        <h2 class="mb-4 text-xl font-extrabold text-gray-800 sm:text-2xl md:text-3xl">สมุดจดยังว่างเปล่าเลย!</h2>
        <p class="mb-8 text-base font-medium text-gray-500 sm:text-lg">คุณยังไม่ได้บันทึกเมนูไหนไว้เลย ลองค้นหาเมนูอร่อยๆ
          จากของในตู้เย็นดูไหม?</p>
        <button @click="router.push('/upload')"
          class="group inline-flex items-center justify-center rounded-[1.5rem] bg-pink-500 px-6 py-4 text-lg font-bold text-white shadow-[0_6px_0_0_#9d174d] transition-all duration-200 hover:bg-pink-600 hover:shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] sm:px-10 sm:text-xl">
          <span class="mr-2 group-hover:scale-125 transition-transform duration-300">✨</span> ไปเสกเมนูกันเลย!
        </button>
      </div>

    </div>

    <Teleport to="body">
      <Transition name="delete-modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-pink-950/30 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          @click.self="closeDeleteModal"
        >
          <section class="w-full max-w-sm rounded-[1.5rem] border-2 border-pink-100 bg-white p-5 text-center shadow-2xl sm:rounded-[2rem] sm:p-7">
            <div class="mb-4 text-6xl" aria-hidden="true">🥺</div>
            <h2 id="delete-modal-title" class="text-xl font-extrabold text-gray-800 sm:text-2xl">
              ลบเมนูนี้ไหมนะ?
            </h2>
            <p class="mt-2 text-gray-500">
              “{{ recipeToDelete?.name }}” <br>
              จะถูกนำออกจากสมุดจดของคุณ
            </p>
            <p v-if="deleteError" class="mt-3 text-sm font-semibold text-red-500" role="alert">
              {{ deleteError }}
            </p>

            <div class="mt-6 flex justify-center gap-2 sm:gap-3">
              <button
                type="button"
                :disabled="isDeleting"
                class="flex-1 rounded-xl border-2 border-pink-200 bg-white px-3 py-2.5 text-sm font-bold text-pink-500 transition hover:bg-pink-50 disabled:opacity-60 sm:flex-none sm:px-5 sm:text-base"
                @click="closeDeleteModal"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                :disabled="isDeleting"
                class="flex-1 rounded-xl bg-pink-500 px-3 py-2.5 text-sm font-bold text-white shadow-[0_4px_0_0_#be185d] transition hover:bg-pink-600 disabled:cursor-wait disabled:opacity-60 sm:flex-none sm:px-5 sm:text-base"
                @click="confirmDeleteRecipe"
              >
                {{ isDeleting ? 'กำลังลบ...' : 'ลบเมนู' }}
              </button>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const savedRecipes = ref([])
const showDeleteModal = ref(false)
const recipeToDelete = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

const { status } = useAuth()
const { notify } = useAppToast()

const loadSavedRecipes = async () => {
  if (status.value === 'loading') return
  if (status.value !== 'authenticated') return
  try {
    const pending = import.meta.client ? sessionStorage.getItem('pendingRecipe') : null
    if (pending) {
      await $fetch('/api/recipes', { method: 'POST', body: JSON.parse(pending) })
      sessionStorage.removeItem('pendingRecipe')
    }
    const response = await $fetch('/api/recipes')
    savedRecipes.value = response.data || []
  } catch (error) {
    notify(error?.data?.statusMessage || 'โหลดสมุดจดไม่สำเร็จ ลองใหม่อีกครั้งนะ', 'error')
  }
}

onMounted(loadSavedRecipes)
watch(status, (value) => {
  if (value === 'authenticated') loadSavedRecipes()
})

const goToLogin = () => {
  router.push('/signup')
}

const openDeleteModal = (recipe) => {
  recipeToDelete.value = recipe
  deleteError.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  if (isDeleting.value) return
  showDeleteModal.value = false
  recipeToDelete.value = null
  deleteError.value = ''
}

const confirmDeleteRecipe = async () => {
  const recipe = recipeToDelete.value
  if (!recipe || isDeleting.value) return

  isDeleting.value = true
  deleteError.value = ''
  try {
    await $fetch(`/api/recipes/${recipe.savedId}`, { method: 'DELETE' })
    savedRecipes.value = savedRecipes.value.filter(item => item.savedId !== recipe.savedId)
    notify('นำเมนูออกจากสมุดจดแล้ว', 'success')
    showDeleteModal.value = false
    recipeToDelete.value = null
  } catch {
    deleteError.value = 'ลบเมนูไม่สำเร็จ ลองใหม่อีกครั้งนะ'
  } finally {
    isDeleting.value = false
  }
}

// ฟังก์ชันกดดูวิธีทำ
const viewRecipe = (recipe) => {
  useState('matchedRecipes').value = [recipe]
  if (import.meta.client) sessionStorage.setItem('viewedSavedRecipe', JSON.stringify(recipe))
  router.push({ path: '/result', query: { fromSaved: 'true', savedId: recipe.savedId } })
}

const getRecipeImage = (recipe) => {
  const image = Array.isArray(recipe?.image) ? recipe.image[0] : recipe?.image
  return image || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80'
}
</script>

<style scoped>
.delete-modal-enter-active,
.delete-modal-leave-active {
  transition: opacity 0.2s ease;
}

.delete-modal-enter-active section,
.delete-modal-leave-active section {
  transition: transform 0.2s ease;
}

.delete-modal-enter-from,
.delete-modal-leave-to {
  opacity: 0;
}

.delete-modal-enter-from section,
.delete-modal-leave-to section {
  transform: translateY(8px) scale(0.97);
}
</style>
