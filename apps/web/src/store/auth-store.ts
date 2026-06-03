"use client";

import { create } from "zustand";
import { apiGet, apiPost, AuthUser } from "@/lib/api";

const STORAGE = {
  access: "dms.accessToken",
  refresh: "dms.refreshToken",
  user: "dms.user",
  org: "dms.organizationId",
};

function persist(
  token: string | null,
  refresh: string | null,
  user: AuthUser | null,
): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(STORAGE.access, token);
  else localStorage.removeItem(STORAGE.access);
  if (refresh) localStorage.setItem(STORAGE.refresh, refresh);
  else localStorage.removeItem(STORAGE.refresh);
  if (user) {
    localStorage.setItem(STORAGE.user, JSON.stringify(user));
    localStorage.setItem(STORAGE.org, user.organizationId);
  } else {
    localStorage.removeItem(STORAGE.user);
    localStorage.removeItem(STORAGE.org);
  }
}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  organizationId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSessionExpired: boolean;
  clearAuth: (sessionExpired?: boolean) => void;
  login: (input: {
    organizationCode: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  bootstrap: () => Promise<void>;
  loadSession: () => void;
  hasPermission: (permission: string) => boolean;
  forceSessionExpired: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  organizationId: null,
  isAuthenticated: false,
  isLoading: true,
  isSessionExpired: false,

  clearAuth: (sessionExpired = false) => {
    persist(null, null, null);
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      organizationId: null,
      isAuthenticated: false,
      isSessionExpired: sessionExpired,
    });
  },

  login: async (input) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE.org, input.organizationCode);
    }
    const res = await apiPost<{
      accessToken: string;
      refreshToken?: string;
      user: AuthUser;
    }>("/auth/login", input);
    persist(res.accessToken, res.refreshToken ?? null, res.user);
    set({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken ?? null,
      user: res.user,
      organizationId: res.user.organizationId,
      isAuthenticated: true,
      isLoading: false,
      isSessionExpired: false,
    });
  },

  logout: async () => {
    try {
      await apiPost("/auth/logout");
    } catch {
      // ignore
    } finally {
      persist(null, null, null);
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        organizationId: null,
        isAuthenticated: false,
        isLoading: false,
        isSessionExpired: false,
      });
    }
  },

  refreshAccessToken: async () => {
    try {
      const res = await apiPost<{ accessToken: string }>("/auth/refresh");
      set({
        accessToken: res.accessToken,
        isAuthenticated: true,
        isSessionExpired: false,
      });
      persist(res.accessToken, get().refreshToken, get().user);
      return res.accessToken;
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
      const me = await apiGet<AuthUser>("/auth/me");
      set({
        user: me,
        organizationId: me.organizationId,
        isAuthenticated: true,
      });
      persist(token, get().refreshToken, me);
    } finally {
      set({ isLoading: false });
    }
  },

  loadSession() {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(STORAGE.access);
    const refresh = localStorage.getItem(STORAGE.refresh);
    const userStr = localStorage.getItem(STORAGE.user);
    const org = localStorage.getItem(STORAGE.org);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser;
        set({
          user,
          accessToken: token,
          refreshToken: refresh,
          organizationId: org ?? user.organizationId,
          isAuthenticated: true,
          isLoading: false,
        });
        apiGet<AuthUser>("/auth/me")
          .then((fresh) => {
            persist(token, refresh, fresh);
            set({ user: fresh });
          })
          .catch(() => undefined);
      } catch {
        persist(null, null, null);
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  hasPermission(permission) {
    return get().user?.permissions?.includes(permission) ?? false;
  },

  forceSessionExpired: () => {
    get().clearAuth(true);
    set({ isLoading: false });
  },
}));
