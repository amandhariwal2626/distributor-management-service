import type { AxiosResponse } from "axios";
import { apiClient, ApiEnvelope } from "@/lib/api";

export interface RoleItem {
  id: string;
  name: string;
  description?: string;
  permissions: { permission: { code: string } }[];
}

export const rolesService = {
  list: async (): Promise<RoleItem[]> => {
    const response = await apiClient.get<ApiEnvelope<RoleItem[]>>("/roles");
    return response.data.data;
  },
  getById: async (id: string): Promise<RoleItem> => {
    const all = await rolesService.list();
    const role = all.find((r: RoleItem) => r.id === id);
    if (!role) throw new Error(`Role not found: ${id}`);
    return role;
  },
  create: async (payload: {
    name: string;
    description?: string;
    permissions: string[];
  }): Promise<AxiosResponse> => apiClient.post("/roles", payload),
  update: async (
    id: string,
    payload: { name?: string; description?: string; permissions?: string[] },
  ): Promise<AxiosResponse> => apiClient.patch(`/roles/${id}`, payload),
  remove: async (id: string): Promise<AxiosResponse> =>
    apiClient.delete(`/roles/${id}`),
  clone: async (id: string): Promise<ApiEnvelope<RoleItem>> => {
    const source = await rolesService.getById(id);
    const payload = {
      name: `${source.name} (copy)`,
      description: source.description,
      permissions: source.permissions.map(
        (p: { permission: { code: string } }) => p.permission.code,
      ),
    };
    const response = await apiClient.post("/roles", payload);
    return response.data;
  },
  listPermissions: async (): Promise<{ code: string; name: string }[]> => {
    const response =
      await apiClient.get<ApiEnvelope<{ code: string; name: string }[]>>(
        "/permissions",
      );
    return response.data.data;
  },
};
