import { PERMISSION_CATALOG } from "../data/permissions";
import type { Role } from "../types";

export function buildPermissionMatrixCsv(roles: Role[]): string {
  const header = ["Module", "Permission", "Key", ...roles.map((r) => r.name)];
  const rows: string[][] = [];
  for (const group of PERMISSION_CATALOG) {
    for (const p of group.permissions) {
      rows.push([
        group.label,
        p.label,
        p.id,
        ...roles.map((r) => (r.permissions.includes(p.id) ? "X" : "")),
      ]);
    }
  }
  return [header, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\n");
}

function escape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
