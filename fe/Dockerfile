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
# NOTE: lib/api.js reads API_BASE_URL at RUNTIME (see the run stage ENV).
# NEXT_PUBLIC_* values are inlined at build time, so we no longer use one here.
RUN npm run build

# ---- Run stage ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# API base URL, read at RUNTIME by lib/api.js (process.env.API_BASE_URL).
# Baked in as the default so the service works even before/without a Render
# env var. A Render env var of the same name still overrides this.
ENV API_BASE_URL=https://simple-crm-api-tquo.onrender.com

# Bring in the standalone server + its minimal node_modules.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
# (No /public dir in this project — all assets are CSS.)

# Render injects the assigned port here; default 3000.
ENV PORT=3000 HOSTNAME=0.0.0.0
EXPOSE 3000

USER node
ENTRYPOINT ["node", "server.js"]
