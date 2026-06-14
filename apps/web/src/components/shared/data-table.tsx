"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type Row,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  Columns3,
  Search,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "./empty-state"
import { cn } from "@/lib/utils"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[] | undefined
  loading?: boolean
  searchKey?: string
  searchPlaceholder?: string
  pageSize?: number
  onRowClick?: (row: TData) => void
  onDeleteRows?: (rows: TData[]) => void
  toolbarActions?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: ReactNode
  emptyAction?: { label: string; onClick: () => void }
  enableSelection?: boolean
  bulkActions?: (selected: TData[]) => ReactNode
  rowKey?: (row: TData) => string
  enableGlobalFilter?: boolean
}

interface InnerProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  sorting: SortingState
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  rowSelection: RowSelectionState
  globalFilter: string
  onSortingChange: OnChangeFn<SortingState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
  onRowSelectionChange: OnChangeFn<RowSelectionState>
  onGlobalFilterChange: OnChangeFn<string>
  onRowClick?: (row: TData) => void
  onDeleteRows?: (rows: TData[]) => void
  bulkActions?: (selected: TData[]) => ReactNode
  rowKey?: (row: TData) => string
  pageSize: number
  allColumns: ColumnDef<TData>[]
  emptyTitle: string
  emptyDescription?: string
  emptyIcon?: ReactNode
  emptyAction?: { label: string; onClick: () => void }
  globalFilterValue: string
  onGlobalFilterClear: () => void
  enableGlobalFilter: boolean
  searchPlaceholder: string
  toolbarActions?: ReactNode
}

function DataTableInner<TData>({
  columns,
  data,
  sorting,
  columnFilters,
  columnVisibility,
  rowSelection,
  globalFilter,
  onSortingChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onRowSelectionChange,
  onGlobalFilterChange,
  onRowClick,
  onDeleteRows,
  bulkActions,
  rowKey,
  pageSize,
  allColumns,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyAction,
  globalFilterValue,
  onGlobalFilterClear,
  enableGlobalFilter,
  searchPlaceholder,
  toolbarActions,
}: InnerProps<TData>) {
  "use no memo"
  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange,
    onRowSelectionChange,
    onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: rowKey,
    initialState: { pagination: { pageSize } },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.map((r) => r.original)
  const hasSelectedRows = selectedRows.length > 0

  return (
    <>
      <div className="flex items-center gap-2">
        {enableGlobalFilter && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilterValue}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
              className="h-9 pl-8 pr-8"
            />
            {globalFilterValue && (
              <button onClick={onGlobalFilterClear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
        {onDeleteRows && hasSelectedRows && (
          <Button variant="destructive" size="sm" className="h-9" onClick={() => onDeleteRows(selectedRows)}>
            Delete ({selectedRows.length})
          </Button>
        )}
        {hasSelectedRows && bulkActions && (
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1">
            <span className="text-xs text-muted-foreground">{selectedRows.length} selected</span>
            {bulkActions(selectedRows)}
          </div>
        )}
        <div className="flex-1" />
        {toolbarActions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Columns3 className="mr-1.5 h-3.5 w-3.5" />View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {table.getAllLeafColumns().filter((c) => c.id !== "__select").map((col) => (
              <DropdownMenuCheckboxItem key={col.id} checked={col.getIsVisible()}
                onCheckedChange={(v) => col.toggleVisibility(!!v)} className="capitalize">
                {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="max-h-[640px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-border hover:bg-transparent">
                  {hg.headers.map((h) => {
                    const canSort = h.column.getCanSort()
                    const sorted = h.column.getIsSorted()
                    return (
                      <TableHead key={h.id} className="h-10 border-b border-border text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {h.isPlaceholder ? null : (
                          <button type="button" disabled={!canSort} onClick={h.column.getToggleSortingHandler()}
                            className={cn("flex items-center gap-1", canSort && "cursor-pointer hover:text-foreground")}>
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            {canSort ? (
                              sorted === "asc" ? <ChevronUp className="h-3 w-3" />
                              : sorted === "desc" ? <ChevronDown className="h-3 w-3" />
                              : <ChevronsUpDown className="h-3 w-3 opacity-50" />
                            ) : null}
                          </button>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn("border-border", onRowClick && "cursor-pointer hover:bg-muted/40")}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={allColumns.length} className="p-0">
                    <EmptyState title={emptyTitle} description={emptyDescription} icon={emptyIcon} action={emptyAction} className="border-0 bg-transparent py-12" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {data.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ({table.getFilteredRowModel().rows.length} total)
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Select value={String(table.getState().pagination.pageSize)} onValueChange={(v) => table.setPageSize(Number(v))}>
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((s) => (
                  <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export function DataTable<TData>({
  columns,
  data,
  loading,
  searchKey,
  searchPlaceholder = "Search...",
  pageSize = 10,
  onRowClick,
  onDeleteRows,
  toolbarActions,
  emptyTitle = "No results found.",
  emptyDescription,
  emptyIcon,
  emptyAction,
  enableSelection,
  bulkActions,
  rowKey,
  enableGlobalFilter = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  const allColumns = useMemo(
    () =>
      enableSelection
        ? [
            {
              id: "__select",
              size: 32,
              header: ({ table }: { table: { getIsAllPageRowsSelected: () => boolean; toggleAllPageRowsSelected: (v: boolean) => void } }) => (
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-foreground"
                  checked={table.getIsAllPageRowsSelected()}
                  onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)} />
              ),
              cell: ({ row }: { row: Row<TData> }) => (
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-foreground"
                  checked={row.getIsSelected()}
                  onChange={(e) => row.toggleSelected(!!e.target.checked)}
                  onClick={(e) => e.stopPropagation()} />
              ),
            } as ColumnDef<TData>,
            ...columns,
          ]
        : columns,
    [enableSelection, columns],
  )

  const safeData = useMemo(() => data ?? [], [data])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="max-h-[640px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow className="border-border hover:bg-transparent">
                  {allColumns.map((_c, i) => (
                    <TableHead key={i} className="h-10 border-b border-border"><Skeleton className="h-4 w-full max-w-[100px]" /></TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="border-border">
                    {allColumns.map((_c, j) => (
                      <TableCell key={j} className="py-3"><Skeleton className="h-4 w-full max-w-[120px]" /></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <DataTableInner
        columns={allColumns}
        data={safeData}
        sorting={sorting}
        columnFilters={columnFilters}
        columnVisibility={columnVisibility}
        rowSelection={rowSelection}
        globalFilter={globalFilter}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onColumnVisibilityChange={setColumnVisibility}
        onRowSelectionChange={setRowSelection}
        onGlobalFilterChange={setGlobalFilter}
        onRowClick={onRowClick}
        onDeleteRows={onDeleteRows}
        bulkActions={bulkActions}
        rowKey={rowKey}
        pageSize={pageSize}
        allColumns={allColumns}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        emptyIcon={emptyIcon}
        emptyAction={emptyAction}
        globalFilterValue={globalFilter}
        onGlobalFilterClear={() => setGlobalFilter("")}
        enableGlobalFilter={!!(enableGlobalFilter || searchKey)}
        searchPlaceholder={searchPlaceholder}
        toolbarActions={toolbarActions}
      />
    </div>
  )
}
