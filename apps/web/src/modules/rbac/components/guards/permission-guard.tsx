"use client";

import type { ReactNode } from "react";
import { useHasPermission } from "../../hooks/use-permissions";
import type { PermissionId } from "../../types";

interface Props {
  permission: PermissionId | PermissionId[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGuard({ permission, fallback = null, children }: Props) {
  const allowed = useHasPermission(permission);
  return <>{allowed ? children : fallback}</>;
}
