"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { HierarchyTree } from "@/components/hierarchy/hierarchy-tree";
import { useRbacStore } from "@/store/rbac-store";
import type { TreeNode as TreeNodeType } from "@/types";

export default function HierarchyPage() {
  const getHierarchyTree = useRbacStore((s) => s.getHierarchyTree);
  const [nodes, setNodes] = useState<TreeNodeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHierarchyTree()
      .then(setNodes)
      .finally(() => setLoading(false));
  }, [getHierarchyTree]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <RoleGuard permission="hierarchy.view">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Hierarchy</h2>
        <HierarchyTree nodes={nodes} />
      </div>
    </RoleGuard>
  );
}
