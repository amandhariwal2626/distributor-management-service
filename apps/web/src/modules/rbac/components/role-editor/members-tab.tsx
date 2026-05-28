"use client";

import { useMemo } from "react";
import { Users as UsersIcon } from "lucide-react";
import { useRbacStore } from "../../stores/rbac.store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RoleEditorData } from "./types";

interface Props {
  role: RoleEditorData;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function MembersTab({ role }: Props) {
  const users = useRbacStore((s) => s.users);
  const roles = useRbacStore((s) => s.roles);

  const members = useMemo(
    () => users.filter((u) => u.roleIds.includes(role.id)),
    [users, role.id],
  );

  const rolesById = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);

  return (
    <div className="rounded-md border">
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <UsersIcon className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">No members assigned</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Users with this role will appear here.
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {initials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roleIds.map((rid) => (
                      <Badge key={rid} variant="secondary" className="text-xs">
                        {rolesById.get(rid)?.name ?? rid}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.status === "active"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
