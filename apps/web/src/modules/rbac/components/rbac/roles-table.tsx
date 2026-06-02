"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRbacStore } from "@/store/rbac-store";

export function RolesTable() {
  const { roles, loading, loadRoles } = useRbacStore();

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  if (loading && roles.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>System</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                No roles found
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.level}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 6).map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                    {role.permissions.length > 6 && (
                      <span className="text-xs text-muted-foreground">
                        +{role.permissions.length - 6} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {role.isSystem ? (
                    <Badge variant="secondary" className="text-xs">
                      System
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Custom</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
