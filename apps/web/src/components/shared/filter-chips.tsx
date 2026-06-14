import { X } from "lucide-react"

export type Chip = { key: string; label: string; value: string }

export function FilterChips({ chips, onRemove, onClear }: { chips: Chip[]; onRemove: (key: string) => void; onClear?: () => void }) {
  if (chips.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((c) => (
        <span key={c.key} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-xs text-foreground">
          <span className="text-muted-foreground">{c.label}:</span> {c.value}
          <button type="button" onClick={() => onRemove(c.key)} className="ml-0.5 text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {onClear ? (
        <button type="button" onClick={onClear} className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
          Clear all
        </button>
      ) : null}
    </div>
  )
}
