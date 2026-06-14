"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateBrand, useUpdateBrand } from "../hooks/use-brands"
import type { Brand } from "../api/brands"

const brandSchema = z.object({
  code: z.string().min(1, "Brand code is required"),
  name: z.string().min(1, "Brand name is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
})

type BrandFormValues = z.infer<typeof brandSchema>

interface BrandCreateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brand?: Brand | null
}

export function BrandCreateSheet({ open, onOpenChange, brand }: BrandCreateSheetProps) {
  const isEditing = !!brand
  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand()

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      code: "",
      name: "",
      status: "ACTIVE",
    },
  })

  useEffect(() => {
    if (brand) {
      form.reset({
        code: brand.code,
        name: brand.name,
        status: brand.status,
      })
    } else {
      form.reset({
        code: "",
        name: "",
        status: "ACTIVE",
      })
    }
  }, [brand, form])

  const onSubmit = (values: BrandFormValues) => {
    if (isEditing) {
      updateBrand.mutate(
        { id: brand!.id, payload: values },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      createBrand.mutate(values, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  const isPending = createBrand.isPending || updateBrand.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Brand" : "Create Brand"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update the brand details below."
              : "Fill in the details to create a new brand."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 py-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BRND-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Premium Brands" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update" : "Create"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
