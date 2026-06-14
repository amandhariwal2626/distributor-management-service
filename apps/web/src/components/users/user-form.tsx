import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/shared/role-badge";
import { DatePicker } from "@/components/ui/date-picker";
import { UserFormSkeleton } from "@/components/users/user-form-skeleton";
import { formatDate } from "@/utils/common";
import { toast } from "sonner";
import { useRbacStore } from "@/store/rbac-store";
import type { CreateOptionsResponse, CreateUserPayload, User } from "@/types";

const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  displayName: z.string().optional(),
  userCode: z.string().optional(),
  employeeCode: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dob: z.string().optional(),
  email: z.string().email("Enter a valid email address"),
  username: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  mobile: z
    .string()
    .regex(/^\d{10}$/, "Mobile must be 10 digits")
    .optional()
    .or(z.literal("")),
  alternateMobile: z
    .string()
    .regex(/^\d{10}$/, "Alternate mobile must be 10 digits")
    .optional()
    .or(z.literal("")),
  emergencyContact: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits")
    .optional()
    .or(z.literal("")),
  roleIds: z.array(z.string()).min(1, "At least one role must be selected"),
  reportingManagerId: z.string().optional(),
  zone: z.string().optional(),
  region: z.string().optional(),
  area: z.string().optional(),
  territory: z.string().optional(),
  distributorId: z.string().optional(),
  forcePasswordChange: z.boolean().optional(),
  passwordExpiryDays: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().int().positive().optional(),
  ),
  twoFactorAuth: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

interface UserFormProps {
  initial?: User;
  mode: "create" | "edit";
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
  onCancel?: () => void;
}

function toDefaultValues(user?: User): FormValues {
  if (!user) {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleIds: [],
    };
  }
  return {
    userCode: user.profile.userCode ?? "",
    employeeCode: user.profile.employeeCode ?? "",
    firstName: user.profile.firstName,
    middleName: user.profile.middleName ?? "",
    lastName: user.profile.lastName,
    displayName: user.profile.displayName ?? "",
    email: user.email,
    username: user.username ?? "",
    gender: user.profile.gender,
    dob: user.profile.dob,
    mobile: user.profile.mobile ?? "",
    alternateMobile: user.profile.alternateMobile ?? "",
    emergencyContact: user.profile.emergencyContact ?? "",
    addressLine1: user.profile.addressLine1 ?? "",
    addressLine2: user.profile.addressLine2 ?? "",
    addressLine3: user.profile.addressLine3 ?? "",
    country: user.profile.country ?? "",
    state: user.profile.state ?? "",
    district: user.profile.district ?? "",
    city: user.profile.city ?? "",
    pincode: user.profile.pincode ?? "",
    roleIds: user.roles.map((r) => r.role.id),
    reportingManagerId: user.reportingManager?.id ?? "",
    zone: user.zone ?? "",
    region: user.region ?? "",
    area: user.area ?? "",
    territory: user.territory ?? "",
    distributorId: user.distributorId ?? "",
    forcePasswordChange: user.forcePasswordChange ?? false,
    passwordExpiryDays: user.passwordExpiryDays ?? undefined,
    twoFactorAuth: user.twoFactorAuth ?? false,
  };
}

export function UserForm({ initial, mode, onSubmit, onCancel }: UserFormProps) {
  const getCreateOptions = useRbacStore((s) => s.getCreateOptions);
  const [options, setOptions] = useState<CreateOptionsResponse>({
    roles: [],
    managers: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: toDefaultValues(initial),
  });

  useEffect(() => {
    getCreateOptions()
      .then(setOptions)
      .catch(() => undefined);
  }, [getCreateOptions]);

  if (options.roles.length === 0) {
    return <UserFormSkeleton />;
  }

  async function handleFormSubmit(values: z.infer<typeof schema>) {
    if (mode === "create" && !values.password) {
      toast.error("Password is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateUserPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        roleIds: values.roleIds,
      };

      const entries = Object.entries(values) as [
        keyof CreateUserPayload,
        unknown,
      ][];
      for (const [key, v] of entries) {
        if (
          key === "firstName" ||
          key === "lastName" ||
          key === "email" ||
          key === "roleIds"
        )
          continue;
        if (v !== "" && v !== undefined && v !== null) {
          (payload as unknown as Record<string, unknown>)[key] = v;
        }
      }

      await onSubmit(payload);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employeeCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(v || undefined)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) =>
                        field.onChange(date ? formatDate(date) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled={mode === "edit"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternateMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Mobile</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine3"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address Line 3</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Roles <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {options.roles.map((role) => {
                        const selected = field.value.includes(role.id);
                        return (
                          <Button
                            type="button"
                            key={role.id}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const next = selected
                                ? field.value.filter((id) => id !== role.id)
                                : [...field.value, role.id];
                              field.onChange(next);
                            }}
                          >
                            {role.name}
                          </Button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {options.roles
                        .filter((r) => field.value.includes(r.id))
                        .map((r) => (
                          <RoleBadge key={r.id} name={r.name} />
                        ))}
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="reportingManagerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporting Manager</FormLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(v) => field.onChange(v || undefined)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options.managers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.profile.fullName} ({m.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="territory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Territory</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distributorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distributor ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Login Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === "create" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Min 8 characters"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="forcePasswordChange"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mb-0">
                    Force password change on next login
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twoFactorAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mb-0">
                    Enable two-factor authentication
                  </FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : mode === "create"
                ? "Create User"
                : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
