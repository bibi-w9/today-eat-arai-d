# ---- Base ----
FROM node:22-alpine AS base
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

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]