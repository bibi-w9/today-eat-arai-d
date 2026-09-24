import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const IngredientSchema = new Schema({
  name: { type: String, required: true, unique: true },
  synonyms: [String],
  caloriesPer100g: Number,
  protein: Number,
  fat: Number,
  carbs: Number
})

export const Ingredient = models.Ingredient || model('Ingredient', IngredientSchema)