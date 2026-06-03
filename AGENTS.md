# Agent System Instructions & Project Context

This file provides system context, architecture boundaries, conventions, and instructions for any AI agents or tools working on this codebase. Follow these rules strictly to ensure code consistency and stack integrity.

---

## 0. Critical Rules

- **Never modify `.env` files without asking the user first.** Env files contain credentials and configuration that must not be changed without explicit approval.
- **Every API endpoint must return specific, descriptive error messages.** Never use generic messages like `'Invalid credentials'`, `'Forbidden'`, `'Not found'`, or `'Bad request'` without describing what specifically went wrong. Include contextual details (e.g., which field conflicts, how many attempts remain, why access was denied) so the frontend can display a meaningful message to the user. For security-sensitive endpoints (e.g., forgot-password), return the same generic response for both found and not-found cases to prevent enumeration.

## 1. Stack Architecture & Folder Structure

We use a Monorepo managed by **Turborepo** with **npm workspaces**.
- **Frontend (`apps/web`)**: Next.js (App Router, Tailwind CSS, TypeScript, shadcn/ui). UI generated via **Lovable** — see `docs/UI-SPECS-FOR-LOVABLE.md` for detailed specs.
- **Backend (`apps/api`)**: NestJS (TypeScript, Prisma ORM, PostgreSQL).
- **Shared Packages (`packages/*`)**: Shared TypeScript configs, ESLint configurations, and shared database schema/prisma.

### Folder Responsibilities:
- `apps/web/src/app`: Page layouts and server/client pages (Next.js App Router).
- `apps/web/src/components`: UI components. Place reusable shadcn-like components under `components/ui`.
- `apps/web/src/lib`: Frontend utilities, types, and API client wrappers (`api.ts`).
- `apps/api/src`: NestJS source directory. Structured around domain modules (e.g. `users/`, `auth/`, `roles/`, `audit-logs/`).
- `apps/api/prisma`: Schema file (`schema.prisma`) and migrations. (Legacy — current schema lives in `packages/database/prisma/schema.prisma`)
- `packages/database`: Database package containing Prisma schema, migrations, and seed.
- `packages/database/prisma`: Schema (`schema.prisma`), migrations, seed file (`seed.ts`).
- `packages/typescript-config`: Shared compiler options.

---

## 2. Domain Overview — FMCG DMS User Management

This is a **FMCG Distributor Management System** with a hierarchical user structure:

### User Hierarchy (by role level)
```
Admin (level 1)
└─ National Sales Head / NSH (level 2)
   └─ Zonal Sales Manager / ZSM (level 3)
      └─ Regional Sales Manager / RSM (level 4)
         └─ Area Sales Manager / ASM (level 5)
            └─ Territory Sales Officer / TSO (level 6)
               └─ Distributor (level 7)
                  ├─ Salesman (level 8)
                  ├─ Accountant (level 9)
                  ├─ Warehouse User (level 10)
                  └─ Delivery Boy (level 11)
```

### User Creation Rules
- **Admin** can create all company users AND distributors
- **Distributor** can create its own team (Salesman, Accountant, Warehouse User, Delivery Boy)
- **NSH, ZSM, RSM, ASM, TSO** cannot create users
- Every user must belong to a reporting hierarchy

### User Statuses
`ACTIVE` | `INACTIVE` | `LOCKED` | `SUSPENDED`
- Locked: automatic after N failed login attempts
- Suspended: manual admin action

### Full User Fields
Basic: userCode, employeeCode, firstName, middleName, lastName, displayName, gender, dob
Contact: mobile, alternateMobile, email, emergencyContact
Address: addressLine1-3, country, state, district, city, pincode
Org: role (via UserRole), reportingManagerId, zone, region, area, territory, distributorId
Login: username, passwordHash, forcePasswordChange, passwordExpiryDays, twoFactorAuth, failedLoginAttempts

---

## 3. Coding Standards & Conventions

### General Rules:
- **TypeScript**: Enable strict mode (`strict: true`) everywhere. Avoid using `any`; define explicit interfaces and types.
- **Every component and every function must have proper TypeScript types** — no implicit `any`, no missing return types on functions, and no untyped component props. For React components, always define a `Props` interface and use it as `React.FC<Props>` or explicit `{ prop1, prop2 }: Props`. For API/functions, always specify parameter and return types.
- **Import Statements**: Use path aliases (`@/*` pointing to `src/*`) in both frontend and backend configurations instead of relative paths (e.g., `../../components`).

### Backend (NestJS):
- **Architecture**: Follow NestJS module structure (Module -> Controller -> Service).
- **Dependency Injection**: Always inject dependencies in class constructors (`constructor(private service: Service) {}`).
- **Global Prefix**: The API uses the global prefix `/api`. All controllers automatically inherit this.
- **Errors**: Throw appropriate built-in NestJS exceptions (e.g. `NotFoundException`, `ConflictException`, `BadRequestException`, `ForbiddenException`) instead of generic errors.
- **Audit Logging**: All user-modifying actions must write to `UserAuditLog` via `AuditLogService`.

### Frontend (Next.js):
- **Client/Server Components**: Use `"use client"` *only* when utilizing state (`useState`, `useEffect`), client handlers, or UI library hooks. Otherwise, default to Server Components for performance.
- **Tailwind CSS v4**: Tailwind CSS v4 is used. Styles are configured directly in `src/app/globals.css` with `@theme` blocks. Do not look for a `tailwind.config.js`.
- **UI Generation**: Frontend components are generated via **Lovable**. Refer to `docs/UI-SPECS-FOR-LOVABLE.md` for detailed specs on each page/component.
- **shadcn/ui Components**: Always install new shadcn UI components using the CLI from `apps/web/`. Run `npx shadcn@latest add <component-name>` to add the component and its dependencies (e.g., `npx shadcn@latest add calendar`). Do not manually create or copy shadcn component files.
- **Component Lookup Order**: Before creating any new component, look in `apps/web/src/components` first, then in `apps/web/src/components/ui`. Only create a new component if it does not exist in either location.
- **File Length**: FE files should not exceed 200 lines of code. Exceptions can be made when necessary (e.g., complex forms or page layouts with many fields).
- **One Component Per File**: Each file should contain exactly one component. Do not define multiple components in a single file.
- **Strict Types**: Always define proper TypeScript interfaces and types. Never use `any`.
- **File Organization**: Keep types in `types/<feature>` if feature-specific or in `types/` if shared across features. Keep utility functions in `utils/<feature>` if feature-specific or in `utils/` if shared. Apply the same convention for configs (`config/<feature>` or `config/`).

---

## 4. Database Rules (Prisma ORM)

- **Schema Source of Truth**: `packages/database/prisma/schema.prisma`
- **Target OS Compilations**: Always specify `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` in `schema.prisma` generator client. This ensures compilation compatibility between Windows development machines and Alpine Linux containers.
- **Migrations**:
  - Run from `packages/database/`: `npx prisma migrate dev --name <name>`
  - Container/Production: Applied automatically via `npx prisma migrate deploy`.
- **Seed**: `packages/database/prisma/seed.ts` — run via `npm run db:seed` in `packages/database` (uses `ts-node` directly, not `prisma db seed` CLI).

### Key Models
| Model | Description |
|-------|-------------|
| `Organization` | Tenant/company — each org has its own isolated data (users, roles, etc.) |
| `User` | Extended with all PRD fields, reportingManagerId, distributorId, status enum |
| `Role` | Has `level` field for hierarchy ordering |
| `UserAuditLog` | Server-side audit trail |
| `Permission` | Granular action-based permissions |
| `UserRole` | Many-to-many user-role assignment |
| `RolePermission` | Many-to-many role-permission assignment |

> **Header**: All API requests require `x-organization-id` header for multi-org isolation.

---

## 5. API Endpoints (Key)

### Auth
| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| POST | `/api/auth/login` | Public | Login with tenant code + email + password |
| POST | `/api/auth/signup` | Public | Self-signup |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Authenticated | Revoke session |
| GET | `/api/auth/me` | Authenticated | Current user profile + roles + permissions |
| POST | `/api/auth/forgot-password` | Public | Send reset token |
| POST | `/api/auth/reset-password` | Public | Reset password with token |

### Users
| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/api/users` | `users.read` | List users (paginated, filterable) |
| GET | `/api/users/:id` | `users.read` | Get user by ID |
| POST | `/api/users` | `users.create` | Create user |
| PATCH | `/api/users/:id` | `users.update` | Update user |
| DELETE | `/api/users/:id` | `users.delete` | Soft-delete user |
| PATCH | `/api/users/:id/deactivate` | `users.update` | Deactivate user |
| PATCH | `/api/users/:id/reactivate` | `users.update` | Reactivate user |
| PATCH | `/api/users/:id/lock` | `users.update` | Lock user |
| PATCH | `/api/users/:id/unlock` | `users.update` | Unlock user |
| POST | `/api/users/:id/reset-password` | `users.update` | Admin-initiated password reset |
| GET | `/api/users/hierarchy/tree` | `hierarchy.view` | Full hierarchy tree |

### Audit Logs
| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `/api/audit-logs` | `audit.read` | List audit logs (filterable) |

---

## 6. Permission Codes

Existing permissions extended for FMCG DMS:

| Code | Description |
|------|-------------|
| `users.read` | View users |
| `users.create` | Create users |
| `users.update` | Edit users |
| `users.delete` | Delete users |
| `users.reset_password` | Admin password reset |
| `users.lock` | Lock users |
| `users.unlock` | Unlock users |
| `hierarchy.view` | View hierarchy tree |
| `hierarchy.export` | Export hierarchy |
| `roles.read` | View roles |
| `roles.create` | Create roles |
| `roles.update` | Edit roles |
| `roles.delete` | Delete roles |
| `roles.assign` | Assign roles to users |
| `roles.manage` | Manage role permissions |
| `audit.read` | View audit logs |
| `audit.export` | Export audit logs |
| ... (documents, folders, approvals, orders, inventory, payments, reports, settings) |

---

## 7. Seed Data & Roles

All 11 roles are seeded with their hierarchy levels and appropriate permission profiles:
- **Admin** (level 1, isSystem): all permissions
- **NSH** (level 2): users.read, hierarchy.*, reports.*
- **ZSM** (level 3): users.read, hierarchy.*, reports.*
- **RSM** (level 4): users.read, hierarchy.*, reports.*
- **ASM** (level 5): users.read, hierarchy.*, reports.*
- **TSO** (level 6): users.read, hierarchy.*
- **Distributor** (level 7): users.create (limited to own team), users.update (own team), users.reset_password (own team), hierarchy.view (own)
- **Salesman** (level 8): orders.*, inventory.read
- **Accountant** (level 9): payments.*, reports.*
- **Warehouse User** (level 10): inventory.*, orders.read
- **Delivery Boy** (level 11): orders.read, orders.update (status)

---

## 8. Git Workflow

- **Never commit or push directly to `main`**, even if asked. If asked to commit/push while on `main`, first create a new feature branch for the change, then commit and push to that branch.

## 9. Docker & Deployment Workflow

- **Containerization**: Both apps use multi-stage Dockerfiles (`apps/web/Dockerfile`, `apps/api/Dockerfile`).
- **Docker Compose**: The entire stack is orchestrated by the root `docker-compose.yml`.
- **Hot Reloading**: Hot reloading is enabled in development through bind mounting host directories to container directories:
  - Docker Compose mounts the root and overrides package folders with **anonymous volumes** (e.g. `/app/node_modules`, `/app/apps/web/node_modules`) to prevent local host binaries from clashing with container binaries.
  - Next.js development container uses `WATCHPACK_POLLING=true` to detect host filesystem updates in container environments.
  - Use `docker compose up -d -V --build` to force rebuilds when dependencies inside `package.json` are modified, which updates the anonymous volumes.

## 10. External Services

- **UI Generation**: Lovable (lovable.dev) — feed `docs/UI-SPECS-FOR-LOVABLE.md` specs for new UI components
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: Neon (PostgreSQL)
