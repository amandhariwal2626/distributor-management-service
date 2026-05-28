"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Lock, MoreHorizontal, Pencil, Search, Trash2, Users as UsersIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useRbacStore } from "../../stores/rbac.store";
import { PermissionGuard } from "../guards/permission-guard";
import type { Role } from "../../types";

export function RolesTable() {
  const roles = useRbacStore((s) => s.roles);
  const deleteRole = useRbacStore((s) => s.deleteRole);
  const cloneRole = useRbacStore((s) => s.cloneRole);

  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }, [roles, query]);

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles\u2026"
            className="pl-9"
          />
        </div>
        <PermissionGuard permission="roles.create">
          <Button asChild>
            <Link href="/roles/new">Create role</Link>
          </Button>
        </PermissionGuard>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-sm text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-start gap-2">
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {role.name}
                        {role.isSystem && (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Lock className="h-3 w-3" />
                            System
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {role.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono">{role.permissions.length}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    {role.userCount}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Role actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/roles/${role.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <PermissionGuard permission="roles.create">
                        <DropdownMenuItem
                          onSelect={() => {
                            cloneRole(role.id).then((clone) => {
                              if (clone) toast.success(`Cloned \u201c${role.name}\u201d`);
                            });
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Clone
                        </DropdownMenuItem>
                      </PermissionGuard>
                      <PermissionGuard permission="roles.delete">
                        <DropdownMenuItem
                          disabled={role.isSystem}
                          onSelect={() => setPendingDelete(role)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </PermissionGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role &ldquo;{pendingDelete?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the role from {pendingDelete?.userCount ?? 0} user
              {pendingDelete?.userCount === 1 ? "" : "s"}. They will lose any permissions
              granted exclusively by this role. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingDelete) return;
                deleteRole(pendingDelete.id);
                toast.success(`Deleted \u201c${pendingDelete.name}\u201d`);
                setPendingDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
