"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { Button } from "@/components/ui/button";
import { InviteUserDialog } from "@/modules/rbac/components/rbac/invite-user-dialog";
import { useRbacStore } from "@/modules/rbac/stores/rbac.store";
import { useEffect, useState } from "react";

export default function CreateUserPage() {
  const router = useRouter();
  const loadRoles = useRbacStore((s) => s.loadRoles);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  return (
    <RoleGuard permission="users.create">
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to users
        </Button>
        <InviteUserDialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) router.push("/users");
          }}
        />
      </div>
    </RoleGuard>
  );
}
