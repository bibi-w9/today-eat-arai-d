import { findMatchingRecipes } from '~~/server/services/recipeService'

const ALLOWED_CATEGORIES = ['healthy', 'normal', 'high protein', 'vegan']
const ALLOWED_METHODS = ['fry', 'stir_fry', 'boil', 'bake', 'steam']

export default defineEventHandler(async (event) => {
  const contentType = getHeader(event, 'content-type') || ''
  let category = ''
  let method = ''
  let ingredients: string[] = []

  const body = (await readBody(event)) || {}
  category = body.category || ''
  method = body.method || ''
  ingredients = Array.isArray(body.ingredients) ? body.ingredients : []

  if (category && !ALLOWED_CATEGORIES.includes(category)) {
    throw createError({ statusCode: 400, message: 'category ไม่ถูกต้อง' })
  }
  if (method && !ALLOWED_METHODS.includes(method)) {
    throw createError({ statusCode: 400, message: 'method ไม่ถูกต้อง' })
  }

  const data = await findMatchingRecipes(ingredients, category || undefined, method || undefined)
  return { success: true, data }
})
