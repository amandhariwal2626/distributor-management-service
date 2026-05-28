"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ShieldCheck, Users } from "lucide-react";
import type { RoleEditorData } from "./types";

interface Props {
  role: RoleEditorData;
}

export function GeneralTab({ role }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={role.isSystem ? "secondary" : "default"}>
            {role.isSystem ? "System Role" : "Custom Role"}
          </Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{role.userCount}</p>
          <p className="text-xs text-muted-foreground">
            user{role.userCount !== 1 ? "s" : ""} assigned
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Created
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">
            {role.createdAt
              ? new Date(role.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
