<template>
  <div class="relative min-h-screen bg-pink-50 flex flex-col items-center py-10 px-4 overflow-hidden">
    
    <!-- ของตกแต่งลอยๆ พื้นหลัง -->
    <div class="absolute top-10 left-4 md:left-20 text-4xl animate-[bounce_4s_infinite_alternate] opacity-50">✨</div>
    <div class="absolute bottom-20 left-10 md:left-32 text-5xl animate-[bounce_5s_infinite_alternate-reverse] opacity-50">🎉</div>
    <div class="absolute top-32 right-10 md:right-24 text-5xl animate-[bounce_6s_infinite_alternate] opacity-50">💖</div>
    <div class="absolute bottom-32 right-8 md:right-32 text-4xl animate-[bounce_3s_infinite_alternate-reverse] opacity-50">🍽️</div>

    <!-- กล่องเนื้อหาหลัก (ขยายกว้างรองรับ 2 คอลัมน์) -->
    <div class="relative z-10 w-full max-w-xl lg:max-w-5xl bg-white/90 backdrop-blur-xl rounded-[3rem] p-6 md:p-10 lg:p-12 shadow-sm border-2 border-white my-auto">
      
      <!-- ================= 1. กล่องบน: Header & รูปภาพ & แคลอรี่ ================= -->
      <div class="flex flex-col items-center mb-12 border-b-2 border-pink-100/50 pb-10">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">ทาด๊าาา! ✨</h1>
          <p class="text-pink-500 font-bold mt-3 text-lg bg-pink-100 inline-block px-6 py-2 rounded-full">เสกเมนูนี้มาให้คุณ</p>
        </div>

        <!-- รูปอาหาร (โดดเด่นตรงกลาง) -->
        <div class="w-56 h-56 md:w-72 md:h-72 rounded-full border-4 border-pink-200 overflow-hidden shadow-xl mb-6 relative group">
          <img :src="mockData.image" alt="Food Result" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"/>
          <div class="absolute inset-0 bg-pink-500/10 rounded-full pointer-events-none"></div>
        </div>

        <!-- ชื่อเมนู -->
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-5 leading-snug">{{ mockData.menuName }}</h2>
        
        <!-- ป้าย Tags (แคลอรี่ และ เวลา) -->
        <div class="flex flex-wrap gap-3 justify-center">
          <span class="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-6 py-2.5 rounded-2xl font-extrabold text-base shadow-sm border-2 border-rose-200 hover:scale-105 transition-transform cursor-default">
            🔥 {{ mockData.calories }} kcal
          </span>
          <span class="inline-flex items-center gap-2 bg-blue-50 text-blue-500 px-6 py-2.5 rounded-2xl font-extrabold text-base shadow-sm border-2 border-blue-100 hover:scale-105 transition-transform cursor-default">
            ⏱️ {{ mockData.time }} นาที
          </span>
        </div>
      </div>

      <!-- ================= 2. คอลัมน์ล่าง: แบ่งซ้าย-ขวา ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-12">
        
        <!-- คอลัมน์ซ้าย: วัตถุดิบ (Ingredients) -->
        <div class="h-fit bg-pink-50 p-6 md:p-8 rounded-[2rem] border-2 border-pink-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span class="text-3xl">🛒</span> สัดส่วนวัตถุดิบ
          </h3>
          <ul class="space-y-4">
            <li v-for="(item, index) in mockData.ingredients" :key="index" class="flex justify-between items-center border-b-2 border-pink-100/50 pb-3 last:border-0 last:pb-0">
              <span class="text-gray-600 font-medium flex items-center gap-3 text-base">
                <span class="w-2.5 h-2.5 rounded-full bg-pink-400"></span>
                {{ item.name }}
              </span>
              <span class="text-pink-600 font-bold text-sm bg-white px-4 py-1.5 rounded-xl shadow-sm border-2 border-pink-50 whitespace-nowrap">
                {{ item.amount }}
              </span>
            </li>
          </ul>
        </div>

        <!-- คอลัมน์ขวา: วิธีทำ (Instructions) -->
        <div>
          <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3 px-2">
            <span class="text-3xl">👩🏻‍🍳</span> วิธีการทำ
          </h3>
          <div class="space-y-5">
            <div v-for="(step, index) in mockData.steps" :key="index" class="flex gap-4 md:gap-5 bg-white border-2 border-pink-100 rounded-3xl p-5 md:p-6 shadow-sm hover:border-pink-300 hover:shadow-md transition-all group">
              <div class="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-extrabold text-xl group-hover:bg-pink-400 group-hover:text-white transition-colors shadow-inner">
                {{ index + 1 }}
              </div>
              <p class="text-gray-600 font-medium pt-2 leading-relaxed text-base">
                {{ step }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- ================= 3. ส่วนล่างสุด: ปุ่ม Action ================= -->
      <!-- จัดเรียงปุ่มให้คู่กันบนจอคอม และเรียงซ้อนกันบนมือถือ -->
      <div class="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto">
        <button class="group flex-1 inline-flex items-center justify-center font-bold text-xl py-4 px-8 rounded-[1.5rem] transition-all duration-200 bg-pink-500 text-white shadow-[0_6px_0_0_#9d174d] hover:bg-pink-600 hover:shadow-[0_4px_0_0_#9d174d] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]">
          <span class="mr-2 group-hover:scale-110 transition-transform">🍽️</span> บันทึกเมนูนี้
        </button>
        <button @click="router.push('/')" class="group flex-1 inline-flex items-center justify-center font-bold text-xl py-4 px-8 rounded-[1.5rem] transition-all duration-200 text-pink-500 bg-white border-2 border-pink-200 shadow-[0_6px_0_0_#fbcfe8] hover:bg-pink-50 hover:border-pink-300 hover:shadow-[0_4px_0_0_#f9a8d4] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]">
          <span class="mr-2 group-hover:-rotate-45 transition-transform">↺</span> ทำเมนูอื่นต่อ
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
  image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
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