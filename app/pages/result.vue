<template>
  <div class="relative min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 overflow-hidden">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง -->
    <div class="absolute top-10 left-4 md:left-20 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">✨</div>
    <div class="absolute bottom-20 left-10 md:left-32 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">🎉</div>
    <div class="absolute top-32 right-10 md:right-24 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">💖</div>
    <div class="absolute bottom-32 right-8 md:right-32 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">🍽️</div>

    <!-- กล่องเนื้อหาหลัก (ปรับกว้างขึ้นเล็กน้อยเพื่อให้อ่านวิธีทำง่าย) -->
    <div class="relative z-10 w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 shadow-sm border-2 border-white mt-8 mb-8">
      
      <!-- Header: ทาด๊า! -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-800 tracking-tight">ทาด๊าาา! ✨</h1>
        <p class="text-pink-500 font-bold mt-2 text-lg">AI เสกเมนูนี้มาให้คุณ</p>
      </div>

      <!-- ส่วนรูปภาพ ชื่อเมนู และ แคลอรี่ -->
      <div class="flex flex-col items-center mb-8">
        <!-- รูปอาหาร (ใส่ placeholder ไว้ก่อน) -->
        <div class="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-pink-200 overflow-hidden shadow-lg mb-6 relative group">
          <img :src="mockData.image" alt="Food Result" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
          <div class="absolute inset-0 bg-pink-500/10 rounded-full pointer-events-none"></div>
        </div>

        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-800 text-center mb-3">{{ mockData.menuName }}</h2>
        
        <!-- ป้าย Tags -->
        <div class="flex flex-wrap gap-2 justify-center">
          <span class="inline-flex items-center gap-1 bg-rose-100 text-rose-600 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-rose-200">
            🔥 {{ mockData.calories }} kcal
          </span>
          <span class="inline-flex items-center gap-1 bg-blue-50 text-blue-500 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-blue-100">
            ⏱️ {{ mockData.time }} นาที
          </span>
        </div>
      </div>

      <!-- ส่วนที่ 1: วัตถุดิบ (Ingredients) -->
      <div class="mb-8 bg-pink-50/50 p-6 rounded-[2rem] border-2 border-pink-100">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span class="text-2xl">🛒</span> สิ่งที่ต้องเตรียม
        </h3>
        <ul class="space-y-3">
          <li v-for="(item, index) in mockData.ingredients" :key="index" class="flex justify-between items-center border-b border-pink-100/50 pb-2 last:border-0 last:pb-0">
            <span class="text-gray-600 font-medium flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-pink-400"></span>
              {{ item.name }}
            </span>
            <span class="text-pink-500 font-bold text-sm bg-white px-3 py-1 rounded-lg shadow-sm border border-pink-50">
              {{ item.amount }}
            </span>
          </li>
        </ul>
      </div>

      <!-- ส่วนที่ 2: วิธีทำ (Instructions) -->
      <div class="mb-10">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 px-2">
          <span class="text-2xl">👩🏻‍🍳</span> วิธีทำ (ง่ายนิดเดียว!)
        </h3>
        <div class="space-y-4">
          <div v-for="(step, index) in mockData.steps" :key="index" class="flex gap-4 bg-white border-2 border-pink-100 rounded-3xl p-5 shadow-sm hover:border-pink-300 hover:shadow-md transition-all group">
            <div class="flex-shrink-0 w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-extrabold text-lg group-hover:bg-pink-400 group-hover:text-white transition-colors">
              {{ index + 1 }}
            </div>
            <p class="text-gray-600 font-medium pt-2 leading-relaxed">
              {{ step }}
            </p>
          </div>
        </div>
      </div>

      <!-- ปุ่ม Action -->
      <div class="flex flex-col gap-3">
        <button class="group w-full inline-flex items-center justify-center font-bold text-xl py-4 px-8 rounded-[1.5rem] transition-all duration-200 bg-pink-500 text-white shadow-[0_6px_0_0_#9d174d] hover:bg-pink-600 hover:shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]">
          <span class="mr-2">🍽️</span> บันทึกเมนูนี้
        </button>
        <button @click="router.push('/')" class="w-full inline-flex items-center justify-center font-bold text-lg py-4 px-8 rounded-[1.5rem] transition-all text-gray-500 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:text-pink-500 active:scale-95">
          ทำเมนูอื่นต่อ ↺
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// ข้อมูลจำลอง (Mock Data) สำหรับแสดงผลรอเชื่อม API จริง
const mockData = {
  menuName: "ข้าวผัดอกไก่คลีนไข่ข้น",
  image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80", // ใช้รูปฟรีจาก Unsplash เป็นตัวอย่าง
  calories: 350,
  time: 15,
  ingredients: [
    { name: "ข้าวกล้อง (แช่เย็น)", amount: "1 ทัพพี" },
    { name: "อกไก่หั่นเต๋า", amount: "100 กรัม" },
    { name: "ไข่ไก่", amount: "2 ฟอง" },
    { name: "แครอทและต้นหอม", amount: "เล็กน้อย" },
    { name: "เครื่องปรุงโลว์โซเดียม", amount: "1 ช้อนชา" }
  ],
  steps: [
    "ฉีดสเปรย์น้ำมันมะกอกลงกระทะ นำอกไก่ลงไปรวนจนเกือบสุก",
    "ใส่ข้าวกล้องและแครอทลงไปผัดให้เข้ากัน ปรุงรสด้วยซอสโลว์โซเดียม",
    "ตอกไข่ไก่ลงไป ตีให้แตกแล้วเกลี่ยให้เคลือบข้าว รอจนไข่เริ่มเซ็ตตัว",
    "โรยต้นหอม ผัดให้เข้ากันอีกครั้ง ปิดเตา ตักเสิร์ฟได้เลย!"
  ]
}
</script>