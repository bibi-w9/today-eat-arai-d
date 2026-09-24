import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return

  // ดึงค่า config ภายในฟังก์ชันเพื่อป้องกัน Nuxt Context Error
  const config = useRuntimeConfig()
  
  if (!config.mongodbUri) {
    throw new Error('MONGODB_URI is not defined in runtime config')
  }

  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(config.mongodbUri)
    isConnected = true
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    throw error
  }
}