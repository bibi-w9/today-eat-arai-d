<template>
  <div v-if="show" class="confetti-layer" aria-hidden="true">
    <span v-for="piece in pieces" :key="piece.id" class="confetti-piece" :style="piece.style"></span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()

const colors = ['#ec4899', '#fb7185', '#fbbf24', '#a78bfa', '#34d399', '#60a5fa']
const pieces = Array.from({ length: 36 }, (_, id) => ({
  id,
  style: {
    left: `${(id * 37 + 11) % 100}%`,
    backgroundColor: colors[id % colors.length],
    animationDelay: `${(id % 9) * 35}ms`,
    animationDuration: `${1050 + (id % 5) * 100}ms`,
    '--confetti-drift': `${((id * 19) % 180) - 90}px`,
    '--confetti-rotation': `${(id * 73) % 600}deg`
  }
}))
</script>

<style scoped>
.confetti-layer {
  position: fixed;
  inset: 0;
  z-index: 120;
  overflow: hidden;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  top: -12px;
  width: 8px;
  height: 13px;
  border-radius: 2px;
  opacity: 0;
  animation-name: confetti-fall;
  animation-timing-function: cubic-bezier(0.2, 0.65, 0.4, 1);
  animation-fill-mode: forwards;
}

@keyframes confetti-fall {
  0% { opacity: 0; transform: translate3d(0, 0, 0) rotate(0); }
  10% { opacity: 1; }
  100% { opacity: 0; transform: translate3d(var(--confetti-drift), 105vh, 0) rotate(var(--confetti-rotation)); }
}

@media (prefers-reduced-motion: reduce) {
  .confetti-piece { animation-duration: 0.01ms !important; }
}
</style>
