import { PERMISSION_MAP, ALL_PERMISSION_IDS, OWNER_PERMISSION } from "../data/permissions";
import type { PermissionId, Role } from "../types";

function hasOwnerAccess(perms: Iterable<PermissionId>): boolean {
  for (const p of perms) if (p === OWNER_PERMISSION) return true;
  return false;
}

export function expandWithDependencies(ids: Iterable<PermissionId>): Set<PermissionId> {
  const out = new Set<PermissionId>();
  const visit = (id: PermissionId) => {
    if (out.has(id)) return;
    const p = PERMISSION_MAP.get(id);
    if (!p) return;
    out.add(id);
    p.dependsOn?.forEach(visit);
  };
  for (const id of ids) visit(id);
  return out;
}

export function removeWithDependents(
  current: Iterable<PermissionId>,
  toRemove: PermissionId,
): Set<PermissionId> {
  const dependents = new Set<PermissionId>([toRemove]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of ALL_PERMISSION_IDS) {
      if (dependents.has(id)) continue;
      const p = PERMISSION_MAP.get(id);
      if (p?.dependsOn?.some((d) => dependents.has(d))) {
        dependents.add(id);
        changed = true;
      }
    }
  }
  return new Set([...current].filter((id) => !dependents.has(id)));
}

export function flattenRolePermissions(roles: Role[]): PermissionId[] {
  const set = new Set<PermissionId>();
  roles.forEach((r) => r.permissions.forEach((p) => set.add(p)));
  return [...set];
}

export function hasPermission(perms: Iterable<PermissionId>, required: PermissionId): boolean {
  if (hasOwnerAccess(perms)) return true;
  for (const p of perms) if (p === required) return true;
  return false;
}

export function hasAll(perms: Iterable<PermissionId>, required: PermissionId[]): boolean {
  if (hasOwnerAccess(perms)) return true;
  const set = new Set(perms);
  return required.every((r) => set.has(r));
}

export function hasAny(perms: Iterable<PermissionId>, required: PermissionId[]): boolean {
  if (hasOwnerAccess(perms)) return true;
  const set = new Set(perms);
  return required.some((r) => set.has(r));
}
