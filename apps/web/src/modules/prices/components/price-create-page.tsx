"use client";

import { useRouter } from "next/navigation";
import {
  useForm,
  Controller,
  type Resolver,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { priceSchema, type PriceFormValues } from "../schemas";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SearchableCombobox } from "@/components/shared/searchable-combobox";
import { Separator } from "@/components/ui/separator";
import { useCreatePrice, useProductsList } from "../hooks/use-prices";
import { CheckCircle2, XCircle } from "lucide-react";

export function PriceCreatePage() {
  const router = useRouter();
  const productsQ = useProductsList();
  const create = useCreatePrice();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema) as unknown as Resolver<PriceFormValues>,
    defaultValues: {
      productId: "",
      mrp: 0,
      ptr: 0,
      pts: 0,
      purchasePrice: 0,
      effectiveFrom: "",
      effectiveTo: "",
      revisionReason: "",
    },
    mode: "onBlur",
  });

  const mrp = Number(watch("mrp")) || 0;
  const ptr = Number(watch("ptr")) || 0;
  const pts = Number(watch("pts")) || 0;
  const pp = Number(watch("purchasePrice")) || 0;

  const checks = [
    { ok: mrp >= ptr, label: "MRP ≥ PTR" },
    { ok: ptr >= pts, label: "PTR ≥ PTS" },
    { ok: pp <= pts, label: "Purchase Price ≤ PTS" },
  ];

  const onSubmit = handleSubmit(async (values) => {
    await create.mutateAsync(values);
    router.push("/prices");
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create Price"
        description="Define MRP, PTR, PTS and effective dates."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/prices")}
          >
            Cancel
          </Button>
        }
      />

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
      >
        <Card className="p-6">
          <h2 className="text-base font-semibold">Price Details</h2>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label className="mb-1.5 inline-block text-xs font-medium">
                Product
              </Label>
              <Controller
                control={control}
                name="productId"
                render={({ field }) => (
                  <SearchableCombobox
                    value={field.value}
                    onChange={field.onChange}
                    options={(productsQ.data ?? []).map((p) => ({
                      value: p.id,
                      label: p.name,
                      hint: p.code,
                    }))}
                    placeholder="Select product"
                    loading={productsQ.isLoading}
                  />
                )}
              />
              {errors.productId?.message ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.productId.message}
                </p>
              ) : null}
            </div>
            <PriceField
              label="MRP"
              register={register("mrp")}
              error={errors.mrp?.message}
            />
            <PriceField
              label="PTR"
              register={register("ptr")}
              error={errors.ptr?.message}
            />
            <PriceField
              label="PTS"
              register={register("pts")}
              error={errors.pts?.message}
            />
            <PriceField
              label="Purchase Price"
              register={register("purchasePrice")}
              error={errors.purchasePrice?.message}
            />
            <DateField
              label="Effective From"
              register={register("effectiveFrom")}
              error={errors.effectiveFrom?.message}
            />
            <DateField
              label="Effective To"
              register={register("effectiveTo")}
              error={errors.effectiveTo?.message}
            />
            <div className="md:col-span-2">
              <Label className="mb-1.5 inline-block text-xs font-medium">
                Revision Reason
              </Label>
              <Textarea rows={3} {...register("revisionReason")} />
              {errors.revisionReason?.message ? (
                <p className="mt-1 text-xs text-destructive">
                  {errors.revisionReason.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending ? "Saving…" : "Create Price"}
            </Button>
          </div>
        </Card>

        <Card className="h-fit p-5">
          <h3 className="text-sm font-semibold">Validation</h3>
          <p className="text-xs text-muted-foreground">
            Live checks based on entered values.
          </p>
          <Separator className="my-3" />
          <ul className="space-y-2 text-sm">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                {c.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={c.ok ? "text-foreground" : "text-muted-foreground"}
                >
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </form>
    </div>
  );
}

function PriceField({
  label,
  register,
  error,
}: {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 inline-block text-xs font-medium">{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          ₹
        </span>
        <Input
          type="number"
          step="0.01"
          className="pl-6 tabular-nums"
          {...register}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function DateField({
  label,
  register,
  error,
}: {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div>
      <Label className="mb-1.5 inline-block text-xs font-medium">{label}</Label>
      <Input type="date" {...register} />
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
