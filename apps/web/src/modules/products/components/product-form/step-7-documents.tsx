"use client"

import { useFormContext } from "react-hook-form"
import type { ProductFormValues } from "../../schemas"
import { Card } from "@/components/ui/card"
import { Dropzone } from "@/components/shared/dropzone"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileText, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

export function Step7Documents() {
  const { setValue, watch } = useFormContext<ProductFormValues>()
  const docs = watch("documents") ?? []

  return (
    <Card className="p-6">
      <h2 className="text-base font-semibold">Documents</h2>
      <p className="text-sm text-muted-foreground">Attach product images, specs, and certificates.</p>

      <div className="mt-4">
        <Dropzone multiple hint="Images, PDFs, or spec sheets" onFiles={(files) => {
          const next = [...docs, ...files.map((f) => ({
            id: crypto.randomUUID(),
            name: f.name,
            type: f.type || "file",
            version: "1.0",
            url: URL.createObjectURL(f),
            uploadedAt: new Date().toISOString(),
          }))]
          setValue("documents", next, { shouldDirty: true })
        }} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {docs.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState title="No documents uploaded" description="Drop files above to attach them to this product." />
          </div>
        ) : (
          docs.map((d, idx) => (
            <div key={d.id} className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
              <div className="rounded-md bg-muted p-2 text-muted-foreground"><FileText className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.type} · v{d.version} · {new Date(d.uploadedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-1">
                {d.url ? (
                  <>
                    <Button asChild size="icon" variant="ghost" className="h-7 w-7"><a href={d.url} target="_blank" rel="noreferrer"><Eye className="h-3.5 w-3.5" /></a></Button>
                    <Button asChild size="icon" variant="ghost" className="h-7 w-7"><a href={d.url} download><Download className="h-3.5 w-3.5" /></a></Button>
                  </>
                ) : null}
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setValue("documents", docs.filter((_, i) => i !== idx), { shouldDirty: true })}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
