#!/bin/sh
set -e

# Change to the API workspace directory for Prisma to find schema
cd /app/apps/api

if [ -n "$DATABASE_URL" ]; then
  DB_HOST=$(echo "$DATABASE_URL" | sed -e 's|.*@||' -e 's|/.*||' -e 's|:.*||')
  DB_PORT=$(echo "$DATABASE_URL" | sed -e 's|.*@||' -e 's|/.*||' -e 's|.*:||')

  if [ -z "$DB_PORT" ] || [ "$DB_PORT" = "$DB_HOST" ]; then
    DB_PORT=5432
  fi

  echo "Waiting for postgres at $DB_HOST:$DB_PORT..."
  until nc -z -w 1 "$DB_HOST" "$DB_PORT"; do
    echo "Postgres is unavailable - sleeping"
    sleep 1
  done
  echo "Postgres is up!"
fi

echo "Running database migrations..."
npx prisma migrate deploy

# Return to app root
cd /app

if [ "$NODE_ENV" = "production" ]; then
  echo "Starting NestJS in production..."
  exec node apps/api/dist/main
else
  echo "Starting NestJS in development..."
  exec npm run dev -w @dms/api
fi
