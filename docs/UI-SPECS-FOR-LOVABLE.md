# FMCG DMS — Frontend Specification

Generate a full Next.js frontend application for a FMCG Distributor Management System. The backend API is already built and deployed (NestJS, PostgreSQL). The frontend should be a fresh new build covering user management, hierarchy, roles, and audit logs.

---

## Tech Stack & Conventions

- **Framework**: Next.js (App Router), TypeScript
- **Styling**: Tailwind CSS v4 (configure in `src/app/globals.css` with `@theme` blocks — no `tailwind.config.js`)
- **UI Library**: shadcn/ui components
- **State**: Zustand stores
- **API Client**: axios-based, auto-injects `x-organization-id` header and JWT token

### Folder Structure to Create
```
src/
├── app/
│   ├── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              ← sidebar + header layout
│   │   ├── page.tsx                ← dashboard home
│   │   ├── users/
│   │   │   ├── page.tsx            ← user list
│   │   │   ├── new/page.tsx        ← create user
│   │   │   └── [id]/
│   │   │       ├── page.tsx        ← user detail
│   │   │       └── edit/page.tsx   ← edit user
│   │   ├── roles/
│   │   │   └── page.tsx            ← role management
│   │   ├── hierarchy/
│   │   │   └── page.tsx            ← hierarchy tree
│   │   └── audit-logs/
│   │       └── page.tsx            ← audit log list
│   └── globals.css
├── components/
│   ├── ui/                         ← shadcn/ui base components
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   ├── users/
│   │   ├── users-table.tsx
│   │   ├── user-form.tsx
│   │   ├── user-detail.tsx
│   │   └── user-status-badge.tsx
│   ├── hierarchy/
│   │   ├── hierarchy-tree.tsx
│   │   └── tree-node.tsx
│   ├── audit/
│   │   └── audit-table.tsx
│   └── shared/
│       ├── status-badge.tsx
│       ├── role-badge.tsx
│       ├── user-avatar.tsx
│       └── confirm-dialog.tsx
├── lib/
│   ├── api.ts                     ← axios instance with interceptors
│   └── utils.ts                   ← cn(), formatters
├── store/
│   ├── auth-store.ts              ← auth state (login, logout, user)
│   └── rbac-store.ts              ← users, roles, audit state
├── types/
│   └── index.ts                   ← all TypeScript interfaces
└── configs/
    └── sidebar.ts                 ← navigation items
```

---

## 1. Core Types (`src/types/index.ts`)

```typescript
export interface RoleInfo {
  id: string;
  name: string;
  level: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED" | "SUSPENDED";

export interface UserProfile {
  userCode?: string;
  employeeCode?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName?: string;
  fullName: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dob?: string;
  mobile?: string;
  alternateMobile?: string;
  emergencyContact?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  profile: UserProfile;
  status: UserStatus;
  lastLoginAt?: string;
  reportingManager?: { id: string; email: string; profile: { fullName: string } } | null;
  zone?: string;
  region?: string;
  area?: string;
  territory?: string;
  distributorId?: string;
  forcePasswordChange?: boolean;
  passwordExpiryDays?: number;
  twoFactorAuth?: boolean;
  failedLoginAttempts?: number;
  roles: { role: RoleInfo }[];
  createdAt: string;
  updatedAt: string;
}

export interface UserListItem {
  id: string;
  email: string;
  profile: UserProfile;
  status: UserStatus;
  lastLoginAt?: string;
  roles: { role: RoleInfo }[];
  reportingManager?: { id: string; email: string; profile: { fullName: string } } | null;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  organizationId: string;
  status: UserStatus;
  roles: string[];
  permissions: string[];
}

export interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: { id: string; email: string; profile: { fullName: string } } | null;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface AuditLogsResponse {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TreeNode {
  id: string;
  email: string;
  profile: { fullName: string };
  status: UserStatus;
  roles: { role: { name: string; level: number } }[];
  children: TreeNode[];
}

export interface CreateUserPayload {
  userCode?: string;
  employeeCode?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName?: string;
  email: string;
  username?: string;
  password?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dob?: string;
  mobile?: string;
  alternateMobile?: string;
  emergencyContact?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  roleIds: string[];
  reportingManagerId?: string;
  zone?: string;
  region?: string;
  area?: string;
  territory?: string;
  distributorId?: string;
  forcePasswordChange?: boolean;
  passwordExpiryDays?: number;
  twoFactorAuth?: boolean;
}

export interface LoginPayload {
  organizationCode: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  user: AuthUser;
}

export interface CreateOptionsResponse {
  roles: RoleInfo[];
  managers: { id: string; email: string; profile: { fullName: string } }[];
}
```

---

## 2. API Client (`src/lib/api.ts`)

Create an axios instance that:
- Base URL: reads from `NEXT_PUBLIC_API_URL` env var (default `http://localhost:3001`)
- Request interceptor: adds `Authorization: Bearer <token>` and `x-organization-id` header from auth store
- Response interceptor: unwraps `{ data, success, message }` envelope, handles 401 → redirect to login
- All requests go to `/api/...` (backend has global `/api` prefix)

---

## 3. Auth Store (`src/store/auth-store.ts`)

Zustand store with:
- `user: AuthUser | null`
- `accessToken: string | null`
- `organizationId: string | null`
- `isAuthenticated: boolean` (derived)
- `login(input: LoginPayload): Promise<void>` — calls `POST /api/auth/login`, stores tokens + user
- `logout(): void` — clears state, calls `POST /api/auth/logout`
- `loadSession(): void` — rehydrates from localStorage on app mount

---

## 4. RBAC Store (`src/store/rbac-store.ts`)

Zustand store with:
- `users: User[]`, `totalUsers: number`, `usersPage: number`
- `roles: Role[]`
- `auditLogs: AuditLog[]`, `totalAuditLogs: number`
- `loading: boolean`
- `loadUsers(params?)`: calls `GET /api/users` with query params
- `loadRoles()`: calls `GET /api/roles`
- `loadAuditLogs(params?)`: calls `GET /api/audit-logs` with query params
- `createUser(payload)`: calls `POST /api/users`
- `updateUser(id, payload)`: calls `PATCH /api/users/:id`
- `deleteUser(id)`: calls `DELETE /api/users/:id`
- `deactivateUser(id)`: calls `PATCH /api/users/:id/deactivate`
- `reactivateUser(id)`: calls `PATCH /api/users/:id/reactivate`
- `lockUser(id)`: calls `PATCH /api/users/:id/lock`
- `unlockUser(id)`: calls `PATCH /api/users/:id/unlock`
- `suspendUser(id)`: calls `PATCH /api/users/:id/suspend`
- `resetPassword(id, password)`: calls `POST /api/users/:id/reset-password`
- `getHierarchyTree()`: calls `GET /api/users/hierarchy/tree`
- `getCreateOptions()`: calls `GET /api/users/create-options`

---

## 5. Pages & Components

### 5a. Login Page (`/login`)

**Form fields**: Organization Code, Email, Password, Submit button.

Call `auth-store.login()`. On success, redirect to `/`. On error, show toast with error message. If account is locked, show lock message with retry time.

### 5b. Dashboard Layout (`/(dashboard)/layout.tsx`)

Sidebar (left, collapsible) + top header bar + main content area. Sidebar items gated by permissions (see section 7). Active item highlighted. User dropdown in header with logout.

### 5c. User List Page (`/users`)

**Components**: `UsersTable`, `StatusBadge`, `RoleBadge`, pagination controls.

**Table columns**: profile.fullName, profile.userCode, profile.mobile, email, roles (badges), reportingManager (profile.fullName), status (colored badge), lastLoginAt (relative), createdAt. Access PII fields via `user.profile.*`.

**Actions dropdown per row**: View, Edit, Reset Password, Lock/Unlock, Deactivate/Reactivate, Delete. Each action calls the corresponding store method.

**Filters above table**: Search input, Role dropdown, Status dropdown. Filters trigger API call with query params.

**"Add User" button** (top right) → navigates to `/users/new`. Visible only for users with `users.create` permission.

**Pagination**: Server-side, show page controls + "Showing X-Y of Z".

### 5d. Create User Page (`/users/new`)

**Components**: `UserForm` (reusable for create + edit)

On mount, fetch `GET /api/users/create-options` to populate:
- Role multi-select (filtered per role-based rules)
- Reporting Manager select (users with higher-level roles)

**Form sections**: Basic Information, Contact, Address, Organization, Login Settings (create only).

**On submit**: `POST /api/users` → redirect to `/users/:id`.

**Role-based restrictions for the form itself**:
- If logged-in user has "Distributor" role: only allow selecting Salesman/Accountant/Warehouse User/Delivery Boy roles; show distributor mapping field pre-filled with self
- If "Admin": show all options
- NSH/ZSM/RSM/ASM/TSO: this page should not be accessible (redirect or hide button)

### 5e. Edit User Page (`/users/:id/edit`)

Same `UserForm` component, pre-filled with `GET /api/users/:id` data. Map API fields: PII fields come from `user.profile.*` (e.g. `profile.firstName`, `profile.lastName`, `profile.mobile`). The submit payload should still send them flat (not nested under `profile`). Login Settings section hidden (except forcePasswordChange, twoFactorAuth). On submit: `PATCH /api/users/:id`.

### 5f. User Detail Page (`/users/:id`)

**Sections**:
1. Header card: Avatar (initials), `profile.fullName`, email, role badges, status badge
2. Basic Info grid (2-column read-only): read from `profile.firstName`, `profile.middleName`, `profile.lastName`, `profile.gender`, `profile.dob`, `profile.userCode`, `profile.employeeCode`
3. Contact Info grid: read from `profile.mobile`, `profile.alternateMobile`, `profile.email`, `profile.emergencyContact`
4. Address grid: read from `profile.addressLine1-3`, `profile.country`, `profile.state`, `profile.district`, `profile.city`, `profile.pincode`
5. Organization: role, reporting manager (`reportingManager.profile.fullName` — clickable link), zone/region/area/territory, distributor
6. Subordinates list (from `user.subordinates` on the response)
7. Recent Activity: last 20 audit logs for this user

### 5g. Hierarchy Tree Page (`/hierarchy`)

**Component**: `HierarchyTree` — recursive tree component

Fetch `GET /api/users/hierarchy/tree`. Display as collapsible tree:
- Each node: avatar initial + `profile.fullName` + role badge
- Expand/collapse chevron
- Search input: filter visible nodes by name (show path to match)

### 5h. Audit Log Page (`/audit-logs`)

**Components**: `AuditTable` with filters

**Table columns**: DateTime, Actor (`actor.profile.fullName` + email), Action (colored badge), Target type/ID, Changes (expandable JSON diff), IP Address.

**Filters**: Action dropdown, Actor search, Date range (from/to).

**Pagination**: Server-side.

**Action label mapping**:
| API Value | Display Label | Color |
|-----------|--------------|-------|
| USER_CREATED | User Created | green |
| USER_UPDATED | User Updated | blue |
| USER_DELETED | User Deleted | red |
| PASSWORD_RESET | Password Reset | yellow |
| ROLE_CHANGED | Role Changed | purple |
| STATUS_CHANGED | Status Changed | orange |
| REPORTING_MANAGER_CHANGED | Manager Changed | cyan |
| LOGIN_FAILED | Login Failed | red |
| ACCOUNT_LOCKED | Account Locked | orange |
| ACCOUNT_UNLOCKED | Account Unlocked | green |

### 5i. Roles Page (`/roles`)

Read-only role list for now (role management is not in current scope).

---

## 6. Status & Color Guide

| Status | Tailwind Classes | Meaning |
|--------|-----------------|---------|
| ACTIVE | `bg-green-100 text-green-800` | User is active and can log in |
| INACTIVE | `bg-gray-100 text-gray-800` | User was deactivated |
| LOCKED | `bg-orange-100 text-orange-800` | Auto-locked after 5 failed login attempts |
| SUSPENDED | `bg-red-100 text-red-800` | Manually suspended by admin |

---

## 7. Navigation & Permissions

Sidebar items (show/hide based on user permissions, which come from `auth-store.user.permissions`):

| Item | Route | Required Permission |
|------|-------|-------------------|
| Dashboard | `/` | (always visible) |
| Users | `/users` | `users.read` |
| Roles | `/roles` | `roles.read` |
| Hierarchy | `/hierarchy` | `hierarchy.view` |
| Audit Logs | `/audit-logs` | `audit.read` |

---

## 8. Validation Reference (for Create/Edit forms)

| Field | Rules |
|-------|-------|
| email | Valid email format, unique per organization |
| userCode | Alphanumeric, unique per organization |
| username | Alphanumeric + underscores only, unique per organization |
| mobile | 10-digit format |
| password | Min 8 characters |
| pincode | 6 digits |
| reportingManagerId | Must be a user with a higher hierarchy level |
| distributorId | Must be a user with Distributor role |

---

## 9. User Hierarchy Reference

The system has these role levels (1 = highest):

```
Admin (1)
└── National Sales Head (2)
    └── Zonal Sales Manager (3)
        └── Regional Sales Manager (4)
            └── Area Sales Manager (5)
                └── Territory Sales Officer (6)
                    └── Distributor (7)
                        ├── Salesman (8)
                        ├── Accountant (9)
                        ├── Warehouse User (10)
                        └── Delivery Boy (11)
```

---

## 10. Complete API Endpoint Reference

All endpoints require `x-organization-id` header. Auth endpoints are public.

### Auth
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/auth/login` | Public | Login with org code + email + password |
| POST | `/api/auth/signup` | Public | Self-registration |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Auth | Revoke session |
| GET | `/api/auth/me` | Auth | Get current user profile + permissions |
| POST | `/api/auth/forgot-password` | Public | Send reset token |
| POST | `/api/auth/reset-password` | Public | Reset password with token |

### Users
| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/users` | `users.read` | List users (paginated, filterable) |
| GET | `/api/users/create-options` | `users.read` | Get roles + managers for form dropdowns |
| GET | `/api/users/hierarchy/tree` | `hierarchy.view` | Get full org tree |
| GET | `/api/users/:id` | `users.read` | Get user detail |
| POST | `/api/users` | `users.create` | Create user |
| PATCH | `/api/users/:id` | `users.update` | Update user |
| DELETE | `/api/users/:id` | `users.delete` | Soft-delete user |
| PATCH | `/api/users/:id/deactivate` | `users.update` | Deactivate user |
| PATCH | `/api/users/:id/reactivate` | `users.update` | Reactivate user |
| PATCH | `/api/users/:id/lock` | `users.lock` | Lock user |
| PATCH | `/api/users/:id/unlock` | `users.unlock` | Unlock user |
| PATCH | `/api/users/:id/suspend` | `users.update` | Suspend user |
| POST | `/api/users/:id/reset-password` | `users.reset_password` | Admin-initiated password reset |

### Roles
| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/roles` | `roles.read` | List roles with permissions |
| POST | `/api/roles` | `roles.create` | Create role |
| PATCH | `/api/roles/:id` | `roles.update` | Update role |
| DELETE | `/api/roles/:id` | `roles.delete` | Soft-delete role |

### Permissions
| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/permissions` | `roles.read` | List all permissions |

### Audit Logs
| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/audit-logs` | `audit.read` | List audit logs (filterable) |

### Invites
| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| POST | `/api/invites` | `users.create` | Create/resent invite token |
| POST | `/api/invites/accept` | Public | Accept invite with token + password |
