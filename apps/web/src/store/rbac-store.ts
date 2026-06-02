import { create } from "zustand";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type {
  AuditLog,
  AuditLogsResponse,
  CreateOptionsResponse,
  CreateUserPayload,
  ListAuditLogsParams,
  ListUsersParams,
  Role,
  TreeNode,
  UpdateUserPayload,
  User,
  UsersResponse,
} from "@/types";

export interface RbacState {
  users: User[];
  totalUsers: number;
  usersPage: number;
  usersLimit: number;
  usersPages: number;

  roles: Role[];

  auditLogs: AuditLog[];
  totalAuditLogs: number;
  auditPage: number;
  auditLimit: number;
  auditPages: number;

  loading: boolean;
  error: string | null;

  loadUsers: (params?: ListUsersParams) => Promise<void>;
  loadRoles: () => Promise<void>;
  loadAuditLogs: (params?: ListAuditLogsParams) => Promise<void>;

  getUser: (id: string) => Promise<User>;
  createUser: (payload: CreateUserPayload) => Promise<User>;
  updateUser: (id: string, payload: UpdateUserPayload) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;

  deactivateUser: (id: string) => Promise<void>;
  reactivateUser: (id: string) => Promise<void>;
  lockUser: (id: string) => Promise<void>;
  unlockUser: (id: string) => Promise<void>;
  suspendUser: (id: string) => Promise<void>;
  resetPassword: (id: string, password: string) => Promise<void>;

  getHierarchyTree: () => Promise<TreeNode[]>;
  getCreateOptions: () => Promise<CreateOptionsResponse>;
}

export const useRbacStore = create<RbacState>((set, get) => ({
  users: [],
  totalUsers: 0,
  usersPage: 1,
  usersLimit: 20,
  usersPages: 0,

  roles: [],

  auditLogs: [],
  totalAuditLogs: 0,
  auditPage: 1,
  auditLimit: 20,
  auditPages: 0,

  loading: false,
  error: null,

  async loadUsers(params) {
    set({ loading: true, error: null });
    try {
      const res = await apiGet<UsersResponse>("/users", params as Record<string, unknown>);
      set({
        users: res.items,
        totalUsers: res.total,
        usersPage: res.page,
        usersLimit: res.limit,
        usersPages: res.pages,
        loading: false,
      });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  async loadRoles() {
    set({ loading: true, error: null });
    try {
      interface RawRole {
        id: string;
        name: string;
        description: string;
        level: number;
        permissions: { permission: { code: string; id: string } }[];
        isSystem: boolean;
        userCount: number;
        createdAt: string;
        updatedAt: string;
      }
      const raw = await apiGet<RawRole[]>("/roles");
      const roles: Role[] = raw.map((r) => ({
        ...r,
        permissions: (r.permissions || []).map((rp) => rp.permission?.code || rp.permission?.id),
      }));
      set({ roles, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  async loadAuditLogs(params) {
    set({ loading: true, error: null });
    try {
      const res = await apiGet<AuditLogsResponse>(
        "/audit-logs",
        params as Record<string, unknown>,
      );
      set({
        auditLogs: res.items,
        totalAuditLogs: res.total,
        auditPage: res.page,
        auditLimit: res.limit,
        auditPages: res.pages,
        loading: false,
      });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
      throw e;
    }
  },

  getUser(id) {
    return apiGet<User>(`/api/users/${id}`);
  },

  async createUser(payload) {
    const user = await apiPost<User>("/users", payload);
    return user;
  },

  async updateUser(id, payload) {
    const user = await apiPatch<User>(`/api/users/${id}`, payload);
    // Patch local list
    set({
      users: get().users.map((u) => (u.id === id ? { ...u, ...user } : u)),
    });
    return user;
  },

  async deleteUser(id) {
    await apiDelete(`/api/users/${id}`);
    set({ users: get().users.filter((u) => u.id !== id) });
  },

  async deactivateUser(id) {
    const user = await apiPatch<User>(`/api/users/${id}/deactivate`);
    set({ users: get().users.map((u) => (u.id === id ? { ...u, ...user } : u)) });
  },
  async reactivateUser(id) {
    const user = await apiPatch<User>(`/api/users/${id}/reactivate`);
    set({ users: get().users.map((u) => (u.id === id ? { ...u, ...user } : u)) });
  },
  async lockUser(id) {
    const user = await apiPatch<User>(`/api/users/${id}/lock`);
    set({ users: get().users.map((u) => (u.id === id ? { ...u, ...user } : u)) });
  },
  async unlockUser(id) {
    const user = await apiPatch<User>(`/api/users/${id}/unlock`);
    set({ users: get().users.map((u) => (u.id === id ? { ...u, ...user } : u)) });
  },
  async suspendUser(id) {
    const user = await apiPatch<User>(`/api/users/${id}/suspend`);
    set({ users: get().users.map((u) => (u.id === id ? { ...u, ...user } : u)) });
  },

  async resetPassword(id, password) {
    await apiPost(`/api/users/${id}/reset-password`, { password });
  },

  getHierarchyTree() {
    return apiGet<TreeNode[]>("/users/hierarchy/tree");
  },

  getCreateOptions() {
    return apiGet<CreateOptionsResponse>("/users/create-options");
  },
}));
