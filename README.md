# DMS Full-Stack Monorepo

A production-ready full-stack monorepo managed with **Turborepo** and **npm workspaces**.

## Stack Overview
- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS v4, shadcn/ui.
- **Backend**: NestJS 11+, TypeScript, CORS configured.
- **Database**: PostgreSQL with Prisma ORM.
- **Environment**: Dockerized (multi-stage builds, hot-reloads, postgres container).

---

## Workspace Structure
```
dms/ (root)
├── apps/
│   ├── web/                    # Next.js App Router (Frontend)
│   └── api/                    # NestJS Backend API (Backend)
├── packages/                   # Shared workspace configuration
│   ├── typescript-config/      # Shared TS configurations
│   └── eslint-config/          # Shared ESLint configurations
├── docker-compose.yml          # Orchestrates local stack
├── turbo.json                  # Turborepo build pipeline
└── package.json                # Workspaces and root commands
```

---

## Getting Started (Quick Start with Docker)

The easiest way to run the entire stack (Next.js, NestJS, and Postgres) with hot-reloading active is using Docker Compose:

### 1. Prerequisites
Ensure you have the following installed:
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)
- [Node.js v20+](https://nodejs.org/) (for local commands)

### 2. Configure Environment Variables
Copy the template configuration to generate a local `.env` file:
```bash
cp .env.example .env
```

### 3. Spin up the containers
Launch the Docker stack:
```bash
docker compose up --build
```
This command:
1. Starts the `postgres` container.
2. Waits until PostgreSQL is healthy.
3. Automatically runs Prisma migrations (`prisma migrate deploy`) on the backend.
4. Generates the Prisma Client.
5. Boots up **NestJS** (`http://localhost:3001`) and **Next.js** (`http://localhost:3000`) with active file watchers for hot reloading.

---

## Local Development (No Docker)

If you prefer to run services natively on your local machine:

### 1. Start PostgreSQL
Run a local PostgreSQL database or run *only* the database in Docker:
```bash
docker compose up -d postgres
```

### 2. Install dependencies
Run at the root of the project to install all workspace dependencies:
```bash
npm install
```

### 3. Setup Database (Migrations & Client Generation)
Generate the Prisma client and apply database migrations locally:
```bash
# Generate Prisma Client
npm run db:generate

# Run DB Migrations
npm run db:migrate
```

### 4. Start Development Servers
Run the dev servers for both applications simultaneously:
```bash
npm run dev
```

---

## Database (Prisma) Workflows

Prisma commands can be run directly from the root using npm workspace filters:

- **Run migrations**: `npm run db:migrate` (runs `prisma migrate dev` inside `apps/api`)
- **Generate client**: `npm run db:generate` (runs `prisma generate` inside `apps/api`)
- **Open Prisma Studio**: `npm run db:studio` (launches Prisma Studio DB viewer at `http://localhost:5555`)

---

## Common Scripts Reference

| Script Name | Command | Description |
|:---|:---|:---|
| `npm run dev` | `turbo run dev` | Starts Next.js and NestJS in development mode. |
| `npm run build` | `turbo run build` | Compiles applications for production. |
| `npm run lint` | `turbo run lint` | Runs linter across all workspaces. |
| `npm run format` | `prettier --write ...` | Formats all files using Prettier. |
| `npm run db:migrate` | Runs Prisma migrate dev | Generates and runs schema migrations. |
| `npm run db:generate`| Runs Prisma generate | Re-generates Prisma client. |
| `npm run db:studio` | Runs Prisma studio | Opens web interface to inspect database. |

---

## Troubleshooting

### Docker Volumes Cache conflict
If you install new node modules or change `package.json` configurations, you must clear and recreate the anonymous Docker volumes. Run:
```bash
docker compose up -d -V --build
```
The `-V` (or `--renew-anon-volumes`) tells Docker Compose to drop existing anonymous volumes and reinstall fresh Node modules inside the container.

### Next.js Hot Reloading does not pick up changes
If you are running on Windows, file system notification propagation to Linux Docker containers can fail. We have pre-configured `WATCHPACK_POLLING: "true"` inside `docker-compose.yml` to solve this, ensuring changes save and reload immediately.

### CORS Errors
Ensure `CORS_ORIGIN` inside `.env` matches the URL of your Next.js frontend (default `http://localhost:3000`). The NestJS backend is configured to read this variable and dynamically whitelist the frontend.
