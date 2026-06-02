#!/bin/bash
set -e

# Build database package to ensure dist/ is present for workspace symlink
npm run build -w @dms/database

echo "Running database migrations..."
npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma

echo "Starting API server..."
exec node apps/api/dist/main
