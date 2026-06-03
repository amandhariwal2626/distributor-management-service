"use client";

import { useCallback, useEffect } from "react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { AuditTable } from "@/components/audit/audit-table";
import { AuditTableSkeleton } from "@/components/audit/audit-table-skeleton";
import { useRbacStore } from "@/store/rbac-store";
import type { ListAuditLogsParams } from "@/types";

export default function AuditLogsPage() {
  const {
    auditLogs,
    totalAuditLogs,
    auditPage,
    auditLimit,
    auditPages,
    loading,
    loadAuditLogs,
  } = useRbacStore();

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const handleFiltersChange = useCallback(
    (filters: ListAuditLogsParams) => {
      loadAuditLogs({ page: 1, ...filters });
    },
    [loadAuditLogs],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      loadAuditLogs({ page });
    },
    [loadAuditLogs],
  );

  return (
    <RoleGuard permission="audit.read">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Audit Logs</h2>
        {loading && auditLogs.length === 0 ? (
          <AuditTableSkeleton />
        ) : (
          <AuditTable
            logs={auditLogs}
            total={totalAuditLogs}
            page={auditPage}
            limit={auditLimit}
            pages={auditPages}
            onPageChange={handlePageChange}
            onFiltersChange={handleFiltersChange}
          />
        )}
      </div>
    </RoleGuard>
  );
}
