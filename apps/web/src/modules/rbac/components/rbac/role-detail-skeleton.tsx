import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RoleDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-28" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
          <div>
            <Skeleton className="h-3 w-28 mb-2" />
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
