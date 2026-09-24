// server/api/test-db.get.ts
import { connectDB } from '~~/database/connection'

export default defineEventHandler(async () => {
  try {
    await connectDB()
    return { status: 'success', message: 'เชื่อมต่อ MongoDB สำเร็จ' }
  } catch (error) {
    return { status: 'error', message: String(error) }
  }
})