<template>
  <div>
    <!-- ปุ่มสมุดจดเมนู Global (แสดงทุกหน้า ยกเว้นหน้า /saved) -->
    <div v-if="route.path !== '/saved'" class="fixed top-6 right-6 z-50">
      <button @click="handleSavedMenuClick" class="group inline-flex items-center gap-2 font-bold text-pink-500 bg-white/90 backdrop-blur-sm border-2 border-pink-200 px-5 py-2.5 rounded-2xl shadow-[0_4px_0_0_#fbcfe8] hover:bg-pink-50 hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#f9a8d4] active:shadow-none active:translate-y-[4px] transition-all">
        สมุดจดเมนู <span class="group-hover:scale-125 transition-transform duration-300 text-lg">📖</span>
      </button>
    </div>

    <NuxtRouteAnnouncer />
    <NuxtPage />
    <MiniAssistant />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import MiniAssistant from '~/components/MiniAssistant.vue'

const route = useRoute()
const router = useRouter()
const { status, signIn } = useAuth()

const handleSavedMenuClick = () => {
  if (status.value !== 'authenticated') {
    alert('เข้าสู่ระบบก่อนนะ ถึงจะมีสมุดจดเมนูส่วนตัวไว้เก็บสูตรอร่อยๆ ได้! ✨')
    signIn('google', { callbackUrl: `${window.location.origin}/saved` })
  } else {
    router.push('/saved')
  }
}
</script>

<style>
body {
  font-family: 'Mali', 'Quicksand', sans-serif;
}
</style>
