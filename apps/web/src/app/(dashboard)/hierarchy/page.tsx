"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/modules/rbac/components/guards/role-guard";
import { HierarchyTree } from "@/components/hierarchy/hierarchy-tree";
import { HierarchySkeleton } from "@/components/hierarchy/hierarchy-skeleton";
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

  return (
    <RoleGuard permission="hierarchy.view">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Hierarchy</h2>
        {loading ? <HierarchySkeleton /> : <HierarchyTree nodes={nodes} />}
      </div>
    </RoleGuard>
  );
}
