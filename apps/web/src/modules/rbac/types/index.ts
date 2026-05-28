export type PermissionId = string;

export interface Permission {
  id: PermissionId;
  resource: string;
  action: string;
  label: string;
  description?: string;
  dependsOn?: PermissionId[];
}

export interface PermissionGroup {
  key: string;
  label: string;
  description?: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: PermissionId[];
  isSystem: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = "active" | "invited" | "suspended" | "deactivated";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  status: UserStatus;
  roleIds: string[];
  lastActiveAt?: string;
  createdAt: string;
}

export interface AuthUser extends User {
  permissions: PermissionId[];
}

export type AuditAction =
  | "role.created"
  | "role.updated"
  | "role.deleted"
  | "role.cloned"
  | "role.permissions_changed"
  | "user.invited"
  | "user.role_assigned"
  | "user.role_removed"
  | "user.deactivated"
  | "user.reactivated";

export interface AuditLog {
  id: string;
  action: AuditAction;
  performedBy: { id: string; name: string; email: string };
  target: { type: "user" | "role"; id: string; label: string };
  changes?: Record<string, unknown>;
  timestamp: string;
}
