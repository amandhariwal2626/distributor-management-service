import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/types";

const styles: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
  INACTIVE: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  LOCKED: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  SUSPENDED: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function StatusBadge({ status, className }: { status: UserStatus; className?: string }) {
  return (
    <Badge variant="secondary" className={cn(styles[status], "font-medium", className)}>
      {status}
    </Badge>
  );
}
