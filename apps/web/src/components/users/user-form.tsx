import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/shared/role-badge";
import { DatePicker } from "@/components/ui/date-picker";
import { useRbacStore } from "@/store/rbac-store";
import type {
  CreateOptionsResponse,
  CreateUserPayload,
  RoleInfo,
  User,
} from "@/types";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface UserFormProps {
  initial?: User;
  mode: "create" | "edit";
  onSubmit: (payload: CreateUserPayload) => Promise<void>;
  onCancel?: () => void;
}

function fromUser(user?: User): CreateUserPayload {
  if (!user) {
    return { firstName: "", lastName: "", email: "", roleIds: [] };
  }
  return {
    userCode: user.profile.userCode,
    employeeCode: user.profile.employeeCode,
    firstName: user.profile.firstName,
    middleName: user.profile.middleName,
    lastName: user.profile.lastName,
    displayName: user.profile.displayName,
    email: user.email,
    username: user.username,
    gender: user.profile.gender,
    dob: user.profile.dob,
    mobile: user.profile.mobile,
    alternateMobile: user.profile.alternateMobile,
    emergencyContact: user.profile.emergencyContact,
    addressLine1: user.profile.addressLine1,
    addressLine2: user.profile.addressLine2,
    addressLine3: user.profile.addressLine3,
    country: user.profile.country,
    state: user.profile.state,
    district: user.profile.district,
    city: user.profile.city,
    pincode: user.profile.pincode,
    roleIds: user.roles.map((r) => r.role.id),
    reportingManagerId: user.reportingManager?.id,
    zone: user.zone,
    region: user.region,
    area: user.area,
    territory: user.territory,
    distributorId: user.distributorId,
    forcePasswordChange: user.forcePasswordChange,
    passwordExpiryDays: user.passwordExpiryDays,
    twoFactorAuth: user.twoFactorAuth,
  };
}

export function UserForm({ initial, mode, onSubmit, onCancel }: UserFormProps) {
  const getCreateOptions = useRbacStore((s) => s.getCreateOptions);
  const [form, setForm] = useState<CreateUserPayload>(fromUser(initial));
  const [options, setOptions] = useState<CreateOptionsResponse>({ roles: [], managers: [] });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCreateOptions().then(setOptions).catch(() => undefined);
  }, [getCreateOptions]);

  function update<K extends keyof CreateUserPayload>(key: K, value: CreateUserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRole(role: RoleInfo) {
    setForm((prev) => {
      const has = prev.roleIds.includes(role.id);
      return {
        ...prev,
        roleIds: has ? prev.roleIds.filter((id) => id !== role.id) : [...prev.roleIds, role.id],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Strip empty strings to undefined
      const payload: CreateUserPayload = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== "" && v !== undefined),
      ) as CreateUserPayload;
      await onSubmit(payload);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="First Name" required>
            <Input
              value={form.firstName ?? ""}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </Field>
          <Field label="Middle Name">
            <Input
              value={form.middleName ?? ""}
              onChange={(e) => update("middleName", e.target.value)}
            />
          </Field>
          <Field label="Last Name" required>
            <Input
              value={form.lastName ?? ""}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
          </Field>
          <Field label="Display Name">
            <Input
              value={form.displayName ?? ""}
              onChange={(e) => update("displayName", e.target.value)}
            />
          </Field>
          <Field label="User Code">
            <Input
              value={form.userCode ?? ""}
              onChange={(e) => update("userCode", e.target.value)}
            />
          </Field>
          <Field label="Employee Code">
            <Input
              value={form.employeeCode ?? ""}
              onChange={(e) => update("employeeCode", e.target.value)}
            />
          </Field>
          <Field label="Gender">
            <Select
              value={form.gender ?? ""}
              onValueChange={(v) => update("gender", v as CreateUserPayload["gender"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Date of Birth">
            <DatePicker
              value={form.dob ? new Date(form.dob + "T00:00:00") : undefined}
              onChange={(date) =>
                update("dob", date ? formatDate(date) : undefined)
              }
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Email" required>
            <Input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => update("email", e.target.value)}
              required
              disabled={mode === "edit"}
            />
          </Field>
          <Field label="Username">
            <Input
              value={form.username ?? ""}
              onChange={(e) => update("username", e.target.value)}
            />
          </Field>
          <Field label="Mobile">
            <Input
              value={form.mobile ?? ""}
              onChange={(e) => update("mobile", e.target.value)}
              maxLength={10}
            />
          </Field>
          <Field label="Alternate Mobile">
            <Input
              value={form.alternateMobile ?? ""}
              onChange={(e) => update("alternateMobile", e.target.value)}
              maxLength={10}
            />
          </Field>
          <Field label="Emergency Contact">
            <Input
              value={form.emergencyContact ?? ""}
              onChange={(e) => update("emergencyContact", e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Address Line 1" className="md:col-span-2">
            <Input
              value={form.addressLine1 ?? ""}
              onChange={(e) => update("addressLine1", e.target.value)}
            />
          </Field>
          <Field label="Address Line 2" className="md:col-span-2">
            <Input
              value={form.addressLine2 ?? ""}
              onChange={(e) => update("addressLine2", e.target.value)}
            />
          </Field>
          <Field label="Address Line 3" className="md:col-span-2">
            <Input
              value={form.addressLine3 ?? ""}
              onChange={(e) => update("addressLine3", e.target.value)}
            />
          </Field>
          <Field label="City">
            <Input value={form.city ?? ""} onChange={(e) => update("city", e.target.value)} />
          </Field>
          <Field label="District">
            <Input
              value={form.district ?? ""}
              onChange={(e) => update("district", e.target.value)}
            />
          </Field>
          <Field label="State">
            <Input value={form.state ?? ""} onChange={(e) => update("state", e.target.value)} />
          </Field>
          <Field label="Country">
            <Input
              value={form.country ?? ""}
              onChange={(e) => update("country", e.target.value)}
            />
          </Field>
          <Field label="Pincode">
            <Input
              value={form.pincode ?? ""}
              onChange={(e) => update("pincode", e.target.value)}
              maxLength={6}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Roles</Label>
            <div className="flex flex-wrap gap-2">
              {options.roles.map((role) => {
                const selected = form.roleIds.includes(role.id);
                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => toggleRole(role)}
                    className={`rounded-md border px-3 py-1 text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-accent"
                    }`}
                  >
                    {role.name}
                  </button>
                );
              })}
            </div>
            {form.roleIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {options.roles
                  .filter((r) => form.roleIds.includes(r.id))
                  .map((r) => (
                    <RoleBadge key={r.id} name={r.name} />
                  ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Reporting Manager">
              <Select
                value={form.reportingManagerId ?? ""}
                onValueChange={(v) => update("reportingManagerId", v || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {options.managers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.profile.fullName} ({m.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Zone">
              <Input value={form.zone ?? ""} onChange={(e) => update("zone", e.target.value)} />
            </Field>
            <Field label="Region">
              <Input value={form.region ?? ""} onChange={(e) => update("region", e.target.value)} />
            </Field>
            <Field label="Area">
              <Input value={form.area ?? ""} onChange={(e) => update("area", e.target.value)} />
            </Field>
            <Field label="Territory">
              <Input
                value={form.territory ?? ""}
                onChange={(e) => update("territory", e.target.value)}
              />
            </Field>
            <Field label="Distributor ID">
              <Input
                value={form.distributorId ?? ""}
                onChange={(e) => update("distributorId", e.target.value)}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "create" && (
            <Field label="Password">
              <Input
                type="password"
                value={form.password ?? ""}
                onChange={(e) => update("password", e.target.value)}
                minLength={8}
                placeholder="Min 8 characters"
              />
            </Field>
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              id="forcePasswordChange"
              checked={!!form.forcePasswordChange}
              onCheckedChange={(c) => update("forcePasswordChange", !!c)}
            />
            <Label htmlFor="forcePasswordChange">Force password change on next login</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="twoFactorAuth"
              checked={!!form.twoFactorAuth}
              onCheckedChange={(c) => update("twoFactorAuth", !!c)}
            />
            <Label htmlFor="twoFactorAuth">Enable two-factor authentication</Label>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : mode === "create" ? "Create User" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-sm">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}
