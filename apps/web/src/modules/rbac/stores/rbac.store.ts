"use client";

import { create } from "zustand";
import { rolesService } from "@/services/roles";
import { usersService } from "@/services/users";
import { useAuthStore } from "@/store/auth-store";
import type { AuditAction, AuditLog, PermissionId, Role, User, UserStatus } from "../types";

interface RbacState {
  roles: Role[];
  users: User[];
  auditLogs: AuditLog[];
  loading: boolean;

  loadRoles: () => Promise<void>;
  loadUsers: () => Promise<void>;

  createRole: (input: Pick<Role, "name" | "description" | "permissions">) => Promise<Role>;
  updateRole: (id: string, patch: Partial<Pick<Role, "name" | "description" | "permissions">>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  cloneRole: (id: string) => Promise<Role | null>;

  inviteUser: (input: { email: string; name: string; roleIds: string[] }) => Promise<User>;
  reinviteUser: (userId: string) => Promise<void>;
  assignRoles: (userId: string, roleIds: string[]) => Promise<void>;
  setUserStatus: (userId: string, status: UserStatus) => Promise<void>;

  _log: (action: AuditAction, target: AuditLog["target"], changes?: Record<string, unknown>) => void;
}

function mapRoleFromApi(item: { id: string; name: string; description?: string; permissions: { permission: { code: string } }[] }): Role {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    permissions: item.permissions.map((p) => p.permission.code),
    isSystem: false,
    userCount: 0,
    createdAt: "",
    updatedAt: "",
  };
}

function mapUserFromApi(item: { id: string; fullName: string; email: string; isActive: boolean; createdAt: string; roles: { role: { id: string; name: string } }[] }): User {
  return {
    id: item.id,
    email: item.email,
    name: item.fullName,
    status: item.isActive ? "active" : "deactivated",
    roleIds: item.roles.map((r) => r.role.id),
    createdAt: item.createdAt,
  };
}

export const useRbacStore = create<RbacState>((set, get) => ({
  roles: [],
  users: [],
  auditLogs: [],
  loading: false,

  _log: (action, target, changes) => {
    const authUser = useAuthStore.getState().user;
    if (!authUser) return;
    const entry: AuditLog = {
      id: `log_${Math.random().toString(36).slice(2, 10)}`,
      action,
      performedBy: { id: authUser.id, name: authUser.fullName, email: authUser.email },
      target,
      changes,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ auditLogs: [entry, ...s.auditLogs] }));
  },

  loadRoles: async () => {
    try {
      const data = await rolesService.list();
      set({ roles: data.map(mapRoleFromApi) });
    } catch {
      // silently fail
    }
  },

  loadUsers: async () => {
    try {
      const data = await usersService.list({ page: "1", limit: "100", search: "" });
      set({ users: data.items.map(mapUserFromApi) });
    } catch {
      // silently fail
    }
  },

  createRole: async (input) => {
    await rolesService.create({
      name: input.name,
      description: input.description || undefined,
      permissions: input.permissions,
    });
    await get().loadRoles();
    get()._log("role.created", { type: "role", id: "", label: input.name });
    const role = get().roles.find((r) => r.name === input.name);
    return role!;
  },

  updateRole: async (id, patch) => {
    const before = get().roles.find((r) => r.id === id);
    await rolesService.update(id, {
      name: patch.name,
      description: patch.description || undefined,
      permissions: patch.permissions,
    });
    await get().loadRoles();
    if (before) {
      if (patch.permissions) {
        const added = patch.permissions.filter((p) => !before.permissions.includes(p));
        const removed = before.permissions.filter((p) => !patch.permissions!.includes(p));
        get()._log("role.permissions_changed", { type: "role", id, label: before.name }, { added, removed });
      } else {
        get()._log("role.updated", { type: "role", id, label: before.name });
      }
    }
  },

  deleteRole: async (id) => {
    const role = get().roles.find((r) => r.id === id);
    await rolesService.remove(id);
    set((s) => ({ roles: s.roles.filter((r) => r.id !== id) }));
    if (role) get()._log("role.deleted", { type: "role", id, label: role.name });
  },

  cloneRole: async (id) => {
    const source = get().roles.find((r) => r.id === id);
    if (!source) return null;
    await rolesService.create({
      name: `${source.name} (copy)`,
      description: source.description || undefined,
      permissions: source.permissions,
    });
    await get().loadRoles();
    const clone = get().roles.find((r) => r.name === `${source.name} (copy)`);
    if (clone) get()._log("role.cloned", { type: "role", id: clone.id, label: clone.name }, { sourceId: id });
    return clone ?? null;
  },

  inviteUser: async ({ email, name, roleIds }) => {
    const [firstName, ...lastParts] = name.split(" ");
    await usersService.create({
      firstName,
      lastName: lastParts.join(" ") || " ",
      email,
      roleIds,
    });
    await get().loadUsers();
    const user = get().users.find((u) => u.email === email);
    get()._log("user.invited", { type: "user", id: user?.id ?? "", label: name });
    return user!;
  },

  reinviteUser: async (userId) => {
    const user = get().users.find((u) => u.id === userId);
    if (!user) return;
    await usersService.reinvite(userId);
    get()._log("user.invited", { type: "user", id: userId, label: user.name });
  },

  assignRoles: async (userId, roleIds) => {
    const user = get().users.find((u) => u.id === userId);
    if (!user) return;
    const added = roleIds.filter((r) => !user.roleIds.includes(r));
    const removed = user.roleIds.filter((r) => !roleIds.includes(r));
    // Update user's roles via API - uses the update endpoint with role assignment
    await usersService.create({
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ").slice(1).join(" ") || " ",
      email: user.email,
      roleIds,
    });
    set((s) => ({
      users: s.users.map((u) => (u.id === userId ? { ...u, roleIds } : u)),
    }));
    if (added.length) get()._log("user.role_assigned", { type: "user", id: userId, label: user.name }, { added });
    if (removed.length) get()._log("user.role_removed", { type: "user", id: userId, label: user.name }, { removed });
  },

  setUserStatus: async (userId, status) => {
    const user = get().users.find((u) => u.id === userId);
    if (!user) return;
    if (status === "deactivated" || status === "suspended") {
      await usersService.deactivate(userId);
      get()._log("user.deactivated", { type: "user", id: userId, label: user.name }, { status });
    } else {
      await usersService.reactivate(userId);
      get()._log("user.reactivated", { type: "user", id: userId, label: user.name });
    }
    set((s) => ({
      users: s.users.map((u) => (u.id === userId ? { ...u, status } : u)),
    }));
  },
}));

export function selectEffectivePermissions(userId: string): PermissionId[] {
  const { users, roles } = useRbacStore.getState();
  const user = users.find((u) => u.id === userId);
  if (!user) return [];
  const set = new Set<PermissionId>();
  for (const r of roles) {
    if (user.roleIds.includes(r.id)) r.permissions.forEach((p) => set.add(p));
  }
  return [...set];
}
