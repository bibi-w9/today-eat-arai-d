import { getServerSession } from '#auth'
import { connectDB } from '~~/server/utils/mongoose'
import { SavedRecipe } from '~~/server/models/SavedRecipe'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const email = session?.user?.email
  if (!email) throw createError({ statusCode: 401, statusMessage: 'กรุณาเข้าสู่ระบบก่อน' })
  await connectDB()
  const id = getRouterParam(event, 'id')
  const deleted = await SavedRecipe.findOneAndDelete({ _id: id, userId: email })
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'ไม่พบเมนูนี้ในสมุดจด' })
  return { success: true }
})
