import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/common";
import type { AuditLog, ListAuditLogsParams } from "@/types";

const ACTIONS: Record<string, { label: string; className: string }> = {
  USER_CREATED: {
    label: "User Created",
    className: "bg-green-100 text-green-800",
  },
  USER_UPDATED: {
    label: "User Updated",
    className: "bg-blue-100 text-blue-800",
  },
  USER_DELETED: { label: "User Deleted", className: "bg-red-100 text-red-800" },
  PASSWORD_RESET: {
    label: "Password Reset",
    className: "bg-yellow-100 text-yellow-800",
  },
  ROLE_CHANGED: {
    label: "Role Changed",
    className: "bg-purple-100 text-purple-800",
  },
  STATUS_CHANGED: {
    label: "Status Changed",
    className: "bg-orange-100 text-orange-800",
  },
  REPORTING_MANAGER_CHANGED: {
    label: "Manager Changed",
    className: "bg-cyan-100 text-cyan-800",
  },
  LOGIN_FAILED: { label: "Login Failed", className: "bg-red-100 text-red-800" },
  ACCOUNT_LOCKED: {
    label: "Account Locked",
    className: "bg-orange-100 text-orange-800",
  },
  ACCOUNT_UNLOCKED: {
    label: "Account Unlocked",
    className: "bg-green-100 text-green-800",
  },
};

interface AuditTableProps {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: ListAuditLogsParams) => void;
}

export function AuditTable({
  logs,
  total,
  page,
  limit,
  pages,
  onPageChange,
  onFiltersChange,
}: AuditTableProps) {
  const [action, setAction] = useState<string>("ALL");
  const [actor, setActor] = useState("");
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function applyFilters() {
    onFiltersChange({
      action: action === "ALL" ? undefined : action,
      actorId: actor || undefined,
      from: from ? formatDate(from) : undefined,
      to: to ? formatDate(to) : undefined,
    });
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Action
          </label>
          <Select
            value={action}
            onValueChange={(v) => {
              setAction(v);
              onFiltersChange({
                action: v === "ALL" ? undefined : v,
                actorId: actor || undefined,
                from: from ? formatDate(from) : undefined,
                to: to ? formatDate(to) : undefined,
              });
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All actions</SelectItem>
              {Object.entries(ACTIONS).map(([key, val]) => (
                <SelectItem key={key} value={key}>
                  {val.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Actor ID
          </label>
          <Input
            value={actor}
            onChange={(e) => setActor(e.target.value)}
            placeholder="User ID"
            className="w-48"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            From
          </label>
          <DatePicker value={from} onChange={setFrom} placeholder="From date" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">To</label>
          <DatePicker value={to} onChange={setTo} placeholder="To date" />
        </div>
        <Button onClick={applyFilters}>Apply</Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Date/Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No audit logs
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => {
                const isExpanded = expanded.has(log.id);
                const meta = ACTIONS[log.action] ?? {
                  label: log.action,
                  className: "bg-gray-100 text-gray-800",
                };
                const hasDiff = log.oldValue || log.newValue;
                return (
                  <Fragment key={log.id}>
                    <TableRow>
                      <TableCell>
                        {hasDiff && (
                          <button
                            onClick={() => toggle(log.id)}
                            className="text-muted-foreground"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {log.actor ? (
                          <div>
                            <div className="text-sm font-medium">
                              {log.actor.profile.fullName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {log.actor.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">System</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(meta.className, "font-medium")}
                          variant="secondary"
                        >
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="font-medium">{log.entityType}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.entityId}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.ipAddress ?? "—"}
                      </TableCell>
                    </TableRow>
                    {isExpanded && hasDiff && (
                      <TableRow key={`${log.id}-diff`}>
                        <TableCell colSpan={6} className="bg-muted/30">
                          <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2">
                            <div>
                              <p className="mb-1 text-xs font-medium text-muted-foreground">
                                Old Value
                              </p>
                              <pre className="overflow-auto rounded bg-card p-2 text-xs">
                                {JSON.stringify(log.oldValue ?? {}, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-medium text-muted-foreground">
                                New Value
                              </p>
                              <pre className="overflow-auto rounded bg-card p-2 text-xs">
                                {JSON.stringify(log.newValue ?? {}, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
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
    </div>
  );
}
