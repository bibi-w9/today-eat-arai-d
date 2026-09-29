<template>
  <div class="min-h-screen bg-pink-50">
    <!-- เมนูด้านบน: สมุดจดเมนู และโปรไฟล์ -->
    <div class="relative z-30 flex h-16 items-center justify-end px-4 sm:h-[4.5rem] sm:px-6">
      <div ref="mobileMenuRef" class="relative sm:hidden" @mouseenter="cancelMobileMenuClose" @mouseleave="scheduleMobileMenuClose">
        <button
          class="inline-flex items-center gap-2 rounded-2xl border-2 border-pink-200 bg-white px-4 py-2 font-bold text-pink-600 shadow-[0_4px_0_0_#fbcfe8]"
          type="button"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-top-menu"
          @click="toggleMobileMenu"
        >
          เมนู <span aria-hidden="true">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>

      <div v-if="mobileMenuOpen" id="mobile-top-menu" class="absolute right-0 top-full mt-2 flex w-56 flex-col gap-2 rounded-2xl border-2 border-pink-100 bg-white p-3 shadow-xl">
        <button v-if="route.path !== '/saved'" @click="mobileMenuOpen = false; handleSavedMenuClick()" class="flex items-center justify-between rounded-xl bg-pink-50 px-3 py-2.5 font-bold text-pink-600">
          สมุดจดเมนู <span aria-hidden="true">📖</span>
        </button>
        <div ref="mobileProfileDropdownRef" class="relative" @mouseenter="cancelProfileClose" @mouseleave="scheduleProfileClose">
          <button @click="cancelProfileClose(); profileOpen = !profileOpen" class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-pink-600 hover:bg-pink-50" aria-label="เมนูโปรไฟล์" :aria-expanded="profileOpen">
            <img v-if="user?.image" :src="user.image" :alt="user.name || 'โปรไฟล์'" class="h-8 w-8 rounded-full object-cover" />
            <span v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">👤</span>
            <span class="text-sm">โปรไฟล์</span>
          </button>
          <div v-if="profileOpen" class="mt-2 rounded-xl border border-pink-100 bg-white p-3">
            <template v-if="status === 'authenticated'">
              <p class="mb-2 truncate text-sm font-bold text-gray-800">{{ user?.name || 'ผู้ใช้งาน' }}</p>
              <p class="mb-3 truncate text-xs text-gray-400">{{ user?.email }}</p>
              <button @click="handleSignOut" class="w-full rounded-xl border-2 border-red-100 bg-red-50 py-2 font-bold text-red-500">ออกจากระบบ</button>
            </template>
            <p v-else-if="status === 'loading'" class="text-sm text-gray-500" role="status">กำลังตรวจสอบสถานะบัญชี...</p>
            <NuxtLink v-else to="/signup" @click="profileOpen = false; mobileMenuOpen = false" class="block rounded-xl bg-pink-500 py-2 text-center font-bold text-white">ไปหน้าเข้าสู่ระบบ</NuxtLink>
          </div>
        </div>
      </div>
      </div>

      <div class="hidden items-center gap-3 sm:flex">
      <button v-if="route.path !== '/saved'" @click="handleSavedMenuClick" class="group inline-flex items-center gap-2 font-bold text-pink-500 bg-white/90 backdrop-blur-sm border-2 border-pink-200 px-5 py-2.5 rounded-2xl shadow-[0_4px_0_0_#fbcfe8] hover:bg-pink-50 hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#f9a8d4] active:shadow-none active:translate-y-[4px] transition-all">
        สมุดจดเมนู <span class="group-hover:scale-125 transition-transform duration-300 text-lg">📖</span>
      </button>
      <div
        ref="profileDropdownRef"
        class="relative"
        @mouseenter="cancelProfileClose"
        @mouseleave="scheduleProfileClose"
      >
        <button @click="cancelProfileClose(); profileOpen = !profileOpen" class="flex items-center gap-2 rounded-full bg-white/95 border-2 border-pink-200 p-1.5 pr-3 shadow-[0_4px_0_0_#fbcfe8] hover:bg-pink-50 transition-all" aria-label="เมนูโปรไฟล์">
          <img v-if="user?.image" :src="user.image" :alt="user.name || 'โปรไฟล์'" class="w-10 h-10 rounded-full object-cover" />
          <span v-else class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">👤</span>
          <span class="hidden sm:inline font-bold text-pink-600">โปรไฟล์</span>
        </button>

        <div v-if="profileOpen" class="absolute right-0 top-full h-3 w-64" aria-hidden="true"></div>

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
          <template v-else-if="status === 'loading'">
            <p class="text-sm font-medium text-gray-500" role="status">กำลังตรวจสอบสถานะบัญชี...</p>
          </template>
          <template v-else>
            <NuxtLink to="/signup" @click="profileOpen = false"
              class="block w-full rounded-xl bg-pink-500 py-2 text-center font-bold text-white shadow-[0_3px_0_0_#9d174d] hover:bg-pink-600">
              ไปหน้าเข้าสู่ระบบ
            </NuxtLink>
          </template>
        </div>
      </div>
      </div>
    </div>

    <NuxtRouteAnnouncer />
    <NuxtPage />
    <ScrollToTop />
    <AppToast />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScrollToTop from '~/components/ScrollToTop.vue'
import AppToast from '~/components/AppToast.vue'

const route = useRoute()
const router = useRouter()
const profileOpen = useState('profileOpen', () => false)
const mobileMenuOpen = ref(false)
const mobileMenuRef = ref(null)
const profileDropdownRef = ref(null)
const mobileProfileDropdownRef = ref(null)
let profileCloseTimeout
let mobileMenuCloseTimeout
const { status, data, signOut } = useAuth()
const user = computed(() => data.value?.user || null)

const cancelProfileClose = () => {
  if (profileCloseTimeout) clearTimeout(profileCloseTimeout)
  profileCloseTimeout = undefined
}

const cancelMobileMenuClose = () => {
  if (mobileMenuCloseTimeout) clearTimeout(mobileMenuCloseTimeout)
  mobileMenuCloseTimeout = undefined
}

const scheduleMobileMenuClose = () => {
  cancelMobileMenuClose()
  mobileMenuCloseTimeout = setTimeout(() => {
    mobileMenuOpen.value = false
    mobileMenuCloseTimeout = undefined
  }, 2500)
}

const toggleMobileMenu = () => {
  cancelMobileMenuClose()
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const scheduleProfileClose = () => {
  cancelProfileClose()
  profileCloseTimeout = setTimeout(() => {
    profileOpen.value = false
    profileCloseTimeout = undefined
  }, 2500)
}

const closeProfileOnOutsideClick = (event) => {
  if (!mobileMenuRef.value?.contains(event.target)) {
    mobileMenuOpen.value = false
  }
  if (!profileDropdownRef.value?.contains(event.target) && !mobileProfileDropdownRef.value?.contains(event.target)) {
    profileOpen.value = false
  }
}

const closeProfileOnEscape = (event) => {
  if (event.key === 'Escape') {
    profileOpen.value = false
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', closeProfileOnOutsideClick)
  document.addEventListener('keydown', closeProfileOnEscape)
})

onBeforeUnmount(() => {
  cancelProfileClose()
  cancelMobileMenuClose()
  document.removeEventListener('pointerdown', closeProfileOnOutsideClick)
  document.removeEventListener('keydown', closeProfileOnEscape)
})

const handleSavedMenuClick = () => {
  mobileMenuOpen.value = false
  router.push('/saved')
}

const handleSignOut = async () => {
  profileOpen.value = false
  mobileMenuOpen.value = false
  await signOut({ callbackUrl: `${window.location.origin}/` })
}
</script>

<style>
html,
body,
#__nuxt {
  min-height: 100%;
  background-color: #fdf2f8;
}

body {
  margin: 0;
}

body {
  font-family: 'Mali', 'Quicksand', sans-serif;
}
</style>
