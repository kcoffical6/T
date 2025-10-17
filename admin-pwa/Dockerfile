# Use Node.js 18 LTS
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# git is required if any dependencies use git URLs; ca-certificates for HTTPS
RUN apk add --no-cache libc6-compat git ca-certificates
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

    # Production image, copy all the files and run admin-pwa
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 admin-pwa

COPY --from=builder --chown=admin-pwa:nodejs /app/dist ./dist
COPY --from=builder --chown=admin-pwa:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=admin-pwa:nodejs /app/package.json ./package.json

USER admin-pwa
EXPOSE 3001
# Use vite preview to serve the built app in production
ENV HOST=0.0.0.0
CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port 3001"]
