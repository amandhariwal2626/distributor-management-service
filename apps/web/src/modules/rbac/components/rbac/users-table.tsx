"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRbacStore, selectEffectivePermissions } from "../../stores/rbac.store";
import type { User, UserStatus } from "../../types";
import { PermissionGuard } from "../guards/permission-guard";
import { AssignRolesDialog } from "./assign-roles-dialog";
import { InviteUserDialog } from "./invite-user-dialog";
import { EffectivePermissionsSheet } from "./effective-permissions-sheet";

const STATUS_STYLES: Record<UserStatus, string> = {
  active:      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  invited:     "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  suspended:   "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  deactivated: "bg-muted text-muted-foreground border-border",
};

function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function UsersTable() {
  const users = useRbacStore((s) => s.users);
  const roles = useRbacStore((s) => s.roles);
  const setUserStatus = useRbacStore((s) => s.setUserStatus);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [assignUser, setAssignUser] = useState<User | null>(null);
  const [effectiveUser, setEffectiveUser] = useState<User | null>(null);

  const rolesById = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (roleFilter !== "all" && !u.roleIds.includes(roleFilter)) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, query, roleFilter, statusFilter]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users\u2026"
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="All roles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as UserStatus | "all")}>
          <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="deactivated">Deactivated</SelectItem>
          </SelectContent>
        </Select>
        <PermissionGuard permission="users.create">
          <Button onClick={() => setInviteOpen(true)} className="md:ml-auto">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite user
          </Button>
        </PermissionGuard>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-sm text-muted-foreground">
                  No users match the current filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback></Avatar>
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roleIds.length === 0 && (
                      <span className="text-xs text-muted-foreground">No roles</span>
                    )}
                    {user.roleIds.map((rid) => (
                      <Badge key={rid} variant="secondary">{rolesById.get(rid)?.name ?? rid}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_STYLES[user.status]}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="User actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => setEffectiveUser(user)}>
                        View effective permissions
                      </DropdownMenuItem>
                      {user.status === "invited" && (
                        <DropdownMenuItem
                          onSelect={async () => {
                            await useRbacStore.getState().reinviteUser(user.id);
                            toast.success(`Re-invitation sent to ${user.name}`);
                          }}
                        >
                          Re-invite
                        </DropdownMenuItem>
                      )}
                      <PermissionGuard permission="roles.assign">
                        <DropdownMenuItem onSelect={() => setAssignUser(user)}>
                          Manage roles
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard permission="users.update">
                        <DropdownMenuSeparator />
                        {user.status === "active" || user.status === "invited" ? (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => {
                              setUserStatus(user.id, "deactivated");
                              toast.success(`Deactivated ${user.name}`);
                            }}
                          >
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onSelect={() => {
                              setUserStatus(user.id, "active");
                              toast.success(`Reactivated ${user.name}`);
                            }}
                          >
                            Reactivate
                          </DropdownMenuItem>
                        )}
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <AssignRolesDialog
        user={assignUser}
        open={!!assignUser}
        onOpenChange={(o) => !o && setAssignUser(null)}
      />
      <EffectivePermissionsSheet
        user={effectiveUser}
        permissions={effectiveUser ? selectEffectivePermissions(effectiveUser.id) : []}
        open={!!effectiveUser}
        onOpenChange={(o) => !o && setEffectiveUser(null)}
      />
    </>
  );
}
