// database/connection.ts
import mongoose from 'mongoose'

let isConnected = false

export async function connectDB() {
  if (isConnected) return

  const config = useRuntimeConfig()
  await mongoose.connect(config.mongodbUri)
  isConnected = true
  console.log('✅ MongoDB connected')
}