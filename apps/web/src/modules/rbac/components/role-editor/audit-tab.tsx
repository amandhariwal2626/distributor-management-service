"use client";

import { useMemo } from "react";
import { ScrollText } from "lucide-react";
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
import type { RoleEditorData } from "./types";

interface Props {
  role: RoleEditorData;
}

const ACTION_LABELS: Record<string, string> = {
  "role.created": "Created",
  "role.updated": "Updated",
  "role.deleted": "Deleted",
  "role.cloned": "Cloned",
  "role.permissions_changed": "Permissions changed",
  "user.invited": "Invited",
  "user.role_assigned": "Role assigned",
  "user.role_removed": "Role removed",
  "user.deactivated": "Deactivated",
  "user.reactivated": "Reactivated",
};

export function AuditTab({ role }: Props) {
  const auditLogs = useRbacStore((s) => s.auditLogs);

  const logs = useMemo(
    () =>
      auditLogs.filter(
        (l) =>
          l.target.type === "role" &&
          (l.target.id === role.id || l.target.label === role.name),
      ),
    [auditLogs, role],
  );

  return (
    <div className="rounded-md border">
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <ScrollText className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">No audit entries yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Changes to this role will be logged here.
            </p>
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Performed by</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant="secondary">
                    {ACTION_LABELS[log.action] ?? log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{log.performedBy.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.performedBy.email}
                  </div>
                </TableCell>
                <TableCell>
                  {log.changes ? (
                    <code className="text-xs text-muted-foreground">
                      {JSON.stringify(log.changes)}
                    </code>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
