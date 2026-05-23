"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isSessionExpired = useAuthStore((state) => state.isSessionExpired);

  useEffect(() => {
    if (isLoading) return;
    if (isSessionExpired) {
      router.replace("/session-expired");
      return;
    }
    if (!isAuthenticated && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, isSessionExpired, pathname, router]);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading session...</div>;
  }
  return <>{children}</>;
}
