"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
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
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { ErrorState } from "@/components/shared/error-state"
import { useCategories, useCreateCategory } from "../hooks/use-categories"
import type { Category } from "../api/categories"

export function CategoryListPage() {
  const { data, isLoading, isError, refetch } = useCategories()
  const createCategory = useCreateCategory()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [form, setForm] = useState({ code: "", name: "", parentId: "" })

  const columns: ColumnDef<Category>[] = [
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
      header: "Parent",
      accessorKey: "parentName",
      cell: ({ row }) => row.original.parentName ?? "-",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: Partial<Category> = {
      code: form.code,
      name: form.name,
      parentId: form.parentId || null,
    }
    await createCategory.mutateAsync(payload)
    setSheetOpen(false)
    setForm({ code: "", name: "", parentId: "" })
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Master"
        description="Manage product categories"
        actions={
          <Button onClick={() => setSheetOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Create Category
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        searchKey="name"
        searchPlaceholder="Search categories..."
        emptyTitle="No categories found"
        emptyDescription="Create your first category to get started."
        emptyAction={{
          label: "Create Category",
          onClick: () => setSheetOpen(true),
        }}
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Create Category</SheetTitle>
            <SheetDescription>
              Add a new product category to the master list.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g. BEV-001"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Beverages"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select
                value={form.parentId}
                onValueChange={(v) => setForm({ ...form, parentId: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  {data?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending ? "Creating..." : "Create"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
