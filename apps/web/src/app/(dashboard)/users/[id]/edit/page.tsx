"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/users/user-form";
import { UserFormSkeleton } from "@/components/users/user-form-skeleton";
import { useRbacStore } from "@/store/rbac-store";
import type { CreateUserPayload, User } from "@/types";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { getUser, updateUser } = useRbacStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    getUser(params.id as string)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [getUser, params.id]);

  async function handleSubmit(payload: CreateUserPayload) {
    await updateUser(params.id as string, payload);
    router.push(`/users/${params.id}`);
  }

  if (loading) return (
    <div className="space-y-4">
      <UserFormSkeleton />
    </div>
  );
  if (!user) return <div className="p-8 text-center text-muted-foreground">User not found</div>;

  return (
    <RoleGuard permission="users.update">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/users/${params.id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <UserForm
          initial={user}
          mode="edit"
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/users/${params.id}`)}
        />
      </div>
    </RoleGuard>
  );
}
