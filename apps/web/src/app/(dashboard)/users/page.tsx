"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { UsersTable } from "@/components/users/users-table";
import { UsersTableSkeleton } from "@/components/users/users-table-skeleton";
import { useRbacStore } from "@/store/rbac-store";
import type { UserStatus } from "@/types";

export default function UsersPage() {
  const router = useRouter();
  const {
    users,
    totalUsers,
    usersPage,
    usersLimit,
    usersPages,
    roles,
    loading,
    loadUsers,
    loadRoles,
  } = useRbacStore();

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, [loadRoles, loadUsers]);

  const handleFiltersChange = useCallback(
    (filters: { search?: string; status?: UserStatus; roleId?: string }) => {
      loadUsers({ page: 1, ...filters });
    },
    [loadUsers],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      loadUsers({ page });
    },
    [loadUsers],
  );

  return (
    <RoleGuard permission="users.read">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Users</h2>
        {loading && users.length === 0 ? (
          <UsersTableSkeleton />
        ) : (
          <UsersTable
            users={users}
            total={totalUsers}
            page={usersPage}
            limit={usersLimit}
            pages={usersPages}
            roles={roles}
            onPageChange={handlePageChange}
            onFiltersChange={handleFiltersChange}
            onView={(user) => router.push(`/users/${user.id}`)}
            onEdit={(user) => router.push(`/users/${user.id}/edit`)}
            onCreate={() => router.push("/users/create")}
          />
        )}
      </div>
    </RoleGuard>
  );
}
