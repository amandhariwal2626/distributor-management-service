"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PERMISSION_CATALOG } from "../../data/permissions";
import {
  expandWithDependencies,
  removeWithDependents,
} from "../../lib/permissions";
import type { PermissionId } from "../../types";
import { PermissionRow } from "./permission-row";

const DEFAULT_COLUMNS = ["create", "read", "update", "delete", "share", "approve", "export"];
const EXTRA_ACTIONS = ["reject", "assign", "manage", "*"];

const ACTION_LABELS: Record<string, string> = {
  create: "Create",
  read: "Read",
  update: "Edit",
  delete: "Delete",
  share: "Share",
  approve: "Approve",
  reject: "Reject",
  assign: "Assign",
  export: "Export",
  manage: "Manage",
  "*": "Owner",
};

interface Props {
  value: PermissionId[];
  onChange: (next: PermissionId[]) => void;
  disabled?: boolean;
}

export function PermissionMatrix({ value, onChange, disabled }: Props) {
  const [query, setQuery] = useState("");

  const selected = useMemo(() => new Set(value), [value]);

  const filteredCatalog = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PERMISSION_CATALOG;
    return PERMISSION_CATALOG.map((group) => ({
      ...group,
      permissions: group.permissions.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.label.toLowerCase().includes(q) ||
          group.label.toLowerCase().includes(q),
      ),
    })).filter((g) => g.permissions.length > 0);
  }, [query]);

  const columns = useMemo(() => {
    const usedActions = new Set<string>();
    for (const g of filteredCatalog) {
      for (const p of g.permissions) {
        usedActions.add(p.action);
      }
    }
    const cols = [...DEFAULT_COLUMNS];
    for (const a of EXTRA_ACTIONS) {
      if (usedActions.has(a) && !cols.includes(a)) {
        cols.push(a);
      }
    }
    return cols;
  }, [filteredCatalog]);

  function togglePermission(id: PermissionId, next: boolean): void {
    if (next) {
      const expanded = expandWithDependencies([...selected, id]);
      onChange([...expanded]);
    } else {
      const reduced = removeWithDependents(selected, id);
      onChange([...reduced]);
    }
  }

  function toggleGroup(ids: PermissionId[], next: boolean): void {
    if (next) {
      const expanded = expandWithDependencies([...selected, ...ids]);
      onChange([...expanded]);
    } else {
      let s = new Set(selected);
      for (const id of ids) s = removeWithDependents(s, id);
      onChange([...s]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search permissions\u2026"
          className="pl-9"
        />
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background z-20 min-w-40">
                Resource
              </TableHead>
              {columns.map((action) => (
                <TableHead
                  key={action}
                  className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[64px] px-2"
                >
                  {ACTION_LABELS[action] ?? action}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCatalog.length === 0 && (
              <TableRow>
                <td
                  colSpan={columns.length + 1}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No permissions match &ldquo;{query}&rdquo;.
                </td>
              </TableRow>
            )}
            {filteredCatalog.map((group) => (
              <PermissionRow
                key={group.key}
                groupLabel={group.label}
                groupKey={group.key}
                permissions={group.permissions}
                selected={selected}
                columns={columns}
                columnLabel={(a) => ACTION_LABELS[a] ?? a}
                disabled={disabled}
                onTogglePermission={togglePermission}
                onToggleGroup={(next) =>
                  toggleGroup(
                    group.permissions.map((p) => p.id),
                    next,
                  )
                }
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
