<template>
  <Teleport to="body">
    <Transition name="app-toast">
      <div
        v-if="toast"
        role="status"
        aria-live="polite"
        class="fixed left-0 right-0 top-4 z-[120] mx-auto flex w-[calc(100%-2rem)] max-w-md items-center gap-3 rounded-2xl border-2 px-5 py-4 shadow-xl backdrop-blur-sm"
        :class="{
          'border-pink-200 bg-white/95 text-pink-700': toast.type === 'success',
          'border-rose-200 bg-white/95 text-rose-700': toast.type === 'error',
          'border-purple-200 bg-white/95 text-purple-700': toast.type === 'info'
        }"
      >
        <span class="text-2xl" aria-hidden="true">{{ icon }}</span>
        <p class="flex-1 font-bold">{{ toast.message }}</p>
        <button
          type="button"
          class="rounded-full px-2 py-1 text-sm opacity-60 transition hover:bg-pink-50 hover:opacity-100"
          aria-label="ปิดข้อความแจ้งเตือน"
          @click="dismiss"
        >
          ✕
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const toast = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' } | null>('appToast', () => null)
let timeout: ReturnType<typeof setTimeout> | undefined

const icon = computed(() => toast.value?.type === 'success' ? '✨' : toast.value?.type === 'error' ? '🥺' : '📖')

const dismiss = () => {
  toast.value = null
  if (timeout) clearTimeout(timeout)
  timeout = undefined
}

watch(toast, (value) => {
  if (timeout) clearTimeout(timeout)
  timeout = undefined
  if (value) timeout = setTimeout(dismiss, 3500)
})
</script>

<style scoped>
.app-toast-enter-active,
.app-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.app-toast-enter-from,
.app-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
