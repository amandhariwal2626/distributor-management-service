import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { RoleBadge } from "@/components/shared/role-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useRbacStore } from "@/store/rbac-store";
import { useAuthStore } from "@/store/auth-store";
import type { Role, User, UserStatus } from "@/types";

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  roles: Role[];
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: { search?: string; status?: UserStatus; roleId?: string }) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onCreate?: () => void;
}

const STATUSES: UserStatus[] = ["ACTIVE", "INACTIVE", "LOCKED", "SUSPENDED"];

export function UsersTable({
  users,
  total,
  page,
  limit,
  pages,
  roles,
  onPageChange,
  onFiltersChange,
  onView,
  onEdit,
  onCreate,
}: UsersTableProps) {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const {
    deactivateUser,
    reactivateUser,
    lockUser,
    unlockUser,
    suspendUser,
    deleteUser,
    resetPassword,
  } = useRbacStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");
  const [roleId, setRoleId] = useState<string>("ALL");
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description?: string;
    destructive?: boolean;
    onConfirm: () => Promise<void>;
  } | null>(null);

  function applyFilters(next: { search?: string; status?: UserStatus | "ALL"; roleId?: string }) {
    onFiltersChange({
      search: (next.search ?? search) || undefined,
      status: (next.status ?? status) === "ALL" ? undefined : ((next.status ?? status) as UserStatus),
      roleId: (next.roleId ?? roleId) === "ALL" ? undefined : (next.roleId ?? roleId),
    });
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name, email, code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilters({ search });
          }}
          className="max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as UserStatus | "ALL");
            applyFilters({ status: v as UserStatus | "ALL" });
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={roleId}
          onValueChange={(v) => {
            setRoleId(v);
            applyFilters({ roleId: v });
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          {hasPermission("users.create") && onCreate && (
            <Button onClick={onCreate}>Add User</Button>
          )}
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>User Code</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Reports To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={user.profile.fullName} className="h-8 w-8" />
                      <button
                        onClick={() => onView(user)}
                        className="text-left font-medium hover:underline"
                      >
                        {user.profile.fullName}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.profile.userCode ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.profile.mobile ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r) => (
                        <RoleBadge key={r.role.id} name={r.role.name} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.reportingManager?.profile?.fullName ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.lastLoginAt
                      ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(user)}>View</DropdownMenuItem>
                        {hasPermission("users.update") && (
                          <DropdownMenuItem onClick={() => onEdit(user)}>Edit</DropdownMenuItem>
                        )}
                        {hasPermission("users.reset_password") && (
                          <DropdownMenuItem
                            onClick={() => {
                              const pw = window.prompt("New password (min 8 chars):");
                              if (pw && pw.length >= 8) resetPassword(user.id, pw);
                            }}
                          >
                            Reset Password
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.status === "LOCKED"
                          ? hasPermission("users.unlock") && (
                              <DropdownMenuItem onClick={() => unlockUser(user.id)}>
                                Unlock
                              </DropdownMenuItem>
                            )
                          : hasPermission("users.lock") && (
                              <DropdownMenuItem onClick={() => lockUser(user.id)}>
                                Lock
                              </DropdownMenuItem>
                            )}
                        {hasPermission("users.update") &&
                          (user.status === "INACTIVE" ? (
                            <DropdownMenuItem onClick={() => reactivateUser(user.id)}>
                              Reactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => deactivateUser(user.id)}>
                              Deactivate
                            </DropdownMenuItem>
                          ))}
                        {hasPermission("users.update") && user.status !== "SUSPENDED" && (
                          <DropdownMenuItem onClick={() => suspendUser(user.id)}>
                            Suspend
                          </DropdownMenuItem>
                        )}
                        {hasPermission("users.delete") && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                setConfirm({
                                  open: true,
                                  title: `Delete ${user.profile.fullName}?`,
                                  description: "This action cannot be undone.",
                                  destructive: true,
                                  onConfirm: () => deleteUser(user.id),
                                })
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {start}-{end} of {total}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {pages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog
          open={confirm.open}
          onOpenChange={(open) => setConfirm(confirm ? { ...confirm, open } : null)}
          title={confirm.title}
          description={confirm.description}
          destructive={confirm.destructive}
          onConfirm={confirm.onConfirm}
        />
      )}
    </div>
  );
}
