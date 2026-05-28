"use client";

import { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { PERMISSION_CATALOG } from "../../data/permissions";
import type { PermissionId, User } from "../../types";

interface Props {
  user: User | null;
  permissions: PermissionId[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EffectivePermissionsSheet({ user, permissions, open, onOpenChange }: Props) {
  const set = useMemo(() => new Set(permissions), [permissions]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Effective permissions</SheetTitle>
          <SheetDescription>
            {user ? (
              <>Computed from every role assigned to <strong>{user.name}</strong>.</>
            ) : null}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex-1 min-h-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {PERMISSION_CATALOG.map((group) => {
                const granted = group.permissions.filter((p) => set.has(p.id));
                if (granted.length === 0) return null;
                return (
                  <div key={group.key}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">{group.label}</div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {granted.length}/{group.permissions.length}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {granted.map((p) => (
                        <Badge key={p.id} variant="outline" className="font-mono text-xs">
                          {p.id}
                        </Badge>
                      ))}
                    </div>
                    <Separator className="mt-3" />
                  </div>
                );
              })}
              {permissions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  This user has no effective permissions.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
