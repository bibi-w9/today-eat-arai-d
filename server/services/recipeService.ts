import { Recipe } from '../models/Recipe' 

export async function findMatchingRecipes(
  userIngredients: string[] = [],
  category?: string,
  method?: string
) {
  await connectDB()

  const query: any = {}
  if (category) {
    query.categories = category
  }
  if (method) {
    query.cookingMethod = method
  }

  const recipes = await Recipe.find(query).lean()

  console.log('Query Object:', query)
  console.log('Recipes Found in DB:', recipes.length)

  // 2. ป้องกันกรณี userIngredients ส่งมาไม่ใช่ Array
  const safeUserIngredients = Array.isArray(userIngredients) ? userIngredients : []

  const results = recipes.map((recipe: any) => {
    // 3. ป้องกันกรณีเมนูใน DB ไม่มี ingredients หรือเป็น null
    const ingredientsList = Array.isArray(recipe.ingredients) ? recipe.ingredients : []

    const requiredNames = ingredientsList
      .filter((i: any) => i && i.required && i.name)
      .map((i: any) => i.name)

    const matched = requiredNames.filter((name: string) => safeUserIngredients.includes(name))
    const missing = requiredNames.filter((name: string) => !safeUserIngredients.includes(name))

    const matchPercent = requiredNames.length > 0 
      ? Math.round((matched.length / requiredNames.length) * 100) 
      : 0

    return {
      _id: recipe._id,
      name: recipe.name,
      cookingMethod: recipe.cookingMethod,
      categories: recipe.categories,
      steps: recipe.steps,
      caloriesTotal: recipe.caloriesTotal,
      matchPercent,
      matched,
      missing
    }
  })

  return results
    .filter((recipe: any) => recipe.matchPercent >= 30)
    .sort((a: any, b: any) => b.matchPercent - a.matchPercent)
}