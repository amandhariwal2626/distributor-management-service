"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import SidebarLayout from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarLayout>{children}</SidebarLayout>
    </ProtectedRoute>
  );
}
