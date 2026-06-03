import type { AxiosResponse } from "axios";
import { apiClient, ApiEnvelope } from "@/lib/api";
import { User, UserStatus } from "@/modules/rbac/types";

export interface UserListItem {
  id: string;
  userCode?: string;
  fullName: string;
  email: string;
  mobile?: string;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  roles: { role: { id: string; name: string; level: number } }[];
  reportingManager?: { id: string; fullName: string; email: string } | null;
}

export interface UsersResponse {
  items: UserListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const usersService = {
  list: async (params: Record<string, string>): Promise<UsersResponse> => {
    const response = await apiClient.get<ApiEnvelope<UsersResponse>>("/users", {
      params,
    });
    return response.data.data;
  },
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiEnvelope<User>>(`/users/${id}`);
    return response.data.data;
  },
  create: async (payload: Record<string, unknown>): Promise<User> => {
    const response = await apiClient.post<ApiEnvelope<User>>("/users", payload);
    return response.data.data;
  },
  update: async (
    id: string,
    payload: Record<string, unknown>,
  ): Promise<User> => {
    const response = await apiClient.patch<ApiEnvelope<User>>(
      `/users/${id}`,
      payload,
    );
    return response.data.data;
  },
  delete: async (id: string): Promise<AxiosResponse> =>
    apiClient.delete(`/users/${id}`),
  deactivate: async (id: string): Promise<AxiosResponse> =>
    apiClient.patch(`/users/${id}/deactivate`),
  reactivate: async (id: string): Promise<AxiosResponse> =>
    apiClient.patch(`/users/${id}/reactivate`),
  lock: async (id: string): Promise<AxiosResponse> =>
    apiClient.patch(`/users/${id}/lock`),
  unlock: async (id: string): Promise<AxiosResponse> =>
    apiClient.patch(`/users/${id}/unlock`),
  suspend: async (id: string): Promise<AxiosResponse> =>
    apiClient.patch(`/users/${id}/suspend`),
  resetPassword: async (id: string, password: string): Promise<AxiosResponse> =>
    apiClient.post(`/users/${id}/reset-password`, { password }),
  getHierarchyTree: async (): Promise<unknown[]> => {
    const response = await apiClient.get<ApiEnvelope<unknown[]>>(
      "/users/hierarchy/tree",
    );
    return response.data.data;
  },
  getCreateOptions: async (): Promise<{
    roles: unknown[];
    managers: unknown[];
  }> => {
    const response = await apiClient.get<
      ApiEnvelope<{ roles: unknown[]; managers: unknown[] }>
    >("/users/create-options");
    return response.data.data;
  },
};
