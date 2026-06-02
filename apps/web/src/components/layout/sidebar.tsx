import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/configs/sidebar";
import { useAuthStore } from "@/store/auth-store";

interface SidebarProps {
  /** Current pathname; pass from your router (e.g. usePathname() in Next.js). */
  pathname: string;
  /** Optional link component (e.g. next/link). Defaults to a plain anchor. */
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
  }>;
  collapsed?: boolean;
  className?: string;
}

function DefaultLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function Sidebar({
  pathname,
  LinkComponent = DefaultLink,
  collapsed,
  className,
}: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const items = useMemo(
    () =>
      sidebarItems.filter(
        (item) => !item.permission || user?.permissions?.includes(item.permission),
      ),
    [user],
  );

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all",
        collapsed ? "w-16" : "w-60",
        className,
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <span className={cn("text-lg font-semibold tracking-tight", collapsed && "hidden")}>
          DMS
        </span>
        <span className={cn("text-lg font-bold", !collapsed && "hidden")}>D</span>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <LinkComponent
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </LinkComponent>
          );
        })}
      </nav>
    </aside>
  );
}
