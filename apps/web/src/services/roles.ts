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
  create: async (payload: { name: string; description?: string; permissions: string[] }) =>
    apiClient.post("/roles", payload),
  update: async (id: string, payload: { name?: string; description?: string; permissions?: string[] }) =>
    apiClient.patch(`/roles/${id}`, payload),
  remove: async (id: string) => apiClient.delete(`/roles/${id}`),
  listPermissions: async () => {
    const response = await apiClient.get<ApiEnvelope<{ code: string; name: string }[]>>("/permissions");
    return response.data.data;
  },
};
