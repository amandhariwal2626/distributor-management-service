"use client";

import { useAuthStore } from "@/store/auth-store";

export function usePermissions() {
  return useAuthStore((state) => state.user?.permissions ?? []);
}

export function useHasPermission(permission: string) {
  const permissions = usePermissions();
  return permissions.includes(permission);
}
