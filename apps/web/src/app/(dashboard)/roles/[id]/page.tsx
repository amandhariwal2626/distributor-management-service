"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";

import { rolesService } from "@/services/roles";
import { useRbacStore } from "@/modules/rbac/stores/rbac.store";
import { PermissionMatrix } from "@/modules/rbac/components/role-editor/permission-matrix";

import { EditRoleHeader } from "@/modules/rbac/components/role-editor/role-editor-header";
import { RoleDetailsForm } from "@/modules/rbac/components/role-editor/role-details-form";
import { GeneralTab } from "@/modules/rbac/components/role-editor/general-tab";
import { MembersTab } from "@/modules/rbac/components/role-editor/members-tab";
import { AuditTab } from "@/modules/rbac/components/role-editor/audit-tab";
import { RoleEditorSkeleton } from "@/modules/rbac/components/role-editor/loading-skeleton";
import { ErrorBoundary } from "@/modules/rbac/components/role-editor/error-boundary";
import type { RoleEditorData, RoleFormValues } from "@/modules/rbac/components/role-editor/types";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(48),
  description: z.string().max(280).default(""),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

function mapToEditorData(item: {
  id: string;
  name: string;
  description?: string;
  permissions: { permission: { code: string } }[];
  isSystem?: boolean;
  userCount?: number;
  createdAt?: string;
  updatedAt?: string;
}): RoleEditorData {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    permissions: item.permissions.map((p) => p.permission.code),
    isSystem: item.isSystem ?? false,
    userCount: item.userCount ?? 0,
    createdAt: item.createdAt ?? "",
    updatedAt: item.updatedAt ?? "",
  };
}

export default function EditRolePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const loadRoles = useRbacStore((s) => s.loadRoles);
  const loadUsers = useRbacStore((s) => s.loadUsers);
  const [tab, setTab] = useState("general");

  const {
    data: rawRole,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["role", params.id],
    queryFn: () => rolesService.getById(params.id),
  });

  const role = useMemo(() => (rawRole ? mapToEditorData(rawRole) : null), [rawRole]);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(schema as never),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const { isDirty } = form.formState;
  const permissions = form.watch("permissions");

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, [loadRoles, loadUsers]);

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    }
  }, [role, form]);

  const updateMutation = useMutation({
    mutationFn: (values: RoleFormValues) =>
      rolesService.update(params.id, {
        name: values.name,
        description: values.description || undefined,
        permissions: values.permissions,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", params.id] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      form.reset({}, { keepValues: true });
      toast.success("Role updated successfully");
    },
    onError: () => {
      toast.error("Failed to update role. Please try again.");
    },
  });

  const cloneMutation = useMutation({
    mutationFn: () => rolesService.clone(params.id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      const newId = res?.data?.id;
      toast.success("Role cloned successfully");
      if (newId) router.push(`/roles/${newId}`);
    },
    onError: () => {
      toast.error("Failed to clone role. Please try again.");
    },
  });

  const handleSave = useCallback(() => {
    form.handleSubmit(
      (values) => updateMutation.mutate(values),
      () => toast.error("Please fix the form errors before saving."),
    )();
  }, [form, updateMutation]);

  const handleClone = useCallback(() => {
    cloneMutation.mutate();
  }, [cloneMutation]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  if (isLoading) return <RoleEditorSkeleton />;

  if (error || !role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
        <p className="text-lg font-semibold text-destructive">Failed to load role</p>
        <p className="text-sm text-muted-foreground max-w-md">
          {error instanceof Error ? error.message : "The role could not be found or you don't have access."}
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <FormProvider {...form}>
        <EditRoleHeader
          roleName={role.name}
          isDirty={isDirty}
          isSaving={updateMutation.isPending}
          onSave={handleSave}
          onClone={handleClone}
        />

        <Form {...form}>
          <form className="space-y-6 mt-6">
            <div className="rounded-xl border bg-card p-6">
              <RoleDetailsForm readOnlyName={role.isSystem} />
            </div>

            <Tabs value={tab} onValueChange={setTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="audit">Audit</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <GeneralTab role={role} />
              </TabsContent>

              <TabsContent value="permissions">
                <div className="rounded-xl border bg-card p-6">
                  <PermissionMatrix
                    value={permissions}
                    onChange={(next) => form.setValue("permissions", next, { shouldDirty: true })}
                  />
                </div>
              </TabsContent>

              <TabsContent value="members">
                <MembersTab role={role} />
              </TabsContent>

              <TabsContent value="audit">
                <AuditTab role={role} />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </FormProvider>
    </ErrorBoundary>
  );
}
