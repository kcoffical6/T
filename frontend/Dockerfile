# Use Node.js 18 LTS
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
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

# Production image, copy all the files and run Astro
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 astro

# Copy necessary build output with proper ownership
COPY --from=builder --chown=astro:nodejs /app/public ./public
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json
COPY --from=builder --chown=astro:nodejs /app/astro.config.mjs ./astro.config.mjs

# Grant permissions
RUN chmod -R 755 /app

# Switch to non-root user
USER astro

# Expose Astro’s production port
EXPOSE 4321

# ✅ Run in production mode (not dev)
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
