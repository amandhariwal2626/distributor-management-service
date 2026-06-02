import type { PermissionGroup } from "../types";

export const PERMISSION_CATALOG: PermissionGroup[] = [
  {
    key: "users",
    label: "Users",
    description: "Manage users and their access.",
    permissions: [
      { id: "users.read",   resource: "users", action: "read",   label: "View users" },
      { id: "users.create", resource: "users", action: "create", label: "Invite users", dependsOn: ["users.read"] },
      { id: "users.update", resource: "users", action: "update", label: "Edit users",   dependsOn: ["users.read"] },
      { id: "users.delete", resource: "users", action: "delete", label: "Delete users", dependsOn: ["users.read"] },
      { id: "users.reset_password", resource: "users", action: "reset_password", label: "Reset user passwords", dependsOn: ["users.read"] },
      { id: "users.lock", resource: "users", action: "lock", label: "Lock users", dependsOn: ["users.read"] },
      { id: "users.unlock", resource: "users", action: "unlock", label: "Unlock users", dependsOn: ["users.read"] },
    ],
  },
  {
    key: "hierarchy",
    label: "Hierarchy",
    description: "View and manage the organizational hierarchy.",
    permissions: [
      { id: "hierarchy.view",   resource: "hierarchy", action: "view",   label: "View hierarchy tree" },
      { id: "hierarchy.export", resource: "hierarchy", action: "export", label: "Export hierarchy", dependsOn: ["hierarchy.view"] },
    ],
  },
  {
    key: "roles",
    label: "Roles",
    description: "Manage roles and permission assignments.",
    permissions: [
      { id: "roles.read",   resource: "roles", action: "read",   label: "View roles" },
      { id: "roles.create", resource: "roles", action: "create", label: "Create roles", dependsOn: ["roles.read"] },
      { id: "roles.update", resource: "roles", action: "update", label: "Edit roles",   dependsOn: ["roles.read"] },
      { id: "roles.delete", resource: "roles", action: "delete", label: "Delete roles", dependsOn: ["roles.read"] },
      { id: "roles.assign", resource: "roles", action: "assign", label: "Assign roles to users", dependsOn: ["roles.read", "users.read"] },
    ],
  },
  {
    key: "documents",
    label: "Documents",
    permissions: [
      { id: "documents.read",   resource: "documents", action: "read",   label: "View documents" },
      { id: "documents.create", resource: "documents", action: "create", label: "Upload documents", dependsOn: ["documents.read"] },
      { id: "documents.update", resource: "documents", action: "update", label: "Edit documents",   dependsOn: ["documents.read"] },
      { id: "documents.delete", resource: "documents", action: "delete", label: "Delete documents", dependsOn: ["documents.read"] },
      { id: "documents.share",  resource: "documents", action: "share",  label: "Share documents",  dependsOn: ["documents.read"] },
    ],
  },
  {
    key: "folders",
    label: "Folders",
    permissions: [
      { id: "folders.read",   resource: "folders", action: "read",   label: "View folders" },
      { id: "folders.create", resource: "folders", action: "create", label: "Create folders", dependsOn: ["folders.read"] },
      { id: "folders.update", resource: "folders", action: "update", label: "Rename / move folders", dependsOn: ["folders.read"] },
      { id: "folders.delete", resource: "folders", action: "delete", label: "Delete folders", dependsOn: ["folders.read"] },
    ],
  },
  {
    key: "approvals",
    label: "Approvals",
    permissions: [
      { id: "approvals.read",    resource: "approvals", action: "read",    label: "View approvals" },
      { id: "approvals.approve", resource: "approvals", action: "approve", label: "Approve documents", dependsOn: ["approvals.read"] },
      { id: "approvals.reject",  resource: "approvals", action: "reject",  label: "Reject documents",  dependsOn: ["approvals.read"] },
    ],
  },
  {
    key: "audit",
    label: "Audit Logs",
    permissions: [
      { id: "audit.read", resource: "audit", action: "read", label: "View audit logs" },
      { id: "audit.export", resource: "audit", action: "export", label: "Export audit logs", dependsOn: ["audit.read"] },
    ],
  },
  {
    key: "orders",
    label: "Orders",
    permissions: [
      { id: "orders.read", resource: "orders", action: "read", label: "View orders" },
      { id: "orders.create", resource: "orders", action: "create", label: "Create orders", dependsOn: ["orders.read"] },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    permissions: [
      { id: "inventory.read",   resource: "inventory", action: "read",   label: "View inventory" },
      { id: "inventory.manage", resource: "inventory", action: "manage", label: "Manage inventory", dependsOn: ["inventory.read"] },
    ],
  },
  {
    key: "payments",
    label: "Payments",
    permissions: [
      { id: "payments.read",   resource: "payments", action: "read",   label: "View payments" },
      { id: "payments.manage", resource: "payments", action: "manage", label: "Manage payments", dependsOn: ["payments.read"] },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    permissions: [
      { id: "reports.read",   resource: "reports", action: "read",   label: "View reports" },
      { id: "reports.export", resource: "reports", action: "export", label: "Export reports", dependsOn: ["reports.read"] },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    permissions: [
      { id: "settings.read",   resource: "settings", action: "read",   label: "View settings" },
      { id: "settings.manage", resource: "settings", action: "manage", label: "Manage organization settings", dependsOn: ["settings.read"] },
    ],
  },
  {
    key: "owner",
    label: "Owner Access",
    description: "Bypasses all permission checks. Grants unrestricted access to every part of the system.",
    permissions: [
      { id: "settings.owner", resource: "owner", action: "*", label: "Owner access", description: "Grants unrestricted system-wide access. This is the highest permission level." },
    ],
  },
];

export const OWNER_PERMISSION = "settings.owner";

export const ALL_PERMISSIONS = PERMISSION_CATALOG.flatMap((g) => g.permissions);
export const ALL_PERMISSION_IDS = ALL_PERMISSIONS.map((p) => p.id);
export const PERMISSION_MAP = new Map(ALL_PERMISSIONS.map((p) => [p.id, p]));
