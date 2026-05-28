"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useRbacStore } from "../../stores/rbac.store";
import { MultiSelect } from "./multi-select";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().min(2, "Name is required"),
  roleIds: z.array(z.string()).min(1, "Pick at least one role"),
});
type Values = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ open, onOpenChange }: Props) {
  const roles = useRbacStore((s) => s.roles);
  const inviteUser = useRbacStore((s) => s.inviteUser);

  const form = useForm<Values>({
    resolver: zodResolver(schema as never),
    defaultValues: { email: "", name: "", roleIds: [] },
  });

  function handleSubmit(values: Values): void {
    inviteUser(values);
    toast.success(`Invitation sent to ${values.email}`);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) form.reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a new user</DialogTitle>
          <DialogDescription>
            They&apos;ll receive an email to set up their account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl><Input {...field} placeholder="Jane Doe" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} type="email" placeholder="jane@company.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={roles.map((r) => ({ value: r.id, label: r.name, hint: r.description }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Choose one or more roles"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Send invitation</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
