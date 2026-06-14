"use client";

import { useProduct, useProductDocuments } from "../hooks/use-products";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ArrowLeft, Package, FileText, History } from "lucide-react";
import Link from "next/link";

export function ProductDetailPage({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } = useProduct(id);
  const docsQ = useProductDocuments(id);

  if (isError)
    return (
      <ErrorState message="Could not load product." onRetry={() => refetch()} />
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Button asChild variant="ghost" size="sm" className="h-7 px-2">
          <Link href="/products">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back to products
          </Link>
        </Button>
      </div>

      <Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground">
          {data?.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt={data.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <Package className="h-6 w-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="mt-1 h-3.5 w-32" />
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">
                  {data?.name}
                </h1>
                <StatusBadge value={data?.status} />
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {data?.code}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/prices/${id}/history`}>
              <History className="mr-1.5 h-3.5 w-3.5" />
              Price History
            </Link>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-2 sm:p-4">
          <Tabs defaultValue="overview">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="geography">Geography</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>

            <TabsContent
              value="overview"
              className="mt-4 grid grid-cols-1 gap-3 p-2 sm:grid-cols-2"
            >
              <Field
                label="Short Name"
                value={data?.shortName}
                loading={isLoading}
              />
              <Field
                label="Brand"
                value={data?.brandName}
                loading={isLoading}
              />
              <Field
                label="Category"
                value={data?.categoryName}
                loading={isLoading}
              />
              <Field
                label="Variant"
                value={data?.variant}
                loading={isLoading}
              />
              <Field
                label="Base UOM"
                value={data?.baseUom}
                loading={isLoading}
              />
              <Field
                label="Pack Size"
                value={data?.packSize}
                loading={isLoading}
              />
              <Field
                label="Barcode"
                value={data?.barcode}
                loading={isLoading}
              />
              <Field
                label="Description"
                value={data?.description}
                loading={isLoading}
                className="sm:col-span-2"
              />
            </TabsContent>
            <TabsContent
              value="hierarchy"
              className="mt-4 grid grid-cols-1 gap-3 p-2 sm:grid-cols-2"
            >
              <Field
                label="Business Unit"
                value={data?.businessUnit}
                loading={isLoading}
              />
              <Field
                label="Division"
                value={data?.division}
                loading={isLoading}
              />
              <Field
                label="Sub Brand"
                value={data?.subBrand}
                loading={isLoading}
              />
            </TabsContent>
            <TabsContent value="pricing" className="mt-4 p-2">
              <EmptyState
                title="Pricing"
                description="View and manage prices from the Price Master module."
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link href="/prices">Open Price Master</Link>
                  </Button>
                }
              />
            </TabsContent>
            <TabsContent value="geography" className="mt-4 p-2">
              <EmptyState
                title="Geography"
                description="Geography availability is shown here."
              />
            </TabsContent>
            <TabsContent value="attributes" className="mt-4 p-2">
              <EmptyState
                title="Attributes"
                description="Product attributes are shown here."
              />
            </TabsContent>
            <TabsContent value="documents" className="mt-4 p-2">
              {docsQ.isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (docsQ.data?.length ?? 0) === 0 ? (
                <EmptyState
                  title="No documents"
                  description="Attach files from the product edit screen."
                />
              ) : (
                <ul className="space-y-2">
                  {docsQ.data!.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{d.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.type} ·{" "}
                          {new Date(d.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
            <TabsContent value="audit" className="mt-4 p-2">
              <EmptyState
                title="Audit trail"
                description="A timeline of changes will appear here."
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link href="/audit">Open Audit</Link>
                  </Button>
                }
              />
            </TabsContent>
          </Tabs>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold">Approval Status</h3>
            <Separator className="my-3" />
            <div className="flex items-center gap-2 text-sm">
              <StatusBadge value={data?.status} />{" "}
              <span className="text-muted-foreground">current</span>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              Activity for this product will appear here.
            </p>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold">Audit Summary</h3>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              Created{" "}
              {data?.createdAt
                ? new Date(data.createdAt).toLocaleString()
                : "—"}
              .
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  loading,
  className,
}: {
  label: string;
  value?: React.ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {loading ? (
        <Skeleton className="mt-1 h-4 w-32" />
      ) : (
        <p className="mt-0.5 text-sm text-foreground">{value ?? "—"}</p>
      )}
    </div>
  );
}
