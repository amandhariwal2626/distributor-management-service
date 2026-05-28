"use client";

import { create } from "zustand";
import { apiClient, ApiEnvelope, AuthUser } from "@/lib/api";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionExpired: boolean;
  clearAuth: (sessionExpired?: boolean) => void;
  login: (input: { tenantCode: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  bootstrap: () => Promise<void>;
  forceSessionExpired: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  tenantId: null,
  isAuthenticated: false,
  isLoading: true,
  isSessionExpired: false,
  clearAuth: (sessionExpired = false) =>
    set({
      accessToken: null,
      user: null,
      tenantId: null,
      isAuthenticated: false,
      isSessionExpired: sessionExpired,
    }),
  login: async (input) => {
    const response = await apiClient.post<ApiEnvelope<{ accessToken: string; user: AuthUser }>>(
      "/auth/login",
      input,
    );
    const payload = response.data.data;
    set({
      accessToken: payload.accessToken,
      user: payload.user,
      tenantId: payload.user.tenantId,
      isAuthenticated: true,
      isLoading: false,
      isSessionExpired: false,
    });
  },
  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      get().clearAuth();
    }
  },
  refreshAccessToken: async () => {
    try {
      const response = await apiClient.post<ApiEnvelope<{ accessToken: string }>>("/auth/refresh");
      const accessToken = response.data.data.accessToken;
      set({ accessToken, isAuthenticated: true, isSessionExpired: false });
      return accessToken;
    } catch {
      get().clearAuth(true);
      return null;
    }
  },
  bootstrap: async () => {
    set({ isLoading: true });
    const token = await get().refreshAccessToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const me = await apiClient.get<ApiEnvelope<AuthUser>>("/auth/me");
      const userBase = me.data.data;
      set((state) => ({
        user: state.user
          ? state.user
          : {
              id: userBase.id,
              email: userBase.email,
              fullName: userBase.fullName,
              tenantId: userBase.tenantId,
              roles: userBase.roles,
              permissions: userBase.permissions,
            },
        tenantId: userBase.tenantId,
        isAuthenticated: true,
      }));
    } finally {
      set({ isLoading: false });
    }
  },
  forceSessionExpired: () => {
    get().clearAuth(true);
    set({ isLoading: false });
  },
}));
