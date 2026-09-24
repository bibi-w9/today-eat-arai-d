import { Schema, model } from 'mongoose'

const UserPantrySchema = new Schema({
  userId: { type: String, required: true },
  ingredients: [String],
  detectedFromImage: String
}, { timestamps: true })

export const UserPantry = model('UserPantry', UserPantrySchema)