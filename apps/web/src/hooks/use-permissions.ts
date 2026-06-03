"use client";

import { useAuthStore } from "@/store/auth-store";

const OWNER_PERMISSION = "settings.owner";

function hasOwnerAccess(perms: string[]) {
  return perms.includes(OWNER_PERMISSION);
}

export function usePermissions(): string[] {
  return useAuthStore((state) => state.user?.permissions ?? []);
}

export function useHasPermission(permission: string): boolean {
  const permissions = usePermissions();
  if (hasOwnerAccess(permissions)) return true;
  return permissions.includes(permission);
}
