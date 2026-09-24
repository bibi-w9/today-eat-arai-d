import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const RecipeSchema = new Schema({
  name: { type: String, required: true }, 
  image: [String],
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

export const Recipe = models.Recipe || model('Recipe', RecipeSchema)