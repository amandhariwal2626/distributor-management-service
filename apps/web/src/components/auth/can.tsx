"use client";

import { useAuthStore } from "@/store/auth-store";

export function Can({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? []);
  if (!permissions.includes(permission)) {
    return null;
  }
  return <>{children}</>;
}
