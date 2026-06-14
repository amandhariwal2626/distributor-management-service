"use client"

import { useState, useCallback } from "react"
import { Upload, FileText, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DocumentFile {
  id: string
  file: File
  documentType: string
  preview?: string
}

interface Step7DocumentsProps {
  value?: DocumentFile[]
  onChange?: (docs: DocumentFile[]) => void
}

const documentTypes = [
  { value: "PRODUCT_IMAGE", label: "Product Image" },
  { value: "LABEL", label: "Label" },
  { value: "SPECIFICATION_SHEET", label: "Specification Sheet" },
  { value: "SAFETY_DATA_SHEET", label: "Safety Data Sheet" },
  { value: "CERTIFICATION", label: "Certification" },
  { value: "OTHER", label: "Other" },
]

export function Step7Documents({ value = [], onChange }: Step7DocumentsProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      const newDocs = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        documentType: "PRODUCT_IMAGE",
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }))
      onChange?.([...value, ...newDocs])
    },
    [value, onChange],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const newDocs = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      documentType: "PRODUCT_IMAGE",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))
    onChange?.([...value, ...newDocs])
  }

  const removeDoc = (id: string) => {
    onChange?.(value.filter((d) => d.id !== id))
  }

  const updateDocType = (id: string, documentType: string) => {
    onChange?.(value.map((d) => (d.id === id ? { ...d, documentType } : d)))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Documents</h3>
        <p className="text-sm text-muted-foreground">Upload product documents and images</p>
      </div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">
          {isDragOver ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="mb-4 text-xs text-muted-foreground">or click to browse</p>
        <label>
          <Button type="button" variant="outline" size="sm" asChild>
            <span>Browse Files</span>
          </Button>
          <input
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            onChange={handleFileInput}
          />
        </label>
      </div>

      {value.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.file.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatSize(doc.file.size)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Select value={doc.documentType} onValueChange={(v) => updateDocType(doc.id, v)}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((dt) => (
                            <SelectItem key={dt.value} value={dt.value} className="text-xs">
                              {dt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {doc.preview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(doc.preview, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeDoc(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
