"use client";

import { useState } from "react";
import {
  Activity,
  ArrowRight,
  User,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const auditEntries = [
  {
    id: 1,
    action: "Product Created",
    entity: "Mango Juice 1L",
    field: null,
    oldValue: null,
    newValue: "Product created with code PRD-043",
    user: "Rahul Sharma",
    date: "2026-06-05T10:30:00",
  },
  {
    id: 2,
    action: "Price Updated",
    entity: "Classic Cola 250ml",
    field: "MRP",
    oldValue: "₹20.00",
    newValue: "₹22.00",
    user: "Priya Mehta",
    date: "2026-06-04T14:15:00",
  },
  {
    id: 3,
    action: "Product Updated",
    entity: "Wheat Biscuits 200g",
    field: "packSize",
    oldValue: "10",
    newValue: "12",
    user: "Amit Kumar",
    date: "2026-06-03T09:45:00",
  },
  {
    id: 4,
    action: "Price Created",
    entity: "Wheat Biscuits 200g",
    field: null,
    oldValue: null,
    newValue: "Price set at MRP ₹32, PTR ₹30, PTS ₹28",
    user: "Amit Kumar",
    date: "2026-06-02T16:20:00",
  },
  {
    id: 5,
    action: "Bulk Upload",
    entity: "Products",
    field: null,
    oldValue: null,
    newValue: "15 products uploaded via products_june.xlsx",
    user: "System",
    date: "2026-06-01T11:00:00",
  },
];

function DiffView({
  oldValue,
  newValue,
}: {
  oldValue?: string | null;
  newValue?: string | null;
}) {
  if (!oldValue && !newValue) return null;
  return (
    <div className="mt-3 rounded-lg border bg-muted/30 p-3">
      {oldValue && newValue ? (
        <div className="flex items-center gap-3 text-sm">
          <div className="flex-1 rounded bg-red-50 p-2 text-red-700 line-through dark:bg-red-950/30 dark:text-red-400">
            {oldValue}
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 rounded bg-green-50 p-2 text-green-700 dark:bg-green-950/30 dark:text-green-400">
            {newValue}
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          {newValue ?? oldValue}
        </div>
      )}
    </div>
  );
}

export function AuditPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Track all changes made across the system"
      />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search audit entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue="">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-modules">All Modules</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-users">All Users</SelectItem>
            <SelectItem value="rahul">Rahul Sharma</SelectItem>
            <SelectItem value="priya">Priya Mehta</SelectItem>
            <SelectItem value="amit">Amit Kumar</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-1 h-full w-px bg-border" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">
                          {entry.action}
                        </span>
                        <span className="mx-2 text-sm text-muted-foreground">
                          on
                        </span>
                        <span className="text-sm font-medium">
                          {entry.entity}
                        </span>
                        {entry.field && (
                          <>
                            <span className="mx-2 text-sm text-muted-foreground">
                              (field:
                            </span>
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                              {entry.field}
                            </code>
                            <span className="text-sm text-muted-foreground">
                              )
                            </span>
                          </>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {entry.action === "Bulk Upload"
                          ? "UPLOAD"
                          : entry.action.includes("Product")
                            ? "PRODUCT"
                            : "PRICE"}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{entry.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(entry.date).toLocaleString()}</span>
                      </div>
                    </div>
                    <DiffView
                      oldValue={entry.oldValue}
                      newValue={entry.newValue}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
