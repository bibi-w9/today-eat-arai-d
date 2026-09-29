<template>
  <main class="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-pink-50 px-4 py-8 sm:min-h-[calc(100dvh-4.5rem)] sm:py-10">
    <section
      class="w-full max-w-md rounded-[2rem] border-2 border-white bg-white/90 p-6 text-center shadow-sm sm:rounded-[2.5rem] sm:p-10"
    >
      <div class="mb-5 flex justify-end">
        <NuxtLink to="/" aria-label="หน้าแรก"
          class="group inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-gray-200 bg-white p-0 font-bold text-gray-500 shadow-[0_4px_0_0_#e5e7eb] transition-all hover:bg-gray-50 sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm">
          <span aria-hidden="true" class="group-hover:rotate-12 transition-transform">🏠</span>
          <span class="sr-only sm:not-sr-only">หน้าแรก</span>
        </NuxtLink>
      </div>
      <div
        class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-4xl"
        aria-hidden="true"
      >
        👩🏻‍🍳
      </div>

      <h1 class="text-3xl font-extrabold text-gray-800">
        เข้าสู่ระบบ
      </h1>

      <p class="mt-3 leading-relaxed text-gray-500">
        เข้าสู่ระบบด้วยบัญชี Google เพื่อบันทึกเมนูโปรดของคุณ
      </p>

      <button
        type="button"
        :disabled="isSigningIn"
        class="mt-8 w-full rounded-2xl bg-pink-500 px-6 py-4 font-bold text-white shadow-[0_5px_0_0_#9d174d] transition hover:bg-pink-600 disabled:cursor-wait disabled:opacity-60"
        @click="handleGoogleSignIn"
      >
        {{ isSigningIn ? 'กำลังไปยัง Google…' : 'เข้าสู่ระบบด้วย Google' }}
      </button>

    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const { signIn } = useAuth()
const { notify } = useAppToast()
const isSigningIn = ref(false)

const handleGoogleSignIn = async () => {
  isSigningIn.value = true

  try {
    await signIn('google', {
      callbackUrl: `${window.location.origin}/saved`
    })
  } catch (error) {
    isSigningIn.value = false
    notify('เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้งนะ', 'error')
  }
}
</script>
