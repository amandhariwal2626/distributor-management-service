FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl sed
WORKDIR /app

# Development stage
FROM base AS dev
COPY package.json package-lock.json* .npmrc ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/database/prisma ./packages/database/prisma
RUN npm ci
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma
COPY . .
RUN chmod +x ./apps/api/docker-entrypoint.sh
EXPOSE 3001
ENTRYPOINT ["sh", "./apps/api/docker-entrypoint.sh"]

# Dependencies installer for production builder
FROM base AS deps
COPY package.json package-lock.json* .npmrc ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/database/prisma ./packages/database/prisma
RUN npm ci
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Production builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w @dms/database
RUN npm run build -w @dms/api

# Production runner stage
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/dist ./packages/database/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/docker-entrypoint.sh ./apps/api/docker-entrypoint.sh

RUN chmod +x ./apps/api/docker-entrypoint.sh

USER nestjs
EXPOSE 3001
ENV PORT=3001

ENTRYPOINT ["sh", "./apps/api/docker-entrypoint.sh"]
