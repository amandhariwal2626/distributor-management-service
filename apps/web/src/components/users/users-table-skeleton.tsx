import { Skeleton } from "@/components/ui/skeleton";

export function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-48" />
        <div className="ml-auto">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
      <div className="rounded-md border bg-card">
        <div className="p-4">
          <div className="grid grid-cols-10 gap-4 mb-4">
            <Skeleton className="h-4 col-span-2" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-2" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-10 gap-4 py-3 border-t">
              <div className="col-span-2 flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 col-span-1" />
              <Skeleton className="h-4 col-span-1" />
              <Skeleton className="h-4 col-span-2" />
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
