import { SidebarItem } from "@/types/sidebar";
import {
  LayoutGrid,
  ShoppingCart,
  Boxes,
  CreditCard,
  BarChart3,
  UserCog,
} from "lucide-react";

export const navMain: SidebarItem[] = [
  {
    title: "Overview",
    url: "/overview",
    icon: LayoutGrid,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
    permission: "orders.read",
    items: [
      {
        title: "All Orders",
        url: "/orders/all",
        permission: "orders.read",
      },
      {
        title: "Create Order",
        url: "/orders/create",
        permission: "orders.create",
      },
    ],
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Boxes,
    permission: "inventory.read",
    items: [
      {
        title: "Products",
        url: "/inventory/products",
        permission: "inventory.read",
      },
      {
        title: "Stock Management",
        url: "/inventory/stocks",
        permission: "inventory.manage",
      },
    ],
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
    permission: "payments.manage",
    items: [
      {
        title: "Transactions",
        url: "/payments/transactions",
        permission: "payments.read",
      },
      {
        title: "Refunds",
        url: "/payments/refunds",
        permission: "payments.manage",
      },
    ],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    permission: "reports.export",
    items: [
      {
        title: "Sales Reports",
        url: "/reports/sales",
        permission: "reports.read",
      },
      {
        title: "Export Reports",
        url: "/reports/export",
        permission: "reports.export",
      },
    ],
  },
  {
    title: "Users & Access",
    url: "/users",
    icon: UserCog,
    permission: "users.read",
    items: [
      {
        title: "Users",
        url: "/users",
        permission: "users.read",
      },
      {
        title: "Roles & Permissions",
        url: "/roles",
        permission: "roles.manage",
      },
      {
        title: "Audit Logs",
        url: "/audit-logs",
        permission: "audit.read",
      },
    ],
  },
];
