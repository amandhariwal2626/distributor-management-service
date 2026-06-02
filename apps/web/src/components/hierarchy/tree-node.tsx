import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoleBadge } from "@/components/shared/role-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { TreeNode as TreeNodeType } from "@/types";

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  matchedIds?: Set<string> | null;
  onSelect?: (node: TreeNodeType) => void;
}

export function TreeNode({
  node,
  depth,
  expandedIds,
  onToggle,
  matchedIds,
  onSelect,
}: TreeNodeProps) {
  const expanded = expandedIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const dimmed = matchedIds && !matchedIds.has(node.id);

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent",
          dimmed && "opacity-40",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <button
          onClick={() => hasChildren && onToggle(node.id)}
          className="flex h-5 w-5 items-center justify-center text-muted-foreground"
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          )}
        </button>
        <UserAvatar name={node.profile.fullName} className="h-7 w-7" />
        <button onClick={() => onSelect?.(node)} className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{node.profile.fullName}</span>
            <span className="text-xs text-muted-foreground">{node.email}</span>
          </div>
        </button>
        <div className="flex items-center gap-1">
          {node.roles[0] && <RoleBadge name={node.roles[0].role.name} />}
          <StatusBadge status={node.status} />
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              matchedIds={matchedIds}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
