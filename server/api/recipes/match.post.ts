import { findMatchingRecipes } from '~~/server/services/recipeService'

const ALLOWED_CATEGORIES = ['healthy', 'normal', 'high protein', 'vegan']
const ALLOWED_METHODS = ['fry', 'stir-fry', 'boil', 'bake', 'steam']

// TODO: ต่อ Roboflow/YOLO ตรงนี้ รับ Buffer ของรูป คืน string[] ชื่อวัตถุดิบ
async function detectIngredients(_image: Buffer): Promise<string[]> {
  throw createError({ statusCode: 501, message: 'ยังไม่ได้ต่อ object detection' })
}

export default defineEventHandler(async (event) => {
  const contentType = getHeader(event, 'content-type') || ''
  let category = ''
  let method = ''
  let ingredients: string[] = []

  if (contentType.includes('multipart/form-data')) {
    // ----- โหมดจริง: รูป -> YOLO -----
    const parts = (await readMultipartFormData(event)) || []
    const field = (name: string) =>
      parts.find(p => p.name === name && !p.filename)?.data.toString('utf-8') || ''

    category = field('category')
    method = field('method')

    const image = parts.find(p => p.name === 'image')
    if (!image) {
      throw createError({ statusCode: 400, message: 'ไม่พบไฟล์รูปภาพ' })
    }
    ingredients = await detectIngredients(image.data)
  } else {
    // ----- โหมด mock: รับ ingredients จาก client ตรงๆ (เปิดเฉพาะตอน dev) -----
    // if (!import.meta.dev) {
    //   throw createError({ statusCode: 403, message: 'ต้องส่งรูปภาพ' })
    // }
    const body = (await readBody(event)) || {}
    category = body.category || ''
    method = body.method || ''
    ingredients = Array.isArray(body.ingredients) ? body.ingredients : []
  }

  if (category && !ALLOWED_CATEGORIES.includes(category)) {
    throw createError({ statusCode: 400, message: 'category ไม่ถูกต้อง' })
  }
  if (method && !ALLOWED_METHODS.includes(method)) {
    throw createError({ statusCode: 400, message: 'method ไม่ถูกต้อง' })
  }

  const data = await findMatchingRecipes(ingredients, category || undefined, method || undefined)
  return { success: true, data }
})