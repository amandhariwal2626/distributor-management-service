"use client";

import { useRouter } from "next/navigation";
import { Copy, Save } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  roleName: string;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onClone: () => void;
}

export function EditRoleHeader({ roleName, isDirty, isSaving, onSave, onClone }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Role: <span className="text-primary">{roleName}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure role name, description, and permission assignments.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onClone}>
            <Copy className="mr-1.5 h-4 w-4" />
            Clone Role
          </Button>
          <Button size="sm" onClick={onSave} disabled={!isDirty || isSaving}>
            <Save className="mr-1.5 h-4 w-4" />
            {isSaving ? "Saving\u2026" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
