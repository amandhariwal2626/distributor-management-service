#!/bin/bash
set -Eeuo pipefail

trap 'echo "[FATAL] Line $LINENO exited with code $?" >&2' ERR

export PATH="node_modules/.bin:$PATH"
ROOT="$(pwd)"

echo "[1/4] Generating Prisma client..."
prisma generate --schema=packages/database/prisma/schema.prisma 2>&1

echo "[2/4] Running database migrations..."
prisma migrate deploy --schema=packages/database/prisma/schema.prisma 2>&1

echo "[3/4] Verifying API build output..."
if [ ! -f "apps/api/dist/main.js" ]; then
  echo "[FATAL] apps/api/dist/main.js does not exist" >&2
  ls -la apps/api/dist/ >&2
  exit 1
fi

echo "[4/4] Starting API server..."
echo "  node version: $(node --version)"
echo "  cwd: $ROOT"
exec node apps/api/dist/main
