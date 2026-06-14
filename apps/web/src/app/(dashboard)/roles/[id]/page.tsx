"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleDetailSkeleton } from "@/modules/rbac/components/rbac/role-detail-skeleton";
import { useRbacStore } from "@/store/rbac-store";
import type { Role } from "@/types";

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { roles, loading, loadRoles } = useRbacStore();

  useEffect(() => {
    if (roles.length === 0) loadRoles();
  }, [loadRoles, roles.length]);

  const role: Role | undefined = useMemo(
    () => roles.find((r: Role) => r.id === params.id),
    [roles, params.id],
  );

  if (loading || !role) return <RoleDetailSkeleton />;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push("/roles")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Roles
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{role.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-sm">{role.description || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Level</p>
            <p className="text-sm">{role.level}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Users</p>
            <p className="text-sm">{role.userCount}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">System Role</p>
            <Badge variant={role.isSystem ? "default" : "outline"}>
              {role.isSystem ? "System" : "Custom"}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Permissions ({role.permissions.length})</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {role.permissions.map((p) => (
                <Badge key={p} variant="outline" className="text-xs">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
