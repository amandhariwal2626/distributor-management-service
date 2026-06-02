# Architecture Overview

## Stack
- **Frontend**: Next.js (App Router, Tailwind CSS v4, TypeScript, shadcn/ui)
- **Backend**: NestJS (TypeScript, Prisma ORM, PostgreSQL)
- **Monorepo**: Turborepo + npm workspaces

## Database
- **ORM**: Prisma
- **Schema**: `packages/database/prisma/schema.prisma`
- **Migrations**: `npx prisma migrate dev` (local), auto-deployed via `npx prisma migrate deploy` (prod)
- **Seed**: `packages/database/prisma/seed.ts` — run via `npm run db:seed` in `packages/database`

## API Structure (NestJS)
All controllers are under `apps/api/src/` with global prefix `/api`.

### Modules
| Module | Path | Description |
|--------|------|-------------|
| Auth | `apps/api/src/auth/` | Login, signup, JWT refresh, password reset, logout |
| Users | `apps/api/src/users/` | User CRUD, lock/unlock, delete, reset-password, hierarchy |
| Roles | `apps/api/src/roles/` | Role CRUD, assign permissions, clone |
| Permissions | `apps/api/src/permissions/` | Permission listing, user permission overrides |
| Sessions | `apps/api/src/sessions/` | Session management |
| Invites | `apps/api/src/invites/` | User invitation flow |
| Prisma | `apps/api/src/prisma/` | Prisma service module |

### Database Models
- **Organization** — each org (company/distributor) is isolated via `organizationId` on every model
- **User** — full PRD fields, self-referential hierarchy via `reportingManagerId`
- **Role** — hierarchy level (`level` int), system roles protected by `isSystem`
- **UserAuditLog** — server-side audit trail

### Auth Flow
- JWT access tokens (15m) + refresh tokens (configurable, default 7d)
- Session-based refresh token rotation
- Organization isolation via `x-organization-id` header
- Role-based permissions via `@Permissions()` decorator + `PermissionsGuard`

## Frontend Structure (Next.js)
- Pages: `apps/web/src/app/`
- Components: `apps/web/src/components/`
- API client: `apps/web/src/lib/api.ts`
- State: Zustand stores
- RBAC module: `apps/web/src/modules/rbac/`

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon (PostgreSQL)
- Containerization: Docker Compose for local dev
