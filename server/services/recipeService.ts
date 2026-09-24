import { Recipe } from '../models/Recipe'

export async function findMatchingRecipes(userIngredients: string[], category?: string) {
  await connectDB()

  const query: any = {}
  if (category) query.categories = category

  const recipes = await Recipe.find(query)

  return recipes.map(recipe => {
    const requiredNames = recipe.ingredients
      .filter(i => i.required)
      .map(i => i.name)

    const matched = requiredNames.filter(name => userIngredients.includes(name))
    const missing = requiredNames.filter(name => !userIngredients.includes(name))

    return {
      _id: recipe._id,
      name: recipe.name,
      cookingMethod: recipe.cookingMethod,
      categories: recipe.categories,
      steps: recipe.steps,
      caloriesTotal: recipe.caloriesTotal,
      matchPercent: Math.round((matched.length / requiredNames.length) * 100),
      matched,
      missing
    }
  }).sort((a, b) => b.matchPercent - a.matchPercent)
}