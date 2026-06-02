#!/bin/bash
set -Eeuo pipefail

trap 'echo "[FATAL] Line $LINENO exited with code $?" >&2' ERR

export PATH="node_modules/.bin:$PATH"
ROOT="$(pwd)"

echo "[1/3] Running database migrations..."
prisma migrate deploy --schema=packages/database/prisma/schema.prisma 2>&1

echo "[2/3] Verifying API build output..."
if [ ! -f "apps/api/dist/main.js" ]; then
  echo "[FATAL] apps/api/dist/main.js does not exist" >&2
  ls -la apps/api/dist/ >&2
  exit 1
fi

echo "[3/3] Starting API server..."
echo "  node version: $(node --version)"
echo "  cwd: $ROOT"
exec node apps/api/dist/main
