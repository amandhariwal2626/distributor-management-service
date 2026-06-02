import { apiClient, ApiEnvelope } from "@/lib/api";

export interface RoleItem {
  id: string;
  name: string;
  description?: string;
  permissions: { permission: { code: string } }[];
}

export const rolesService = {
  list: async () => {
    const response = await apiClient.get<ApiEnvelope<RoleItem[]>>("/roles");
    return response.data.data;
  },
  getById: async (id: string) => {
    const all = await rolesService.list();
    const role = all.find((r: RoleItem) => r.id === id);
    if (!role) throw new Error(`Role not found: ${id}`);
    return role;
  },
  create: async (payload: { name: string; description?: string; permissions: string[] }) =>
    apiClient.post("/roles", payload),
  update: async (id: string, payload: { name?: string; description?: string; permissions?: string[] }) =>
    apiClient.patch(`/roles/${id}`, payload),
  remove: async (id: string) => apiClient.delete(`/roles/${id}`),
  clone: async (id: string) => {
    const source = await rolesService.getById(id);
    const payload = {
      name: `${source.name} (copy)`,
      description: source.description,
      permissions: source.permissions.map((p: { permission: { code: string } }) => p.permission.code),
    };
    const response = await apiClient.post("/roles", payload);
    return response.data;
  },
  listPermissions: async () => {
    const response = await apiClient.get<ApiEnvelope<{ code: string; name: string }[]>>("/permissions");
    return response.data.data;
  },
};
