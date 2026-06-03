import { Skeleton } from "@/components/ui/skeleton";

export function HierarchySkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-72" />
      <div className="rounded-md border bg-card p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3" style={{ paddingLeft: `${i * 20}px` }}>
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
