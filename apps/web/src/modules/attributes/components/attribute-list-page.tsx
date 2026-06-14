"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import { useAttributes, useCreateAttribute } from "../hooks/use-attributes"
import type { Attribute } from "../api/attributes"

const typeStyles: Record<string, string> = {
  text: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  number: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  boolean: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  select: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
}

export function AttributeListPage() {
  const { data, isLoading, isError, refetch } = useAttributes()
  const createAttribute = useCreateAttribute()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<{ code: string; name: string; type: Attribute["type"] }>({ code: "", name: "", type: "text" })

  const columns: ColumnDef<Attribute>[] = [
    {
      header: "Code",
      accessorKey: "code",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.code}</span>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <Badge className={typeStyles[type]} variant="secondary">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        )
      },
    },
  ]

  function handleSubmit() {
    createAttribute.mutate(form, {
      onSuccess: () => {
        setOpen(false)
        setForm({ code: "", name: "", type: "text" })
      },
    })
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attribute Master"
        description="Manage product attribute definitions"
        actions={
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Create Attribute
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create Attribute</SheetTitle>
                <SheetDescription>
                  Add a new product attribute definition.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g. material"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Material"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm({ ...form, type: v as Attribute["type"] })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <Button onClick={handleSubmit} disabled={createAttribute.isPending}>
                  {createAttribute.isPending ? "Creating..." : "Create"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        searchPlaceholder="Search attributes..."
        emptyTitle="No attributes found"
        emptyDescription="Create your first attribute to get started."
        emptyAction={{
          label: "Create Attribute",
          onClick: () => setOpen(true),
        }}
      />
    </div>
  )
}
