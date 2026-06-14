"use client"

import { useFormContext, Controller } from "react-hook-form"
import type { ProductFormValues } from "../../schemas"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useGeography } from "../../hooks/use-master-data"
import { useMemo, useState } from "react"
import type { GeographyNode } from "../../types"
import { ChevronDown, ChevronRight, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/shared/empty-state"

const STATUSES = [
  { value: "available", label: "Available" },
  { value: "restricted", label: "Restricted" },
  { value: "launch_pending", label: "Launch Pending" },
  { value: "blocked", label: "Blocked" },
]

export function Step5Geography() {
  const { control } = useFormContext<ProductFormValues>()
  const geoQ = useGeography()
  const [query, setQuery] = useState("")

  const tree = useMemo(() => filterTree(geoQ.data ?? [], query.toLowerCase()), [geoQ.data, query])

  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Geography</h2>
      <p className="text-sm text-muted-foreground">Define availability across regions.</p>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search regions…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
      </div>

      <Controller control={control} name="geographies" render={({ field }) => (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-md border border-border bg-card/40 p-2">
            {geoQ.isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
              </div>
            ) : tree.length === 0 ? (
              <EmptyState title="No regions found" className="border-0 bg-transparent py-8" />
            ) : (
              <Tree nodes={tree}
                selected={new Set((field.value ?? []).map((g) => g.geographyId))}
                onToggle={(id) => {
                  const current = field.value ?? []
                  const exists = current.some((g) => g.geographyId === id)
                  field.onChange(exists ? current.filter((g) => g.geographyId !== id) : [...current, { geographyId: id, status: "available" as const }])
                }} />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Selected ({field.value?.length ?? 0})</h3>
            {(field.value ?? []).length === 0 ? (
              <p className="rounded-md border border-dashed border-border bg-card/40 p-4 text-center text-xs text-muted-foreground">Pick regions on the left.</p>
            ) : (
              (field.value ?? []).map((g, idx) => (
                <div key={g.geographyId} className="rounded-md border border-border bg-card p-3">
                  <p className="text-sm font-medium">{findName(geoQ.data ?? [], g.geographyId) ?? g.geographyId}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Select value={g.status} onValueChange={(v) => {
                      const next = [...(field.value ?? [])]
                      next[idx] = { ...next[idx], status: v as "available" | "restricted" | "launch_pending" | "blocked" }
                      field.onChange(next)
                    }}>
                      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input type="date" value={g.launchDate ?? ""} onChange={(e) => {
                      const next = [...(field.value ?? [])]
                      next[idx] = { ...next[idx], launchDate: e.target.value }
                      field.onChange(next)
                    }} className="h-8" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )} />
    </Card>
  )
}

function filterTree(nodes: GeographyNode[], q: string): GeographyNode[] {
  if (!q) return nodes
  const walk = (ns: GeographyNode[]): GeographyNode[] =>
    ns.map<GeographyNode | null>((n) => {
      const children = walk(n.children ?? [])
      if (n.name.toLowerCase().includes(q) || children.length) return { ...n, children }
      return null
    }).filter((x): x is GeographyNode => x !== null)
  return walk(nodes)
}

function findName(nodes: GeographyNode[], id: string): string | undefined {
  for (const n of nodes) {
    if (n.id === id) return n.name
    if (n.children) { const r = findName(n.children, id); if (r) return r }
  }
  return undefined
}

function Tree({ nodes, selected, onToggle, depth = 0 }: { nodes: GeographyNode[]; selected: Set<string>; onToggle: (id: string) => void; depth?: number }) {
  return <ul className="space-y-0.5">{nodes.map((n) => <TreeNode key={n.id} node={n} selected={selected} onToggle={onToggle} depth={depth} />)}</ul>
}

function TreeNode({ node, selected, onToggle, depth }: { node: GeographyNode; selected: Set<string>; onToggle: (id: string) => void; depth: number }) {
  const [open, setOpen] = useState(depth < 1)
  const hasChildren = (node.children?.length ?? 0) > 0
  return (
    <li>
      <div className="flex items-center gap-1 rounded px-1 py-1 hover:bg-muted/60" style={{ paddingLeft: depth * 14 + 4 }}>
        {hasChildren ? (
          <button type="button" onClick={() => setOpen((o) => !o)} className="text-muted-foreground">
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        ) : <span className="w-3.5" />}
        <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-foreground"
            checked={selected.has(node.id)} onChange={() => onToggle(node.id)} />
          <span>{node.name}</span>
        </label>
      </div>
      {hasChildren && open ? <Tree nodes={node.children ?? []} selected={selected} onToggle={onToggle} depth={depth + 1} /> : null}
    </li>
  )
}
