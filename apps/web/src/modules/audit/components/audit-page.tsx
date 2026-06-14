"use client"

import { useState } from "react"
import { History, User, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/shared/page-header"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { useAudit } from "../hooks/use-audit"
import type { AuditEntry } from "../api/audit"

function AuditDiff({ entry }: { entry: AuditEntry }) {
  if (!entry.changes?.length) return null

  return (
    <div className="mt-3 space-y-2">
      {entry.changes.map((change, i) => (
        <div key={i} className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-1 text-xs font-medium text-muted-foreground">
            {change.field}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-1 rounded bg-red-50 p-2 text-red-700 line-through dark:bg-red-950/30 dark:text-red-400">
              {String(change.oldValue ?? "")}
            </div>
            <span className="text-muted-foreground">&rarr;</span>
            <div className="flex-1 rounded bg-green-50 p-2 text-green-700 dark:bg-green-950/30 dark:text-green-400">
              {String(change.newValue ?? "")}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AuditTimelineItem({ entry }: { entry: AuditEntry }) {
  return (
    <li className="relative pb-8 last:pb-0">
      <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full border-2 border-primary bg-background" />
      </div>
      <div className="ml-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-sm font-medium">{entry.user}</span>
                <span className="mx-1.5 text-sm text-muted-foreground">
                  {entry.action}
                </span>
                {entry.entityName && (
                  <span className="text-sm font-medium">
                    {entry.entityName}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{entry.user}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            </div>
            <AuditDiff entry={entry} />
          </CardContent>
        </Card>
      </div>
    </li>
  )
}

function AuditTimelineSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3 rounded-xl border p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AuditPage() {
  const [search, setSearch] = useState("")
  const [moduleFilter, setModuleFilter] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const filters: Record<string, string> = {}
  if (search) filters.user = search
  if (moduleFilter) filters.module = moduleFilter
  if (fromDate) filters.from = fromDate
  if (toDate) filters.to = toDate

  const { data: entries, isLoading, isError, refetch } = useAudit(
    Object.keys(filters).length ? filters : undefined,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail"
        description="Track all changes across the system"
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-modules">All Modules</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Price">Price</SelectItem>
            <SelectItem value="Master">Master</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-40"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-40"
          />
        </div>
        {(search || moduleFilter || fromDate || toDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("")
              setModuleFilter("")
              setFromDate("")
              setToDate("")
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <AuditTimelineSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !entries?.length ? (
        <EmptyState
          icon={<History className="h-12 w-12" />}
          title="No audit entries found"
          description="No changes have been recorded for the selected filters."
        />
      ) : (
        <ol className="border-l border-border pl-4">
          {entries.map((entry) => (
            <AuditTimelineItem key={entry.id} entry={entry} />
          ))}
        </ol>
      )}
    </div>
  )
}
