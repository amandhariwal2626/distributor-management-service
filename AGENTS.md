# Agent System Instructions & Project Context

This file provides system context, architecture boundaries, conventions, and instructions for any AI agents or tools working on this codebase. Follow these rules strictly to ensure code consistency and stack integrity.

---

## 1. Stack Architecture & Folder Structure

We use a Monorepo managed by **Turborepo** with **npm workspaces**.
- **Frontend (`apps/web`)**: Next.js (App Router, Tailwind CSS, TypeScript, shadcn/ui).
- **Backend (`apps/api`)**: NestJS (TypeScript, Prisma ORM, PostgreSQL).
- **Shared Packages (`packages/*`)**: Shared TypeScript configs, ESLint configurations, and potentially shared validation schemas or types.

### Folder Responsibilities:
- `apps/web/src/app`: Page layouts and server/client pages (Next.js App Router).
- `apps/web/src/components`: UI components. Place reusable shadcn-like components under `components/ui`.
- `apps/web/src/lib`: Frontend utilities, types, and API client wrappers (`api.ts`).
- `apps/api/src`: NestJS source directory. Structured around domain modules (e.g. `users/`).
- `apps/api/prisma`: Schema file (`schema.prisma`) and migrations.
- `packages/typescript-config`: Shared compiler options.

---

## 2. Coding Standards & Conventions

### General Rules:
- **TypeScript**: Enable strict mode (`strict: true`) everywhere. Avoid using `any`; define explicit interfaces and types.
- **Import Statements**: Use path aliases (`@/*` pointing to `src/*`) in both frontend and backend configurations instead of relative paths (e.g., `../../components`).

### Backend (NestJS):
- **Architecture**: Follow NestJS module structure (Module -> Controller -> Service).
- **Dependency Injection**: Always inject dependencies in class constructors (`constructor(private service: Service) {}`).
- **Global Prefix**: The API uses the global prefix `/api`. All controllers automatically inherit this.
- **Errors**: Throw appropriate built-in NestJS exceptions (e.g. `NotFoundException`, `ConflictException`, `BadRequestException`) instead of generic errors.

### Frontend (Next.js):
- **Client/Server Components**: Use `"use client"` *only* when utilizing state (`useState`, `useEffect`), client handlers, or UI library hooks. Otherwise, default to Server Components for performance.
- **Tailwind CSS v4**: Tailwind CSS v4 is used. Styles are configured directly in `src/app/globals.css` with `@theme` blocks. Do not look for a `tailwind.config.js`.

---

## 3. Database Rules (Prisma ORM)

- **Schema Source of Truth**: `apps/api/prisma/schema.prisma` is the source of truth for the database layout.
- **Target OS Compilations**: Always specify `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` in `schema.prisma` generator client. This ensures compilation compatibility between Windows development machines and Alpine Linux containers.
- **Migrations**:
  - Locally: `npm run db:migrate` or `npx prisma migrate dev`
  - Container/Production: Applied automatically via the `docker-entrypoint.sh` using `npx prisma migrate deploy`.

---

## 4. Git Workflow

- **Never commit or push directly to `main`**, even if asked. If asked to commit/push while on `main`, first create a new feature branch for the change, then commit and push to that branch.

## 5. Docker & Deployment Workflow

- **Containerization**: Both apps use multi-stage Dockerfiles (`apps/web/Dockerfile`, `apps/api/Dockerfile`).
- **Docker Compose**: The entire stack is orchestrated by the root `docker-compose.yml`.
- **Hot Reloading**: Hot reloading is enabled in development through bind mounting host directories to container directories:
  - Docker Compose mounts the root and overrides package folders with **anonymous volumes** (e.g. `/app/node_modules`, `/app/apps/web/node_modules`) to prevent local host binaries from clashing with container binaries.
  - Next.js development container uses `WATCHPACK_POLLING=true` to detect host filesystem updates in container environments.
  - Use `docker compose up -d -V --build` to force rebuilds when dependencies inside `package.json` are modified, which updates the anonymous volumes.
