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

export interface RoleInfo {
  id: string;
  name: string;
  level: number;
}

export interface Role extends RoleInfo {
  description: string;
  permissions: PermissionId[];
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
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
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

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  organizationId: string;
  status: UserStatus;
  roles: string[];
  permissions: PermissionId[];
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

export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DELETED"
  | "PASSWORD_RESET"
  | "ROLE_CHANGED"
  | "STATUS_CHANGED"
  | "REPORTING_MANAGER_CHANGED"
  | "LOGIN_FAILED"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_UNLOCKED"
  | "role.created"
  | "role.updated"
  | "role.deleted"
  | "role.cloned"
  | "role.permissions_changed"
  | "user.invited"
  | "user.role_assigned"
  | "user.role_removed";

export interface AuditLog {
  id: string;
  action: AuditAction;
  actor: { id: string; email: string; profile: { fullName: string } } | null;
  entityType: string;
  entityId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}
