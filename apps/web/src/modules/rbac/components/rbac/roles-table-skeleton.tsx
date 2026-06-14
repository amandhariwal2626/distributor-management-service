import { Skeleton } from "@/components/ui/skeleton";

export function RolesTableSkeleton() {
  return (
    <div className="rounded-md border bg-card">
      <div className="p-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Skeleton className="h-4 col-span-1" />
          <Skeleton className="h-4 col-span-1" />
          <Skeleton className="h-4 col-span-1" />
          <Skeleton className="h-4 col-span-1" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 py-3 border-t">
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
            <Skeleton className="h-4 col-span-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
