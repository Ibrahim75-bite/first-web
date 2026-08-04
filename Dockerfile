# =============================================================================
# Multi-Stage Security-Hardened Dockerfile for Decorella Backend
# =============================================================================

# --- Stage 1: Build Dependencies ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# --- Stage 2: Production Runtime ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install curl for healthcheck probe
RUN apk add --no-cache curl

# Create non-root user for Zero-Trust runtime isolation
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create persistent storage directories with appropriate permissions
RUN mkdir -p uploads/images uploads/thumbnails logs && \
    chown -R appuser:appgroup /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup src ./src

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health/live || exit 1

CMD ["node", "src/server.js"]
