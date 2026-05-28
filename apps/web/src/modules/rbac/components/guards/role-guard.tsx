"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";
import { usePermissions } from "../../hooks/use-permissions";
import type { PermissionId } from "../../types";

interface Props {
  permission?: PermissionId | PermissionId[];
  roles?: string[];
  redirectTo?: string;
  children: ReactNode;
}

export function RoleGuard({
  permission,
  roles,
  redirectTo = "/unauthorized",
  children,
}: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const status = isLoading ? "loading" : isAuthenticated ? "authenticated" : "unauthenticated";
  const { has, hasAll } = usePermissions();

  const allowed = (() => {
    if (status !== "authenticated" || !user) return false;
    if (permission) {
      return Array.isArray(permission) ? hasAll(permission) : has(permission);
    }
    if (roles && roles.length) {
      return roles.some((r) => user.roles.includes(r));
    }
    return true;
  })();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    } else if (!allowed) {
      router.replace(redirectTo);
    }
  }, [status, allowed, redirectTo, router]);

  if (status !== "authenticated" || !allowed) return null;
  return <>{children}</>;
}
