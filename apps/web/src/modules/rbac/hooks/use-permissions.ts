"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/auth-store";
import { hasAll, hasAny, hasPermission } from "../lib/permissions";
import type { PermissionId } from "../types";

export function usePermissions(): {
  permissions: string[];
  has: (id: PermissionId) => boolean;
  hasAll: (ids: PermissionId[]) => boolean;
  hasAny: (ids: PermissionId[]) => boolean;
} {
  const user = useAuthStore((s) => s.user);
  const permissions = useMemo(() => user?.permissions ?? [], [user]);

  return useMemo(
    () => ({
      permissions,
      has: (id: PermissionId) => hasPermission(permissions, id),
      hasAll: (ids: PermissionId[]) => hasAll(permissions, ids),
      hasAny: (ids: PermissionId[]) => hasAny(permissions, ids),
    }),
    [permissions],
  );
}

export function useHasPermission(id: PermissionId | PermissionId[]): boolean {
  const { has, hasAll: all } = usePermissions();
  return Array.isArray(id) ? all(id) : has(id);
}
