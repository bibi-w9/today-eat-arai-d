import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const UserPantrySchema = new Schema({
  userId: { type: String, required: true }, 
  ingredients: [String], 
  detectedFromImage: String 
}, { timestamps: true }) 

export const UserPantry = models.UserPantry || model('UserPantry', UserPantrySchema)