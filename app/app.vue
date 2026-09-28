<template>
  <div>
    <!-- เมนูด้านบน: สมุดจดเมนู และโปรไฟล์ -->
    <div class="fixed top-6 right-6 z-50 flex items-center gap-3">
      <button v-if="route.path !== '/saved'" @click="handleSavedMenuClick" class="group inline-flex items-center gap-2 font-bold text-pink-500 bg-white/90 backdrop-blur-sm border-2 border-pink-200 px-5 py-2.5 rounded-2xl shadow-[0_4px_0_0_#fbcfe8] hover:bg-pink-50 hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#f9a8d4] active:shadow-none active:translate-y-[4px] transition-all">
        สมุดจดเมนู <span class="group-hover:scale-125 transition-transform duration-300 text-lg">📖</span>
      </button>

      <div class="relative">
        <button @click="profileOpen = !profileOpen" class="flex items-center gap-2 rounded-full bg-white/95 border-2 border-pink-200 p-1.5 pr-3 shadow-[0_4px_0_0_#fbcfe8] hover:bg-pink-50 transition-all" aria-label="เมนูโปรไฟล์">
          <img v-if="user?.image" :src="user.image" :alt="user.name || 'โปรไฟล์'" class="w-10 h-10 rounded-full object-cover" />
          <span v-else class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">👤</span>
          <span class="hidden sm:inline font-bold text-pink-600">โปรไฟล์</span>
        </button>

        <div v-if="profileOpen" class="absolute right-0 mt-3 w-64 rounded-2xl bg-white border-2 border-pink-100 p-4 shadow-xl">
          <template v-if="status === 'authenticated'">
            <div class="flex items-center gap-3 mb-3">
              <img v-if="user?.image" :src="user.image" class="w-11 h-11 rounded-full object-cover" />
              <span v-else class="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-xl">👤</span>
              <div class="min-w-0">
                <p class="font-bold text-gray-800 truncate">{{ user?.name || 'ผู้ใช้งาน' }}</p>
                <p class="text-xs text-gray-400 truncate">{{ user?.email }}</p>
              </div>
            </div>
            <button @click="handleSignOut" class="w-full rounded-xl border-2 border-red-100 bg-red-50 py-2 font-bold text-red-500 hover:bg-red-100">ออกจากระบบ</button>
          </template>
          <template v-else>
            <p class="mb-3 text-sm font-medium text-gray-500">เข้าสู่ระบบเพื่อบันทึกเมนูของคุณ</p>
            <button @click="handleSignIn" class="w-full rounded-xl bg-pink-500 py-2 font-bold text-white shadow-[0_3px_0_0_#9d174d] hover:bg-pink-600">เข้าสู่ระบบด้วย Google</button>
          </template>
        </div>
      </div>
    </div>

    <NuxtRouteAnnouncer />
    <NuxtPage />
    <MiniAssistant />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MiniAssistant from '~/components/MiniAssistant.vue'

const route = useRoute()
const router = useRouter()
const profileOpen = useState('profileOpen', () => false)
const { status, data, signIn, signOut } = useAuth()
const user = computed(() => data.value?.user || null)

const handleSavedMenuClick = () => {
  router.push('/saved')
}

const handleSignIn = () => {
  profileOpen.value = false
  signIn('google', { callbackUrl: `${window.location.origin}${route.fullPath}` })
}

const handleSignOut = async () => {
  profileOpen.value = false
  await signOut({ callbackUrl: `${window.location.origin}/` })
}
</script>

<style>
body {
  font-family: 'Mali', 'Quicksand', sans-serif;
}
</style>
