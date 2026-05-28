"use client";

import { useEffect } from "react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { UsersTable } from "@/modules/rbac/components/rbac/users-table";
import { useRbacStore } from "@/modules/rbac/stores/rbac.store";

export default function UsersPage() {
  const loadRoles = useRbacStore((s) => s.loadRoles);
  const loadUsers = useRbacStore((s) => s.loadUsers);

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, [loadRoles, loadUsers]);

  return (
    <RoleGuard permission="users.read">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <UsersTable />
      </div>
    </RoleGuard>
  );
}
