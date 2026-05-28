"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useRbacStore } from "../../stores/rbac.store";
import type { User } from "../../types";
import { MultiSelect } from "./multi-select";

interface Props {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignRolesDialog({ user, open, onOpenChange }: Props) {
  const roles = useRbacStore((s) => s.roles);
  const assignRoles = useRbacStore((s) => s.assignRoles);
  const [selected, setSelected] = useState<string[]>([]);

  if (!user) return null;

  return (
    <Dialog key={user.id} open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage roles for {user.name}</DialogTitle>
          <DialogDescription>
            Effective permissions are the union of all assigned roles.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Roles</Label>
          <MultiSelect
            options={roles.map((r) => ({ value: r.id, label: r.name, hint: r.description }))}
            value={selected}
            onChange={setSelected}
            placeholder="No roles assigned"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              assignRoles(user.id, selected);
              toast.success(`Updated roles for ${user.name}`);
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
