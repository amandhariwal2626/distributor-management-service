import {
  LayoutDashboard,
  Users,
  Shield,
  Network,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import type { SidebarItem as OldSidebarItem } from "@/types/sidebar";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "User Management",
    items: [
      { label: "Users", href: "/users", icon: Users, permission: "users.read" },
      { label: "Roles", href: "/roles", icon: Shield, permission: "roles.read" },
      { label: "Hierarchy", href: "/hierarchy", icon: Network, permission: "hierarchy.view" },
    ],
  },
  {
    label: "Activity",
    items: [
      { label: "Audit Logs", href: "/audit-logs", icon: ScrollText, permission: "audit.read" },
    ],
  },
];

// Flat list for simpler consumers
export const sidebarItems: SidebarItem[] = sidebarGroups.flatMap((g) => g.items);

// Backward compat for old AppSidebar/NavMain — groups as collapsible sections
export const navMain: OldSidebarItem[] = sidebarGroups.map((group) => ({
  title: group.label,
  url: "#",
  items: group.items.map((item) => ({
    title: item.label,
    url: item.href,
    icon: item.icon,
    permission: item.permission,
  })),
}));
