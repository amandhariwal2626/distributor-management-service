"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import SidebarWrapper from "@/components/sidebar";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <SidebarWrapper> Home </SidebarWrapper>
    </ProtectedRoute>
  );
}
