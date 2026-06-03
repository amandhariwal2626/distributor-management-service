import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiEnvelope<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  const { accessToken, organizationId } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (organizationId) {
    config.headers["x-organization-id"] = organizationId;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope<unknown> | unknown>) => {
    const body = response.data as ApiEnvelope<unknown> | undefined;
    if (
      body &&
      typeof body === "object" &&
      "data" in (body as object) &&
      "success" in (body as object)
    ) {
      response.data = (body as ApiEnvelope<unknown>).data;
    }
    return response;
  },
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    const status = error.response?.status;
    const url = originalRequest?.url ?? "";
    const isRefreshRequest = url.includes("/auth/refresh");
    const isPublicAuth = url.includes("/auth/login") || url.includes("/auth/signup") ||
      url.includes("/auth/forgot-password") || url.includes("/auth/reset-password");

    if (status !== 401 || originalRequest?._retry || isRefreshRequest || isPublicAuth) {
      if (status === 401 && isRefreshRequest) {
        useAuthStore.getState().clearAuth(true);
      }
      const body = error.response?.data as ApiEnvelope<unknown> | undefined;
      return Promise.reject(new Error(body?.message || error.message || "Request failed"));
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
    return api(originalRequest);
  },
);

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get<T>(url, { params });
  return res.data;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.post<T>(url, body);
  return res.data;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const res = await api.patch<T>(url, body);
  return res.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await api.delete<T>(url);
  return res.data;
}

// Backward-compat alias
export const apiClient = api;

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  organizationId: string;
  status: string;
  roles: string[];
  permissions: string[];
}
