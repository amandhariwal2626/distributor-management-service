"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import SidebarWrapper from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarWrapper>{children}</SidebarWrapper>
    </ProtectedRoute>
  );
}
