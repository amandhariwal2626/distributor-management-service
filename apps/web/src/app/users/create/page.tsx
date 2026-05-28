"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import SidebarWrapper from "@/components/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { rolesService } from "@/services/roles";
import { usersService } from "@/services/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  roleId: z.string().uuid(),
});

type FormValues = z.infer<typeof schema>;

export default function CreateUserPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    void rolesService.list().then((r) => setRoles(r.map((x) => ({ id: x.id, name: x.name }))));
  }, []);

  const onSubmit = async (values: FormValues) => {
    await usersService.create({ ...values, roleIds: [values.roleId] });
    router.push("/users");
  };

  return (
    <ProtectedRoute>
      <SidebarWrapper>
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Create User</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <div><Label>First Name</Label><Input {...register("firstName")} />{errors.firstName && <p className="text-xs text-red-500">Required</p>}</div>
              <div><Label>Last Name</Label><Input {...register("lastName")} />{errors.lastName && <p className="text-xs text-red-500">Required</p>}</div>
              <div><Label>Email</Label><Input {...register("email")} />{errors.email && <p className="text-xs text-red-500">Invalid email</p>}</div>
              <div>
                <Label>Role</Label>
                <select className="w-full h-9 border rounded-md px-3 text-sm bg-background" {...register("roleId")}>
                  <option value="">Select role</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                {errors.roleId && <p className="text-xs text-red-500">Role required</p>}
              </div>
              <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Creating..." : "Create User"}</Button>
            </form>
          </CardContent>
        </Card>
      </SidebarWrapper>
    </ProtectedRoute>
  );
}
