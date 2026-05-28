"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PermissionCheckboxCell } from "./permission-checkbox-cell";
import type { PermissionId } from "../../types";

interface PermissionDef {
  id: PermissionId;
  action: string;
  label: string;
}

interface Props {
  groupLabel: string;
  groupKey: string;
  permissions: PermissionDef[];
  selected: Set<PermissionId>;
  columns: string[];
  columnLabel: (action: string) => string;
  disabled?: boolean;
  onTogglePermission: (id: PermissionId, next: boolean) => void;
  onToggleGroup: (next: boolean) => void;
}

export function PermissionRow({
  groupLabel,
  permissions,
  selected,
  columns,
  disabled,
  onTogglePermission,
  onToggleGroup,
}: Props) {
  const ids = permissions.map((p) => p.id);
  const selectedCount = ids.filter((id) => selected.has(id)).length;
  const allSelected = selectedCount === ids.length;
  const someSelected = selectedCount > 0 && !allSelected;
  const permByAction = new Map(permissions.map((p) => [p.action, p]));

  return (
    <tr className="group border-b border-border/50 hover:bg-muted/30 transition-colors">
      <td className="sticky left-0 bg-background group-hover:bg-muted/30 transition-colors z-10 p-2 pl-4">
        <div className="flex items-center gap-2.5">
          <Checkbox
            checked={allSelected ? true : someSelected ? "indeterminate" : false}
            disabled={disabled}
            onCheckedChange={(c) => onToggleGroup(c === true)}
            aria-label={`Select all ${groupLabel} permissions`}
          />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium truncate">{groupLabel}</span>
            <Badge
              variant="secondary"
              className="font-mono shrink-0 text-[10px] px-1.5 h-4"
            >
              {selectedCount}/{ids.length}
            </Badge>
          </div>
        </div>
      </td>
      {columns.map((action) => {
        const perm = permByAction.get(action);
        if (!perm) {
          return (
            <td key={action} className="p-0 min-w-[64px]" />
          );
        }
        return (
          <PermissionCheckboxCell
            key={perm.id}
            checked={selected.has(perm.id)}
            disabled={disabled}
            onToggle={() => onTogglePermission(perm.id, !selected.has(perm.id))}
            label={perm.label}
            className="min-w-[64px]"
          />
        );
      })}
    </tr>
  );
}
