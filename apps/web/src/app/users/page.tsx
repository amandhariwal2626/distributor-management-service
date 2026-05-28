"use client";

import { useEffect, useState } from "react";
import SidebarWrapper from "@/components/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { usersService, type UserListItem } from "@/services/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await usersService.list({ page: "1", limit: "20", search });
      setUsers(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    usersService.list({ page: "1", limit: "20", search: "" }).then((data) => {
      setUsers(data.items);
      setLoading(false);
    });
  }, []);

  return (
    <ProtectedRoute>
      <SidebarWrapper>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" className="max-w-sm" />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => void load()}>Search</Button>
              <Link href="/users/create"><Button>Create User</Button></Link>
            </div>
          </div>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role(s)</TableHead><TableHead>Status</TableHead><TableHead>Created At</TableHead><TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="space-x-1">{user.roles.map((r) => <Badge key={r.role.id} variant="outline">{r.role.name}</Badge>)}</TableCell>
                    <TableCell><Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Actions</Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.isActive ? <DropdownMenuItem onClick={() => void usersService.deactivate(user.id).then(load)}>Deactivate</DropdownMenuItem> : <DropdownMenuItem onClick={() => void usersService.reactivate(user.id).then(load)}>Reactivate</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {!users.length && <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground">No users found</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </div>
      </SidebarWrapper>
    </ProtectedRoute>
  );
}
