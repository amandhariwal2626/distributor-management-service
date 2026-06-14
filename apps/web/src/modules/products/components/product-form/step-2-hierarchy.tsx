"use client"

import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCategories, useSubCategories, useBrands, useManufacturers } from "@/hooks/use-master-data"

interface ComboboxFieldProps {
  name: string
  label: string
  options: { label: string; value: string }[]
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  onChange?: (value: string) => void
}

function ComboboxField({ name, label, options, placeholder = "Select...", disabled, loading, onChange }: ComboboxFieldProps) {
  const form = useFormContext()
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={disabled}
                  className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}
                >
                  {loading
                    ? "Loading..."
                    : field.value
                      ? options.find((o) => o.value === field.value)?.label
                      : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[260px] p-0">
              <Command>
                <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.value}
                        onSelect={() => {
                          form.setValue(name, opt.value)
                          onChange?.(opt.value)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            opt.value === field.value ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const skuTypes = [
  { value: "FINISHED_GOOD", label: "Finished Good" },
  { value: "RAW_MATERIAL", label: "Raw Material" },
  { value: "SERVICE", label: "Service" },
]

export function Step2Hierarchy() {
  const form = useFormContext()
  const categoryId = form.watch("categoryId")

  const { data: categories, isLoading: catLoading } = useCategories()
  const { data: subCategories, isLoading: subLoading } = useSubCategories(categoryId)
  const { data: brands, isLoading: brandLoading } = useBrands()
  const { data: manufacturers, isLoading: mfrLoading } = useManufacturers()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Product Hierarchy</h3>
        <p className="text-sm text-muted-foreground">Define product categorization and brand hierarchy</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ComboboxField
          name="categoryId"
          label="Category"
          options={categories ?? []}
          placeholder="Select category"
          loading={catLoading}
        />
        <ComboboxField
          name="subCategoryId"
          label="Sub Category"
          options={subCategories ?? []}
          placeholder="Select sub category"
          disabled={!categoryId}
          loading={subLoading}
        />
        <ComboboxField
          name="brandId"
          label="Brand"
          options={brands ?? []}
          placeholder="Select brand"
          loading={brandLoading}
        />
        <ComboboxField
          name="manufacturerId"
          label="Manufacturer"
          options={manufacturers ?? []}
          placeholder="Select manufacturer"
          loading={mfrLoading}
        />
        <FormField
          control={form.control}
          name="skuType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SKU type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {skuTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
