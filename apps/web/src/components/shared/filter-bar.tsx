"use client"

import { useState, useCallback } from "react"
import { Search, X, Filter, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FilterOption {
  key: string
  label: string
  type: "text" | "select"
  placeholder?: string
  options?: { label: string; value: string }[]
}

interface ActiveChip {
  key: string
  label: string
  value: string
}

interface FilterBarProps {
  options: FilterOption[]
  onFiltersChange?: (filters: Record<string, string>) => void
  className?: string
}

export function FilterBar({ options, onFiltersChange, className }: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveChip[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addFilter = useCallback(
    (key: string, value: string) => {
      const opt = options.find((o) => o.key === key)
      if (!opt) return
      setActiveFilters((prev) => {
        const filtered = prev.filter((f) => f.key !== key)
        const next = [...filtered, { key, label: opt.label, value }]
        const record: Record<string, string> = {}
        next.forEach((f) => {
          record[f.key] = f.value
        })
        onFiltersChange?.(record)
        return next
      })
    },
    [options, onFiltersChange],
  )

  const removeFilter = useCallback(
    (key: string) => {
      setActiveFilters((prev) => {
        const next = prev.filter((f) => f.key !== key)
        const record: Record<string, string> = {}
        next.forEach((f) => {
          record[f.key] = f.value
        })
        onFiltersChange?.(record)
        return next
      })
    },
    [onFiltersChange],
  )

  const clearAll = useCallback(() => {
    setActiveFilters([])
    onFiltersChange?.({})
  }, [onFiltersChange])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
            Clear all
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="flex flex-wrap gap-3 rounded-lg border bg-muted/30 p-4">
          {options.map((opt) => (
            <div key={opt.key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{opt.label}</label>
              {opt.type === "text" ? (
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={opt.placeholder}
                    className="h-9 w-48 pl-8 text-sm"
                    value={activeFilters.find((f) => f.key === opt.key)?.value ?? ""}
                    onChange={(e) => {
                      if (e.target.value) addFilter(opt.key, e.target.value)
                      else removeFilter(opt.key)
                    }}
                  />
                </div>
              ) : (
                <Select
                  value={activeFilters.find((f) => f.key === opt.key)?.value ?? ""}
                  onValueChange={(v) => addFilter(opt.key, v)}
                >
                  <SelectTrigger className="h-9 w-48 text-sm">
                    <SelectValue placeholder={opt.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {opt.options?.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((chip) => (
            <Badge key={chip.key} variant="secondary" className="gap-1 px-3 py-1">
              <span className="text-xs font-medium">{chip.label}:</span>
              <span className="text-xs">{chip.value}</span>
              <button onClick={() => removeFilter(chip.key)} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
