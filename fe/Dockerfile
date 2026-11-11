# syntax=docker/dockerfile:1
#
# Simple CRM — Next.js 15 frontend (server-rendered).
# `output: 'standalone'` in next.config.mjs produces a self-contained Node
# server in .next/standalone, which we run here.  This is the reliable path
# on Render; the Netlify serverless path (netlify.toml) is the fallback.

# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Deps first for layer caching.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build (standalone output).
COPY . .
# Build-time env so NEXT_PUBLIC_* gets inlined; runtime URL is read server-side
# from the same variable at request time (see lib/api.js), so either works.
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
RUN npm run build

# ---- Run stage ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Bring in the standalone server + its minimal node_modules.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
# (No /public dir in this project — all assets are CSS.)

# Render injects the assigned port here; default 3000.
ENV PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000

USER node
ENTRYPOINT ["node", "server.js"]
