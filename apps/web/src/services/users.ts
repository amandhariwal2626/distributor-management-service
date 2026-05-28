import { apiClient, ApiEnvelope } from "@/lib/api";

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  roles: { role: { id: string; name: string } }[];
}

export interface UsersResponse {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const usersService = {
  list: async (params: Record<string, string>) => {
    const response = await apiClient.get<ApiEnvelope<UsersResponse>>("/users", { params });
    return response.data.data;
  },
  create: async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    roleIds: string[];
    permissionOverrides?: string[];
  }) => {
    return apiClient.post("/users", payload);
  },
  reinvite: async (id: string) => apiClient.post(`/users/${id}/invite`),
  deactivate: async (id: string) => apiClient.patch(`/users/${id}/deactivate`),
  reactivate: async (id: string) => apiClient.patch(`/users/${id}/reactivate`),
};
