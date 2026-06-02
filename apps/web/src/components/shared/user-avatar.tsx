import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("h-9 w-9", className)}>
      <AvatarFallback className="bg-primary/10 text-primary font-medium">
        {initials(name) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
