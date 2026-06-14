import {
  LayoutDashboard,
  Users,
  Shield,
  Network,
  Package,
  DollarSign,
  Tags,
  Award,
  SlidersHorizontal,
  Upload,
  CheckCircle2,
  FileBarChart,
  Settings,
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
    label: "Dashboard",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Masters",
    items: [
      { label: "Product Master", href: "/products", icon: Package, permission: "users.read" },
      { label: "Price Master", href: "/prices", icon: DollarSign, permission: "users.read" },
      { label: "Category Master", href: "/categories", icon: Tags },
      { label: "Brand Master", href: "/brands", icon: Award },
      { label: "Attribute Master", href: "/attributes", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Approvals", href: "/approvals", icon: CheckCircle2 },
      { label: "Uploads", href: "/uploads", icon: Upload },
      { label: "Audit", href: "/audit", icon: FileBarChart },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Users", href: "/users", icon: Users, permission: "users.read" },
      { label: "Roles", href: "/roles", icon: Shield, permission: "roles.read" },
      { label: "Hierarchy", href: "/hierarchy", icon: Network, permission: "hierarchy.view" },
      { label: "Settings", href: "#", icon: Settings },
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
