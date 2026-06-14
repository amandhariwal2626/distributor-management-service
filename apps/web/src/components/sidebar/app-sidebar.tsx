"use client";

import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { filterSidebarByPermissions } from "@/utils/sidebar";
import { navMain } from "@/configs/sidebar";
import { useAuthStore } from "@/store/auth-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user);
  const permissions = user?.permissions ?? [];
  const filteredSidebar = filterSidebarByPermissions(navMain, permissions);
  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain items={filteredSidebar} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
