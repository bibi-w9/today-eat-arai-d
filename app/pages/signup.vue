<template>
  <main class="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-pink-50 px-4 py-10">
    <section
      class="w-full max-w-md rounded-[2.5rem] border-2 border-white bg-white/90 p-8 text-center shadow-sm sm:p-10"
    >
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

      <NuxtLink
        to="/"
        class="mt-6 inline-block font-bold text-gray-400 transition hover:text-pink-500"
      >
        กลับหน้าแรก
      </NuxtLink>
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
