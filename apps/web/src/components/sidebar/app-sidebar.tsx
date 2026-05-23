"use client";

import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { filterSidebarByPermissions } from "@/utils/sidebar";
import { navMain } from "@/configs/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { FULL_ACCESS_PERMISSIONS } from "@/configs/permission";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const permissions = user?.permissions ?? [];
  const filteredSidebar = filterSidebarByPermissions(
    navMain,
    FULL_ACCESS_PERMISSIONS,
  );
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h1>DMS</h1>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredSidebar} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.fullName || "",
            email: user?.email || "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
