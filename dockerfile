# ---- Base ----
# onnxruntime-node มี native binary สำหรับ glibc จึงใช้ Debian slim แทน Alpine
FROM node:22-bookworm-slim AS base
WORKDIR /app
# ปิด telemetry ของ nuxt ตอน build
ENV NUXT_TELEMETRY_DISABLED=1

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production
# Nuxt build output แบบ standalone อยู่ที่ .output
COPY --from=build /app/.output ./.output
# โมเดลต้องอยู่ข้างไฟล์เซิร์ฟเวอร์ใน runtime เพื่อให้ endpoint /api/detect ใช้งานได้
COPY --from=build /app/server/models/assets/ingredient-detector.onnx ./server/models/assets/ingredient-detector.onnx

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]
