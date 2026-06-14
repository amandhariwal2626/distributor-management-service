import { UploadCloud } from "lucide-react"
import { useCallback, useRef, useState, type DragEvent } from "react"
import { cn } from "@/lib/utils"

type Props = {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  hint?: string
  className?: string
}

export function Dropzone({ onFiles, accept, multiple, hint, className }: Props) {
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length) onFiles(multiple ? files : [files[0]])
  }, [onFiles, multiple])

  return (
    <div onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)}
      onDrop={handleDrop} onClick={() => inputRef.current?.click()}
      className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card/40 px-6 py-10 text-center transition-colors hover:bg-muted/40", drag && "border-foreground bg-muted/60", className)}>
      <div className="rounded-full bg-muted p-2 text-muted-foreground"><UploadCloud className="h-5 w-5" /></div>
      <div className="text-sm font-medium text-foreground">Drop files here, or <span className="underline underline-offset-2">browse</span></div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden"
        onChange={(e) => { const files = Array.from(e.target.files ?? []); if (files.length) onFiles(files); e.target.value = "" }} />
    </div>
  )
}
