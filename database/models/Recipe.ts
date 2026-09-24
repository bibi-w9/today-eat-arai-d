import { Schema, model } from 'mongoose'

const RecipeSchema = new Schema({
  name: { type: String, required: true },
  cookingMethod: [String],
  categories: [String],
  ingredients: [{
    name: String,
    amount: Number,
    unit: String,
    required: { type: Boolean, default: true }
  }],
  steps: [String],
  caloriesTotal: Number
}, { timestamps: true })

export const Recipe = model('Recipe', RecipeSchema)