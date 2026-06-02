"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { Button } from "@/components/ui/button";
import { UserDetail } from "@/components/users/user-detail";
import { useRbacStore } from "@/store/rbac-store";
import type { User } from "@/types";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const getUser = useRbacStore((s) => s.getUser);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    getUser(params.id as string)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [getUser, params.id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!user) return <div className="p-8 text-center text-muted-foreground">User not found</div>;

  return (
    <RoleGuard permission="users.read">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/users")}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.push(`/users/${user.id}/edit`)}>
            Edit
          </Button>
        </div>
        <UserDetail
          user={user}
          onOpenManager={(id) => router.push(`/users/${id}`)}
          onOpenSubordinate={(id) => router.push(`/users/${id}`)}
        />
      </div>
    </RoleGuard>
  );
}
