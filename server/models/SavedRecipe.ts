import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const SavedRecipeSchema = new Schema({
  userId: { type: String, required: true, index: true },
  userEmail: { type: String, required: true },
  recipeKey: { type: String, required: true },
  recipe: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true })

SavedRecipeSchema.index({ userId: 1, recipeKey: 1 }, { unique: true })

export const SavedRecipe = models.SavedRecipe || model('SavedRecipe', SavedRecipeSchema)
