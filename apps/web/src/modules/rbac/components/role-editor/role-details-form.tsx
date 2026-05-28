"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { RoleFormValues } from "./types";

interface Props {
  readOnlyName?: boolean;
}

export function RoleDetailsForm({ readOnlyName }: Props) {
  const { control } = useFormContext<RoleFormValues>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role name</FormLabel>
            <FormControl>
              <Input
                {...field}
                readOnly={readOnlyName}
                placeholder="e.g. Compliance Reviewer"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
  );
}
