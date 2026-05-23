"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Boxes,
  CreditCard,
  LayoutGrid,
  Menu,
  Package,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

const sidebarItems = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  {
    key: "orders",
    label: "Orders",
    icon: ShoppingCart,
    permission: "orders.read",
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: Boxes,
    permission: "inventory.read",
  },
  {
    key: "payments",
    label: "Payments",
    icon: CreditCard,
    permission: "payments.manage",
  },
  {
    key: "reports",
    label: "Reports",
    icon: BarChart3,
    permission: "reports.export",
  },
  { key: "users", label: "Users", icon: Users, permission: "users.read" },
];

function SidebarContent({ userPermissions }: { userPermissions: string[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-4">
        <div className="text-xs font-medium text-muted-foreground">
          DMS Console
        </div>
        <div className="mt-1 text-lg font-semibold">Distributor Ops</div>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-2">
        {sidebarItems.map((item) => {
          if (item.permission && !userPermissions.includes(item.permission)) {
            return null;
          }
          const Icon = item.icon;
          return (
            <Button
              key={item.key}
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      <Separator />
      <div className="p-3">
        <Card>
          <CardContent className="p-3 text-xs text-muted-foreground">
            Session policy: access token in memory, refresh token in secure
            cookie.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  const initials = !user?.fullName
    ? "DM"
    : user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

  const permissions = user?.permissions ?? [];

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-muted/30">
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_1fr]">
          <aside className="hidden border-r bg-background md:block">
            <SidebarContent userPermissions={permissions} />
          </aside>
          <div className="flex min-h-screen flex-col">
            <header className="flex h-14 items-center justify-between gap-3 border-b bg-background px-4 md:px-6">
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0">
                    <SidebarContent userPermissions={permissions} />
                  </SheetContent>
                </Sheet>
                <h1 className="text-base font-semibold">
                  Distributor Management Dashboard
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <ThemeModeToggle />
                <Badge variant="secondary">
                  Tenant: {user?.tenantId ?? "-"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 px-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <span className="ml-2 hidden text-sm md:inline">
                        {user?.fullName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => void logout()}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <div className="flex-1 space-y-6 p-4 md:p-6">
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Open Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-semibold">124</div>
                        <p className="text-xs text-muted-foreground">
                          Across active distributors
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          Low Stock SKUs
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-semibold">31</div>
                        <p className="text-xs text-muted-foreground">
                          Needs replenishment planning
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          Pending Payments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-semibold">18</div>
                        <p className="text-xs text-muted-foreground">
                          Distributor receivables aging
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          Active Sessions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-semibold">43</div>
                        <p className="text-xs text-muted-foreground">
                          Multi-device signed-in users
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Tabs defaultValue="orders" className="w-full">
                    <TabsList>
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="inventory">Inventory</TabsTrigger>
                      <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="orders" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <ShoppingCart className="h-4 w-4" />
                            Recent Orders
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Distributor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                  Value
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>#ORD-8123</TableCell>
                                <TableCell>Northline FMCG</TableCell>
                                <TableCell>
                                  <Badge>Approved</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹1,24,000
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>#ORD-8122</TableCell>
                                <TableCell>Metro Channels</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">Pending</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  ₹78,600
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="inventory" className="mt-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4" />
                              Warehouse Utilization
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            Mumbai DC at 84%, Bengaluru DC at 76%, Lucknow DC at
                            69%.
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm">
                              <Truck className="h-4 w-4" />
                              Dispatch SLA Risk
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            9 orders nearing SLA breach in west region route
                            cluster.
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    <TabsContent value="sessions" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <ShieldCheck className="h-4 w-4" />
                            Auth & Session Security
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                          <p>
                            Refresh token rotation enabled for every refresh
                            call.
                          </p>
                          <p>
                            Session invalidation revokes Redis and database
                            session records.
                          </p>
                          <p>
                            Access tokens expire every 15 minutes and remain
                            in-memory only.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
