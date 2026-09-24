import { findMatchingRecipes } from '~~/server/services/recipeService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ingredients, category } = body

  if (!ingredients || !Array.isArray(ingredients)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ต้องส่ง ingredients เป็น array'
    })
  }

  const recipes = await findMatchingRecipes(ingredients, category)
  return recipes
})