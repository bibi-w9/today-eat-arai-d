console.log('MONGODB_URI from env:', process.env.MONGODB_URI)
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03', 
  modules: ['@nuxtjs/tailwindcss'],
  
  // 1. ดึงฟอนต์ Prompt จาก Google Fonts มาใส่ในโปรเจค
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Mali:wght@200;300;400;500;600;700&display=swap' }
      ]    }
  },

  // 2. ตั้งค่าให้ Tailwind เปลี่ยนฟอนต์พื้นฐาน (sans) เป็น Mali
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