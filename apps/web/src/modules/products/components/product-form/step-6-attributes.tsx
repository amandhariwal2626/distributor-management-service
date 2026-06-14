"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, Check } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { apiGet } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useAttributeDefinitions } from "@/hooks/use-master-data"

interface AttributeRow {
  id: string
  attributeDefId: string
  attribute: string
  type: string
  value: string
}

interface Step6AttributesProps {
  value?: AttributeRow[]
  onChange?: (attrs: AttributeRow[]) => void
}

interface AttributeDefDetail {
  id: string
  attributeName: string
  dataType: string
}

interface AttributeDefResponse {
  items: AttributeDefDetail[]
  meta: Record<string, unknown>
}

export function Step6Attributes({ value = [], onChange }: Step6AttributesProps) {
  const [openRow, setOpenRow] = useState<string | null>(null)
  const { data: defs, isLoading } = useAttributeDefinitions()

  const { data: rawDefs } = useQuery<AttributeDefResponse>({
    queryKey: ["master-data", "attribute-definitions-raw"],
    queryFn: () => apiGet<AttributeDefResponse>("/attributes/definitions"),
    staleTime: 5 * 60 * 1000,
  })

  const addRow = () => {
    const newRow: AttributeRow = {
      id: crypto.randomUUID(),
      attributeDefId: "",
      attribute: "",
      type: "Text",
      value: "",
    }
    onChange?.([...value, newRow])
    setOpenRow(newRow.id)
  }

  const removeRow = (id: string) => {
    onChange?.(value.filter((r) => r.id !== id))
  }

  const selectDefinition = (rowId: string, defId: string) => {
    const def = rawDefs?.items?.find((d) => d.id === defId)
    onChange?.(value.map((r) =>
      r.id === rowId
        ? {
            ...r,
            attributeDefId: defId,
            attribute: def?.attributeName ?? "",
            type: def?.dataType ?? "Text",
            value: "",
          }
        : r,
    ))
    setOpenRow(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Attributes</h3>
        <p className="text-sm text-muted-foreground">Add custom attributes and specifications</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Attribute</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {value.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No attributes added yet. Click &quot;Add Attribute&quot; to begin.
                </TableCell>
              </TableRow>
            ) : (
              value.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <Popover
                      open={openRow === row.id}
                      onOpenChange={(open) => setOpenRow(open ? row.id : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="h-9 w-full justify-between font-normal"
                        >
                          {row.attribute || (isLoading ? "Loading..." : "Select attribute...")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full min-w-[220px] p-0">
                        <Command>
                          <CommandInput placeholder="Search attributes..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              {(defs ?? []).map((def) => (
                                <CommandItem
                                  key={def.value}
                                  value={def.value}
                                  onSelect={() => selectDefinition(row.id, def.value)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      def.value === row.attributeDefId ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {def.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.type}
                      onValueChange={(v) => {
                        onChange?.(value.map((r) =>
                          r.id === row.id ? { ...r, type: v } : r,
                        ))
                      }}
                    >
                      <SelectTrigger className="h-9 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Text", "Number", "Boolean", "Date", "Dropdown"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => {
                        onChange?.(value.map((r) =>
                          r.id === row.id ? { ...r, value: e.target.value } : r,
                        ))
                      }}
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(row.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addRow}>
        <Plus className="mr-2 h-4 w-4" />
        Add Attribute
      </Button>
    </div>
  )
}
