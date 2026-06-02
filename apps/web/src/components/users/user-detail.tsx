import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { RoleBadge } from "@/components/shared/role-badge";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { User } from "@/types";

interface UserDetailProps {
  user: User;
  /** Optional handler when reporting manager link is clicked. */
  onOpenManager?: (id: string) => void;
  /** Optional handler when a subordinate is clicked. */
  onOpenSubordinate?: (id: string) => void;
}

export function UserDetail({ user, onOpenManager, onOpenSubordinate }: UserDetailProps) {
  const p = user.profile;
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <UserAvatar name={p.fullName} className="h-16 w-16 text-lg" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{p.fullName}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {user.roles.map((r) => (
                <RoleBadge key={r.role.id} name={r.role.name} />
              ))}
            </div>
          </div>
          <StatusBadge status={user.status} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <Item label="First Name" value={p.firstName} />
            <Item label="Middle Name" value={p.middleName} />
            <Item label="Last Name" value={p.lastName} />
            <Item label="Gender" value={p.gender} />
            <Item label="Date of Birth" value={p.dob} />
            <Item label="User Code" value={p.userCode} />
            <Item label="Employee Code" value={p.employeeCode} />
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <Item label="Mobile" value={p.mobile} />
            <Item label="Alternate Mobile" value={p.alternateMobile} />
            <Item label="Email" value={user.email} />
            <Item label="Emergency Contact" value={p.emergencyContact} />
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <Item label="Address Line 1" value={p.addressLine1} />
            <Item label="Address Line 2" value={p.addressLine2} />
            <Item label="Address Line 3" value={p.addressLine3} />
            <Item label="City" value={p.city} />
            <Item label="District" value={p.district} />
            <Item label="State" value={p.state} />
            <Item label="Country" value={p.country} />
            <Item label="Pincode" value={p.pincode} />
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid>
            <Item
              label="Roles"
              value={user.roles.map((r) => r.role.name).join(", ") || undefined}
            />
            <div>
              <p className="text-xs text-muted-foreground">Reporting Manager</p>
              {user.reportingManager ? (
                <button
                  onClick={() => onOpenManager?.(user.reportingManager!.id)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {user.reportingManager.profile.fullName}
                </button>
              ) : (
                <p className="text-sm">—</p>
              )}
            </div>
            <Item label="Zone" value={user.zone} />
            <Item label="Region" value={user.region} />
            <Item label="Area" value={user.area} />
            <Item label="Territory" value={user.territory} />
            <Item label="Distributor ID" value={user.distributorId} />
          </Grid>
        </CardContent>
      </Card>

      {user.subordinates && user.subordinates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subordinates ({user.subordinates.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {user.subordinates.map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-2">
                  <UserAvatar name={s.profile.fullName} className="h-8 w-8" />
                  <div className="flex-1">
                    <button
                      onClick={() => onOpenSubordinate?.(s.id)}
                      className="text-sm font-medium hover:underline"
                    >
                      {s.profile.fullName}
                    </button>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Separator />
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

function Item({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}
