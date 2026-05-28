"use client";

import { useCallback, useEffect, useState } from "react";
import SidebarWrapper from "@/components/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { rolesService, type RoleItem } from "@/services/roles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type PermissionInfo = { code: string; name: string };

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionInfo[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPerms, setEditPerms] = useState<string[]>([]);

  const load = useCallback(() => {
    rolesService.list().then(setRoles);
    rolesService.listPermissions().then(setPermissions);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await rolesService.create({ name: name.trim(), description: description.trim() || undefined, permissions: selectedPerms });
    setName("");
    setDescription("");
    setSelectedPerms([]);
    load();
  };

  const handleEdit = (role: RoleItem) => {
    setEditingRole(role.id);
    setEditName(role.name);
    setEditDesc(role.description || "");
    setEditPerms(role.permissions.map((p) => p.permission.code));
  };

  const handleSaveEdit = async () => {
    if (!editingRole || !editName.trim()) return;
    await rolesService.update(editingRole, { name: editName.trim(), description: editDesc.trim() || undefined, permissions: editPerms });
    setEditingRole(null);
    load();
  };

  const togglePermission = (code: string, current: string[], setter: (v: string[]) => void) => {
    setter(current.includes(code) ? current.filter((c) => c !== code) : [...current, code]);
  };

  return (
    <ProtectedRoute>
      <SidebarWrapper>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Role</h2>
            <div className="flex flex-wrap gap-2 items-end max-w-xl mb-3">
              <div className="flex-1 min-w-40">
                <Label htmlFor="role-name">Name</Label>
                <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Role name" />
              </div>
              <div className="flex-1 min-w-40">
                <Label htmlFor="role-desc">Description</Label>
                <Input id="role-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
              </div>
              <Button onClick={handleCreate} disabled={!name.trim()}>Create</Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {permissions.map((p) => (
                <Badge
                  key={p.code}
                  variant={selectedPerms.includes(p.code) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => togglePermission(p.code, selectedPerms, setSelectedPerms)}
                >
                  {p.code}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Roles & Permissions</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    {editingRole === role.id ? (
                      <>
                        <TableCell>
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="min-w-28" />
                        </TableCell>
                        <TableCell>
                          <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description" />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {permissions.map((p) => (
                              <Badge
                                key={p.code}
                                variant={editPerms.includes(p.code) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => togglePermission(p.code, editPerms, setEditPerms)}
                              >
                                {p.code}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" onClick={handleSaveEdit} disabled={!editName.trim()}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingRole(null)}>Cancel</Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {role.permissions.map((p) => (
                              <Badge key={p.permission.code} variant="outline">{p.permission.code}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(role)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => void rolesService.remove(role.id).then(load)}>Delete</Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarWrapper>
    </ProtectedRoute>
  );
}
