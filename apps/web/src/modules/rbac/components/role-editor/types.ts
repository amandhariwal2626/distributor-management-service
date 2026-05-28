import type { PermissionId } from "../../types";

export interface RoleEditorData {
  id: string;
  name: string;
  description: string;
  permissions: PermissionId[];
  isSystem: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoleFormValues {
  name: string;
  description: string;
  permissions: PermissionId[];
}
