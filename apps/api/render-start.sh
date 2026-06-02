#!/bin/bash
set -Eeuo pipefail

trap 'echo "[FATAL] Line $LINENO exited with code $?" >&2' ERR

export PATH="node_modules/.bin:$PATH"
ROOT="$(pwd)"
echo "[1/5] Building database package..."
npm run build -w @dms/database 2>&1

echo "[2/5] Verifying database dist output..."
if [ ! -d "packages/database/dist" ]; then
  echo "[FATAL] packages/database/dist does not exist after build" >&2
  ls -la packages/database/ >&2
  exit 1
fi
echo "  packages/database/dist contents:"
ls packages/database/dist/

echo "[3/5] Replacing workspace symlink with built package..."
rm -rf node_modules/@dms/database
mkdir -p node_modules/@dms/database/dist
cp -r packages/database/dist/* node_modules/@dms/database/dist/
cp packages/database/package.json node_modules/@dms/database/package.json
echo "  node_modules/@dms/database contents:"
ls -la node_modules/@dms/database/

echo "[4/5] Running database migrations..."
prisma migrate deploy --schema=packages/database/prisma/schema.prisma 2>&1

echo "[5/5] Starting API server..."
echo "  node version: $(node --version)"
echo "  cwd: $ROOT"
echo "  dist/main exists: $(test -f apps/api/dist/main && echo yes || echo no)"
exec node apps/api/dist/main
