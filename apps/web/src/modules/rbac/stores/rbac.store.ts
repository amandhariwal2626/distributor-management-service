"use client";

import type { PermissionId } from "@/types";
import { useRbacStore as useGeneratedStore } from "@/store/rbac-store";

// Re-export all actions from the generated store
export const useRbacStore = useGeneratedStore;

// Backward-compat helper used by existing role-editor components
const cachedPermissions: Record<string, PermissionId[]> = {};

export function selectEffectivePermissions(userId: string): PermissionId[] {
  if (!cachedPermissions[userId]) {
    // Fallback: collect from roles (assumes roles are fetched)
    cachedPermissions[userId] = [];
  }
  return cachedPermissions[userId];
}

export function invalidatePermissionsCache(userId: string) {
  delete cachedPermissions[userId];
}
