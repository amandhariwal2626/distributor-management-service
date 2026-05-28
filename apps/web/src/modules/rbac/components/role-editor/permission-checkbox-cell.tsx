"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Props {
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}

export function PermissionCheckboxCell({ checked, disabled, onToggle, label, className }: Props) {
  return (
    <td className={cn("text-center p-0", className)}>
      <div className="flex items-center justify-center h-full min-h-[36px]">
        <Checkbox
          checked={checked}
          disabled={disabled}
          onCheckedChange={onToggle}
          aria-label={label}
          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </div>
    </td>
  );
}
