import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RoleBadge({ name, className }: { name: string; className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-primary/30 bg-primary/5 font-medium text-primary", className)}
    >
      {name}
    </Badge>
  );
}
