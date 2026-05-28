"use client";

import { useEffect } from "react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { RolesTable } from "@/modules/rbac/components/rbac/roles-table";
import { useRbacStore } from "@/modules/rbac/stores/rbac.store";

export default function RolesPage() {
  const loadRoles = useRbacStore((s) => s.loadRoles);
  const loadUsers = useRbacStore((s) => s.loadUsers);

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, [loadRoles, loadUsers]);

  return (
    <RoleGuard permission="roles.read">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Roles & Permissions</h2>
        <RolesTable />
      </div>
    </RoleGuard>
  );
}
