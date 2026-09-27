import { detectIngredients } from '~~/server/services/ingredientDetectionService'

export default defineEventHandler(async (event) => {
  const parts = (await readMultipartFormData(event)) || []
  const image = parts.find(part => part.name === 'image' && part.filename)
  if (!image) throw createError({ statusCode: 400, message: 'กรุณาเลือกรูปภาพก่อนตรวจจับ' })

  const detections = await detectIngredients(image.data)
  return { success: true, detections }
})
