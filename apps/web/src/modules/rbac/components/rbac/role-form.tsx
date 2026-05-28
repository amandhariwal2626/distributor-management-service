"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { PermissionMatrix } from "./permission-matrix";
import type { PermissionId } from "../../types";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(48),
  description: z.string().max(280).default(""),
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export type RoleFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<RoleFormValues>;
  readOnlyName?: boolean;
  submitLabel?: string;
  onSubmit: (values: RoleFormValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function RoleForm({
  defaultValues,
  readOnlyName,
  submitLabel = "Save role",
  onSubmit,
  onCancel,
}: Props) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(schema as never),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      permissions: (defaultValues?.permissions as PermissionId[]) ?? [],
    },
  });

  const submitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role name</FormLabel>
                <FormControl>
                  <Input {...field} readOnly={readOnlyName} placeholder="e.g. Compliance Reviewer" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={2}
                    placeholder="What can people with this role do?"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="permissions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <FormDescription>
                Toggling a permission automatically resolves any required dependencies.
              </FormDescription>
              <FormControl>
                <PermissionMatrix
                  value={field.value as PermissionId[]}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving\u2026" : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
