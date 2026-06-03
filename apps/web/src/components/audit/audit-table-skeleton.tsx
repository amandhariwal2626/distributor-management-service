import { Skeleton } from "@/components/ui/skeleton";

export function AuditTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>
      <div className="rounded-md border bg-card">
        <div className="p-4">
          <div className="grid grid-cols-6 gap-4 mb-4">
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 py-3 border-t">
              <Skeleton className="h-4 col-span-1" />
              <Skeleton className="h-4 col-span-1" />
              <Skeleton className="h-4 col-span-1" />
              <Skeleton className="h-4 col-span-1" />
              <Skeleton className="h-4 col-span-1" />
              <Skeleton className="h-4 col-span-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
