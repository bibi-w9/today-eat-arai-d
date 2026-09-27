import { getServerSession } from '#auth'
import { connectDB } from '~~/server/utils/mongoose'
import { SavedRecipe } from '~~/server/models/SavedRecipe'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const email = session?.user?.email
  if (!email) throw createError({ statusCode: 401, statusMessage: 'กรุณาเข้าสู่ระบบก่อน' })
  await connectDB()
  const records = await SavedRecipe.find({ userId: email }).sort({ createdAt: -1 }).lean()
  return { success: true, data: records.map(record => ({ ...record.recipe, savedId: record._id.toString(), savedAt: record.createdAt })) }
})
