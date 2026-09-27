export default defineNuxtConfig({
  compatibilityDate: '2024-04-03', 
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth' // 1. เพิ่มโมดูล Auth ที่นี่
  ],
  
  // 2. ตั้งค่าให้ Nuxt Auth รู้ว่าไม่ต้องบังคับล็อกอินทุกหน้า
  auth: {
    globalAppMiddleware: false,
    // Auth.js endpoint ของแอปนี้อยู่ที่ /api/auth ไม่ใช่ origin ของเว็บไซต์
    // ปิดการอ่าน AUTH_ORIGIN อัตโนมัติ เพราะใน Docker ค่านี้เป็นเพียง origin
    // และถ้านำไปใช้เป็น baseURL จะทำให้คำขอ /session วนกลับเข้าหน้าเดิม
    baseURL: '/api/auth',
    originEnvKey: '',
    provider: {
      type: 'authjs',
      trustHost: true
    }
  },
  
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Mali:wght@200;300;400;500;600;700&display=swap' }
      ]    
    }
  },

  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Mali', 'sans-serif'],
          }
        }
      }
    }
  },

  runtimeConfig: {
    roboflowApiKey: process.env.ROBOFLOW_API_KEY,
    roboflowModel: 'your-fridge-model',
    roboflowVersion: '1',
    mongodbUri: process.env.MONGODB_URI,
    cloudinaryUrl: process.env.CLOUDINARY_URL
  }
})
