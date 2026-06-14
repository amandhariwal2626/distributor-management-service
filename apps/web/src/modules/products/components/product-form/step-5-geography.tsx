"use client"

import { Info } from "lucide-react"

export function Step5Geography() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Geography</h3>
        <p className="text-sm text-muted-foreground">Geographic availability configuration</p>
      </div>
      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-6">
        <Info className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Geography mapping is not available in this version.
        </p>
      </div>
    </div>
  )
}
