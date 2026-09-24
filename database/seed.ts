import mongoose from 'mongoose'
import { Recipe } from '../server/models/Recipe'
import recipesData from './seed-data/recipes.json'
import 'dotenv/config'

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not found in .env')

  await mongoose.connect(uri)
  console.log('Connected for seeding...')

  await Recipe.deleteMany({})
  await Recipe.insertMany(recipesData)

  console.log(`✅ Seeded ${recipesData.length} recipes`)
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})