"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { RoleForm, type RoleFormValues } from "@/modules/rbac/components/rbac/role-form";
import { useRbacStore } from "@/modules/rbac/stores/rbac.store";

export default function NewRolePage() {
  const router = useRouter();
  const createRole = useRbacStore((s) => s.createRole);

  async function handleSubmit(values: RoleFormValues): Promise<void> {
    const role = await createRole({
      name: values.name,
      description: values.description,
      permissions: values.permissions,
    });
    toast.success(`Created \u201c${values.name}\u201d`);
    router.push(`/roles/${role.id}`);
  }

  return (
    <RoleGuard permission="roles.create">
      <div className="max-w-2xl space-y-6">
        <h2 className="text-xl font-semibold">Create role</h2>
        <RoleForm submitLabel="Create role" onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </RoleGuard>
  );
}
