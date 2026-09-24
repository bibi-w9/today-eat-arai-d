console.log('MONGODB_URI from env:', process.env.MONGODB_URI)
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03', // ถ้ามีวันที่อื่นอยู่แล้ว ใช้ของเดิมได้เลยครับ
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    roboflowApiKey: process.env.ROBOFLOW_API_KEY,
    roboflowModel: 'your-fridge-model',
    roboflowVersion: '1',
    mongodbUri: process.env.MONGODB_URI,
    cloudinaryUrl: process.env.CLOUDINARY_URL
  }
})