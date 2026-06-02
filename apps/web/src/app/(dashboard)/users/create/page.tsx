"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/users/user-form";
import { useRbacStore } from "@/store/rbac-store";
import type { CreateUserPayload } from "@/types";

export default function CreateUserPage() {
  const router = useRouter();
  const createUser = useRbacStore((s) => s.createUser);

  async function handleSubmit(payload: CreateUserPayload) {
    const user = await createUser(payload);
    router.push(`/users/${user.id}`);
  }

  return (
    <RoleGuard permission="users.create">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to users
        </Button>
        <UserForm mode="create" onSubmit={handleSubmit} onCancel={() => router.push("/users")} />
      </div>
    </RoleGuard>
  );
}
