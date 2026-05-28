import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.request.use((config) => {
  const { accessToken, tenantId } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (tenantId) {
    config.headers["x-tenant-id"] = tenantId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");
    if (status !== 401 || originalRequest?._retry || isRefreshRequest) {
      if (status === 401 && isRefreshRequest) {
        useAuthStore.getState().clearAuth(true);
      }
      return Promise.reject(error);
    }
    originalRequest._retry = true;
    if (!refreshPromise) {
      refreshPromise = useAuthStore.getState().refreshAccessToken();
    }
    const token = await refreshPromise.finally(() => {
      refreshPromise = null;
    });
    if (!token) {
      useAuthStore.getState().clearAuth(true);
      return Promise.reject(error);
    }
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return apiClient(originalRequest);
  },
);

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}
