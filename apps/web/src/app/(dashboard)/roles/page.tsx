"use client";

import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { RolesTable } from "@/modules/rbac/components/rbac/roles-table";

export default function RolesPage() {
  return (
    <RoleGuard permission="roles.read">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Roles & Permissions</h2>
        <RolesTable />
      </div>
    </RoleGuard>
  );
}
