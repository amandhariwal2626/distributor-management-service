import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { TreeNode } from "@/components/hierarchy/tree-node";
import type { TreeNode as TreeNodeType } from "@/types";

interface HierarchyTreeProps {
  nodes: TreeNodeType[];
  onSelect?: (node: TreeNodeType) => void;
}

function collectAllIds(nodes: TreeNodeType[], acc: Set<string> = new Set()): Set<string> {
  for (const n of nodes) {
    acc.add(n.id);
    if (n.children?.length) collectAllIds(n.children, acc);
  }
  return acc;
}

function findMatches(nodes: TreeNodeType[], query: string): Set<string> | null {
  if (!query) return null;
  const q = query.toLowerCase();
  const result = new Set<string>();

  function visit(node: TreeNodeType, ancestors: string[]): boolean {
    const matches =
      node.profile.fullName.toLowerCase().includes(q) ||
      node.email.toLowerCase().includes(q);
    let childMatched = false;
    for (const child of node.children ?? []) {
      if (visit(child, [...ancestors, node.id])) childMatched = true;
    }
    if (matches || childMatched) {
      result.add(node.id);
      ancestors.forEach((a) => result.add(a));
      return true;
    }
    return false;
  }

  nodes.forEach((n) => visit(n, []));
  return result;
}

export function HierarchyTree({ nodes, onSelect }: HierarchyTreeProps) {
  const [query, setQuery] = useState("");
  const [userExpanded, setUserExpanded] = useState<Set<string> | null>(null);

  const allIds = useMemo(() => collectAllIds(nodes), [nodes]);
  const matched = useMemo(() => findMatches(nodes, query), [nodes, query]);

  const expandedIds = useMemo(() => {
    if (userExpanded) return userExpanded;
    if (matched) return new Set(matched);
    return allIds;
  }, [userExpanded, matched, allIds]);

  function toggle(id: string) {
    setUserExpanded((prev) => {
      const base = prev ?? allIds;
      const next = new Set(base);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border bg-card p-2">
        {nodes.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No hierarchy data
          </p>
        ) : (
          nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              expandedIds={expandedIds}
              onToggle={toggle}
              matchedIds={matched}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
