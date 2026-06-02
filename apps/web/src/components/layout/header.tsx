import { LogOut, Menu, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import { useAuthStore } from "@/store/auth-store";

interface HeaderProps {
  onToggleSidebar?: () => void;
  /** Called after logout completes (e.g. router.push("/login")). */
  onLogout?: () => void;
}

export function Header({ onToggleSidebar, onLogout }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    await logout();
    onLogout?.();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-sm font-medium text-muted-foreground">Distributor Management</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent">
            <UserAvatar name={user?.fullName || user?.email || "?"} className="h-8 w-8" />
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium">{user?.fullName ?? "User"}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{user?.fullName ?? "Account"}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
