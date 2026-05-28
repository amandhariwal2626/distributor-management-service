"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { PERMISSION_CATALOG } from "../../data/permissions";
import {
  expandWithDependencies,
  removeWithDependents,
} from "../../lib/permissions";
import type { PermissionId } from "../../types";

const ACTION_DISPLAY: Record<string, string> = {
  read: "Read",
  create: "Create",
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

const ALL_ACTIONS = Object.keys(ACTION_DISPLAY);

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

  const actionsShown = useMemo(() => {
    const used = new Set<string>();
    for (const group of filteredCatalog) {
      for (const p of group.permissions) {
        used.add(p.action);
      }
    }
    return ALL_ACTIONS.filter((a) => used.has(a));
  }, [filteredCatalog]);

  const actionCount = actionsShown.length;

  function togglePermission(id: PermissionId, next: boolean): void {
    if (next) {
      const expanded = expandWithDependencies([...selected, id]);
      onChange([...expanded]);
    } else {
      const reduced = removeWithDependents(selected, id);
      onChange([...reduced]);
    }
  }

  function toggleGroup(group: (typeof PERMISSION_CATALOG)[number], next: boolean): void {
    if (next) {
      const expanded = expandWithDependencies([...selected, ...group.permissions.map((p) => p.id)]);
      onChange([...expanded]);
    } else {
      let s = new Set(selected);
      for (const p of group.permissions) s = removeWithDependents(s, p.id);
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
              <TableHead className="sticky left-0 bg-background min-w-32">Module</TableHead>
              {actionsShown.map((action) => (
                <TableHead key={action} className="text-center min-w-20">
                  {ACTION_DISPLAY[action]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCatalog.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={actionCount + 1}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No permissions match &ldquo;{query}&rdquo;.
                </TableCell>
              </TableRow>
            )}
            {filteredCatalog.map((group) => {
              const ids = group.permissions.map((p) => p.id);
              const selectedCount = ids.filter((id) => selected.has(id)).length;
              const allSelected = selectedCount === ids.length;
              const someSelected = selectedCount > 0 && !allSelected;

              const permByAction = new Map(group.permissions.map((p) => [p.action, p]));

              return (
                <TableRow key={group.key}>
                  <TableCell className="sticky left-0 bg-background">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                        disabled={disabled}
                        onCheckedChange={(c) => toggleGroup(group, c === true)}
                        aria-label={`Select all ${group.label} permissions`}
                      />
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium truncate">{group.label}</span>
                        <Badge variant="secondary" className="font-mono shrink-0 text-[10px] px-1.5">
                          {selectedCount}/{ids.length}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  {actionsShown.map((action) => {
                    const perm = permByAction.get(action);
                    if (!perm) {
                      return <TableCell key={action} />;
                    }
                    const checked = selected.has(perm.id);
                    return (
                      <TableCell key={action} className="text-center">
                        <Checkbox
                          checked={checked}
                          disabled={disabled}
                          onCheckedChange={(c) => togglePermission(perm.id, c === true)}
                          aria-label={perm.label}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
