<template>
  <!-- ตำแหน่งคงที่ (Fixed) มุมขวาล่าง ให้ลอยตามไปทุกหน้า -->
  <div class="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end">
    
    <!-- ลูกโป่งคำพูด (Speech Bubble) -->
    <transition name="pop">
      <div 
        v-if="showMessage" 
        class="relative mb-3 bg-white/95 backdrop-blur-sm border-2 border-pink-200 px-5 py-3 rounded-2xl shadow-xl max-w-[220px] transform origin-bottom-right"
      >
        <p class="text-pink-600 font-bold text-sm md:text-base leading-relaxed text-center">
          {{ currentMessage }}
        </p>
        <!-- หางลูกโป่งคำพูด (สามเหลี่ยมชี้ลงไปที่ตัวละคร) -->
        <div class="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b-2 border-r-2 border-pink-200 transform rotate-45"></div>
      </div>
    </transition>

    <!-- ตัวละครผู้ช่วย (ออกแบบเป็นปุ่ม 3D เด้งดุ๊กดิ๊ก) -->
    <button
      @click="pokeAssistant"
      class="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-pink-100 to-pink-50 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-[0_5px_0_0_#fbcfe8] hover:bg-pink-100 hover:shadow-[0_3px_0_0_#fbcfe8] hover:translate-y-[2px] active:shadow-none active:translate-y-[5px] transition-all animate-[bounce_3s_infinite_alternate]"
    >
      <span class="drop-shadow-sm transition-transform duration-200" :class="{ 'scale-125': isPoked }">
        {{ currentEmoji }}
      </span>
      
      <!-- แก้มแดงตกแต่ง -->
      <div v-if="!isPoked" class="absolute top-[45%] left-3 w-2 h-1.5 bg-pink-300 rounded-full opacity-60"></div>
      <div v-if="!isPoked" class="absolute top-[45%] right-3 w-2 h-1.5 bg-pink-300 rounded-full opacity-60"></div>
    </button>
    
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isPoked = ref(false)
const showMessage = ref(true)

// ข้อความที่จะเปลี่ยนไปตามหน้า (Route) ที่ผู้ใช้อยู่
const routeMessages = {
  '/': 'หิวแล้วใช่มั้ยล่ะ? กดลุยเลย! ✨',
  '/category': 'วันนี้อยากกินสไตล์ไหนดีนะ? 😋',
  '/method': 'จะต้ม ผัด แกง ทอด บอกมาเลย! 🍳',
  '/upload': 'เปิดตู้เย็นด่วน! เดี๋ยวเราช่วยดูให้ 🧊',
  '/result': 'ว้าววว! น่ากินสุดๆ ไปเลย 💖'
}

// เช็คข้อความปัจจุบัน
const currentMessage = computed(() => {
  if (isPoked.value) return 'จิ้มเราทำไมเนี่ยยย! 😆'
  return routeMessages[route.path] || 'ให้เราช่วยคิดเมนูนะ!'
})

// เช็คหน้าตาปัจจุบัน (เปลี่ยนตอนโดนจิ้ม)
const currentEmoji = computed(() => {
  if (isPoked.value) return '😝' // ตอนโดนจิ้ม
  return '🥟' // หน้าตาปกติ (เปลี่ยนเป็น 👩🏻‍🍳 หรือ 🍓 ได้ตามชอบ)
})

// ฟังก์ชันตอนโดนผู้ใช้จิ้มเล่น (Poke)
const pokeAssistant = () => {
  if (isPoked.value) return
  isPoked.value = true
  showMessage.value = true
  
  // กลับเป็นปกติหลังผ่านไป 2.5 วินาที
  setTimeout(() => {
    isPoked.value = false
  }, 2500)
}

// ทำให้ลูกโป่งคำพูดกระพริบใหม่ทุกครั้งที่เปลี่ยนหน้า เพื่อดึงดูดความสนใจ
watch(() => route.path, () => {
  showMessage.value = false
  setTimeout(() => {
    showMessage.value = true
  }, 300)
})
</script>

<style scoped>
/* แอนิเมชันตอนลูกโป่งคำพูดเด้งขึ้นมา */
.pop-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  transition: all 0.2s ease-in;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}
</style>