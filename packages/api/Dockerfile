FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/api/package.json packages/api/

# Install all workspace deps
RUN npm ci --workspace=packages/shared --workspace=packages/api

# Copy source
COPY packages/shared/ packages/shared/
COPY packages/api/ packages/api/

# Build shared first, then API
RUN npm run build --workspace=packages/shared
RUN npx prisma generate --schema=packages/api/prisma/schema.prisma
RUN npm run build --workspace=packages/api

# ─── Production stage ─────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/api/package.json packages/api/

RUN npm ci --workspace=packages/shared --workspace=packages/api --omit=dev

# Copy built artifacts
COPY --from=builder /app/packages/shared/dist/ packages/shared/dist/
COPY --from=builder /app/packages/api/dist/ packages/api/dist/
COPY --from=builder /app/packages/api/prisma/ packages/api/prisma/
COPY --from=builder /app/node_modules/.prisma/ node_modules/.prisma/

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "packages/api/dist/index.js"]
