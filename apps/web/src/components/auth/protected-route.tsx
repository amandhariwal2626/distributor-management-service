"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

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
    return (
      <div className="flex flex-row gap-2 justify-center items-center min-h-screen w-full">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-base">Loading...</span>
      </div>
    );
  }
  return <>{children}</>;
}
