import { Schema, model } from 'mongoose'

const IngredientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  synonyms: [String],
  caloriesPer100g: Number,
  protein: Number,
  fat: Number,
  carbs: Number
})

export const Ingredient = model('Ingredient', IngredientSchema)