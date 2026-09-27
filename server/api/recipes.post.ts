import { getServerSession } from '#auth'
import { connectDB } from '~~/server/utils/mongoose'
import { SavedRecipe } from '~~/server/models/SavedRecipe'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  const email = session?.user?.email
  if (!email) throw createError({ statusCode: 401, statusMessage: 'กรุณาเข้าสู่ระบบก่อน' })
  const recipe = await readBody<Record<string, any>>(event)
  if (!recipe?.name) throw createError({ statusCode: 400, statusMessage: 'ข้อมูลเมนูไม่ครบถ้วน' })
  await connectDB()
  const recipeKey = String(recipe._id || recipe.name)
  if (await SavedRecipe.exists({ userId: email, recipeKey })) return { success: false, message: 'เมนูนี้อยู่ในสมุดจดแล้วนะ' }
  await SavedRecipe.create({ userId: email, userEmail: email, recipeKey, recipe })
  return { success: true, message: 'บันทึกเมนูเรียบร้อยแล้ว!' }
})
