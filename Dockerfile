# -------------------
# Stage 1: Dependencies + Build
# -------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for some packages (optional but common)
RUN apk add --no-cache libc6-compat

# Copy package files first → better layer caching
COPY package.json package-lock.json* ./

# Install ALL deps (dev + prod) for build
RUN npm ci

# Copy source code
COPY . .

# Build the app (creates .next + standalone folder)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# -------------------
# Stage 2: Minimal runtime image
# -------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user (security best practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only what's needed from builder
# Standalone mode bundles minimal node_modules + server.js
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the server (standalone creates server.js)
CMD ["node", "server.js"]