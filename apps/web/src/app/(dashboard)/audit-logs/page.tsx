"use client";

import { useEffect } from "react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { AuditTable } from "@/modules/rbac/components/rbac/audit-table";
import { useRbacStore } from "@/modules/rbac/stores/rbac.store";

export default function AuditLogsPage() {
  const loadRoles = useRbacStore((s) => s.loadRoles);
  const loadUsers = useRbacStore((s) => s.loadUsers);

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, [loadRoles, loadUsers]);

  return (
    <RoleGuard permission="audit.read">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Audit Logs</h2>
        <AuditTable />
      </div>
    </RoleGuard>
  );
}
