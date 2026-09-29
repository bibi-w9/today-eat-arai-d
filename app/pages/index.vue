<template>
  <!-- พื้นหลังสีชมพูอ่อน พร้อมป้องกันไม่ให้ของลอยๆ ล้นจอ (overflow-hidden) -->
  <div class="relative min-h-[calc(100dvh-4rem)] bg-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden sm:min-h-[calc(100dvh-4.5rem)] sm:p-6">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง (Fun element) -->
    <div class="absolute top-16 left-10 md:left-32 text-4xl animate-[bounce_4s_infinite_alternate] opacity-60">🍳</div>
    <div class="absolute bottom-32 left-16 md:left-40 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-60">🥦</div>
    <div class="absolute top-32 right-10 md:right-32 text-5xl animate-[bounce_6s_infinite_alternate] opacity-60">🥩</div>
    <div class="absolute bottom-24 right-16 md:right-40 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-60">🍙</div>

    <!-- กล่องเนื้อหาหลัก (Minimal & Clean) -->
    <div class="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 text-center shadow-sm border-2 border-white transition-transform duration-500 sm:rounded-[2.5rem] sm:p-10 sm:hover:scale-[1.02]">
      
      <!-- ไอคอนเชฟในวงกลม -->
      <div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-pink-100 shadow-inner sm:mb-6 sm:h-24 sm:w-24">
        <span class="text-4xl animate-pulse sm:text-5xl">👩🏻‍🍳</span>
      </div>

      <!-- หัวข้อ -->
      <h1 class="mb-2 text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl md:text-5xl">
        today eat
        <br/>
        <span class="text-pink-500 inline-block mt-2 relative">
          arai d?
          <!-- เส้นขีดเส้นใต้แบบน่ารัก (วาดด้วย SVG) -->
          <svg class="absolute w-full h-3 -bottom-2 left-0 text-pink-300 opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="4" fill="transparent" stroke-linecap="round"/>
          </svg>
        </span>
      </h1>

      <!-- รายละเอียดแบบกระชับ -->
      <p class="mt-5 mb-8 leading-relaxed font-medium text-gray-500 sm:mt-6 sm:mb-10">
        เปิดตู้เย็นแล้วคิดไม่ออก? <br/>
        ให้พวกเราช่วยเสกเมนูอร่อยจากของที่มีสิ! ✨
      </p>

      <!-- ปุ่ม 3D กดแล้วยุบตัว (Cute & Fun interaction) -->
      <NuxtLink 
        to="/category" 
        class="group inline-flex w-full items-center justify-center rounded-2xl bg-pink-400 px-4 py-4 text-lg font-bold text-white shadow-[0_6px_0_0_#be185d] transition-all hover:bg-pink-500 hover:shadow-[0_2px_0_0_#be185d] hover:translate-y-[4px] active:scale-95 sm:px-8 sm:text-xl"
      >
        <span class="group-hover:animate-bounce mr-2 transition-all"></span> ไปกันเลย !
      </NuxtLink>

    </div>
  </div>
</template>

<script setup>
// ดีไซน์ใหม่นี้ใช้แค่ CSS ล้วนๆ ไม่ต้องพึ่ง Javascript เลยครับ!
</script>
