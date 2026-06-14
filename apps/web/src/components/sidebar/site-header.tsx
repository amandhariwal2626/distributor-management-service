"use client";

import { SidebarIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { usePathname } from "next/navigation";
import { UserNav } from "./user-nav";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const pathLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/products": "Product Master",
  "/products/create": "Create Product",
  "/prices": "Price Master",
  "/prices/create": "Create Price",
  "/uploads": "Upload Center",
  "/approvals": "Approval Inbox",
  "/audit": "Audit Log",
  "/audit-logs": "Audit Logs",
  "/users": "Users",
  "/users/create": "Create User",
  "/roles": "Roles",
  "/roles/new": "Create Role",
  "/hierarchy": "Hierarchy",
  "/": "Home",
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const parentPath = "/" + segments.slice(0, -1).join("/");

  const parentLabel = pathLabels[parentPath] || null;
  const currentLabel =
    pathLabels[pathname] || segments[segments.length - 1] || "Home";

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {segments.length > 0 ? (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={parentPath || "/dashboard"}>
                {parentLabel || "Dashboard"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function SiteHeader() {
  const { toggleSidebar, isMobile, state } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center justify-between gap-2 pl-2 pr-4">
        <div className="flex gap-2 items-center">
          <div
            className={cn(
              state === "collapsed" ? "w-8" : isMobile ? "w-12" : "w-60",
              "transition-[width] duration-200 ease-linear",
            )}
          >
            {state === "collapsed" ? "DMS" : "Distributor Management System"}
          </div>
          <Separator orientation="vertical" className="min-h-14 -ml-[1px]" />
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
          </Button>

          <Breadcrumbs />
        </div>

        {/* Global Search bar */}
        {/* <div className="w-full sm:ml-auto sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex h-9 w-64 justify-between text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search products, prices...</span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div> */}

        <div className="flex items-center gap-2">
          {/* Notification Icon */}
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
          </Button> */}
          <ThemeModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
