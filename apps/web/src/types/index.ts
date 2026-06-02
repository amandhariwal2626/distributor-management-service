export type PermissionId = string;

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

export interface ReportingManagerRef {
  id: string;
  email: string;
  profile: { fullName: string };
}

export interface User {
  id: string;
  email: string;
  username?: string;
  profile: UserProfile;
  status: UserStatus;
  lastLoginAt?: string;
  reportingManager?: ReportingManagerRef | null;
  subordinates?: ReportingManagerRef[];
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
  reportingManager?: ReportingManagerRef | null;
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

export type UpdateUserPayload = Partial<CreateUserPayload>;

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

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  roleId?: string;
}

export interface ListAuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  actorId?: string;
  entityType?: string;
  entityId?: string;
  from?: string;
  to?: string;
}
