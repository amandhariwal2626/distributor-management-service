#!/bin/bash
set -e

export PATH="node_modules/.bin:$PATH"

# Build database package
npm run build -w @dms/database

# Replace npm workspace symlink with actual built package
# to avoid symlink resolution issues on Render
rm -rf node_modules/@dms/database
mkdir -p node_modules/@dms/database/dist
cp -r packages/database/dist/* node_modules/@dms/database/dist/
cp packages/database/package.json node_modules/@dms/database/package.json

echo "Running database migrations..."
prisma migrate deploy --schema=packages/database/prisma/schema.prisma

echo "Starting API server..."
exec node apps/api/dist/main
