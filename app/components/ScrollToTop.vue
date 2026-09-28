<template>
  <Transition name="scroll-button">
    <button
      v-if="isVisible"
      type="button"
      aria-label="เลื่อนกลับขึ้นด้านบน"
      title="เลื่อนกลับขึ้นด้านบน"
      class="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-200 bg-white/95 text-xl font-bold text-pink-500 shadow-[0_4px_0_0_#fbcfe8] backdrop-blur-sm transition hover:-translate-y-1 hover:bg-pink-50 active:translate-y-0"
      @click="scrollToTop"
    >
      ↑
    </button>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isVisible = ref(false)

const updateVisibility = () => {
  isVisible.value = window.scrollY > 250
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  updateVisibility()
  window.addEventListener('scroll', updateVisibility, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility)
})
</script>

<style scoped>
.scroll-button-enter-active,
.scroll-button-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.scroll-button-enter-from,
.scroll-button-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>