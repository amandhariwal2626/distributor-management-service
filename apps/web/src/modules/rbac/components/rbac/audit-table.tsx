"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRbacStore } from "../../stores/rbac.store";
import type { AuditAction } from "../../types";

const ACTION_LABELS: Record<AuditAction, string> = {
  "role.created": "Role created",
  "role.updated": "Role updated",
  "role.deleted": "Role deleted",
  "role.cloned": "Role cloned",
  "role.permissions_changed": "Permissions changed",
  "user.invited": "User invited",
  "user.role_assigned": "Role assigned",
  "user.role_removed": "Role removed",
  "user.deactivated": "User deactivated",
  "user.reactivated": "User reactivated",
};

const formatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function AuditTable() {
  const logs = useRbacStore((s) => s.auditLogs);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        l.target.label.toLowerCase().includes(q) ||
        l.performedBy.name.toLowerCase().includes(q) ||
        l.performedBy.email.toLowerCase().includes(q) ||
        (ACTION_LABELS[l.action] ?? l.action).toLowerCase().includes(q),
    );
  }, [logs, query]);

  return (
    <>
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by action, actor or target\u2026"
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Performed by</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-sm text-muted-foreground">
                  No audit events.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant="secondary">{ACTION_LABELS[log.action] ?? log.action}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{log.performedBy.name}</div>
                  <div className="text-xs text-muted-foreground">{log.performedBy.email}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{log.target.label}</div>
                  <div className="text-xs text-muted-foreground capitalize">{log.target.type}</div>
                </TableCell>
                <TableCell className="max-w-xs">
                  {log.changes ? (
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                      {JSON.stringify(log.changes)}
                    </pre>
                  ) : (
                    <span className="text-xs text-muted-foreground">&mdash;</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                  {formatter.format(new Date(log.timestamp))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
