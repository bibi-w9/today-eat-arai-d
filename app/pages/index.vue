<template>
  <!-- พื้นหลังไล่สีดูน่ากิน สไตล์แอปอาหาร -->
<div class="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex flex-col items-center justify-center p-6">    <div class="text-center max-w-lg">
      
      <!-- ไอคอนตกแต่ง (สามารถเปลี่ยนเป็นรูป Logo ของจริงได้ในอนาคต) -->
      <div class="text-7xl mb-6 animate-bounce">
        🧑‍🍳✨
      </div>

      <!-- ข้อความต้อนรับ -->
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
        today eat arai d?
      </h1>
      <p class="text-lg text-gray-600 mb-10 leading-relaxed">
        หมดปัญหาคิดเมนูไม่ออก! แค่ถ่ายรูปวัตถุดิบในตู้เย็น ให้ AI ช่วยรังสรรค์เมนูแสนอร่อยให้คุณภายในพริบตา
      </p>

      <!-- ปุ่มกด Start เปลี่ยนหน้าไปที่ /upload -->
      <NuxtLink 
        to="/upload" 
        class="inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-bold text-xl py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"      >
        เริ่มใช้งานเลย 
      </NuxtLink>

    </div>
  </div>
</template>

<script setup>
// หน้านี้เน้นแสดงผล UI จึงยังไม่ต้องใส่ Logic อะไรเพิ่มเติมครับ
</script>