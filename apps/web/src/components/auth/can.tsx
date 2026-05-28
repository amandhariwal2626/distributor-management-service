"use client";

import { useAuthStore } from "@/store/auth-store";

const OWNER_PERMISSION = "settings.owner";

export function Can({
  permission,
  children,
}: {
  permission: string;
  children: React.ReactNode;
}) {
  const permissions = useAuthStore((state) => state.user?.permissions ?? []);
  if (permissions.includes(OWNER_PERMISSION) || permissions.includes(permission)) {
    return <>{children}</>;
  }
  return null;
}
