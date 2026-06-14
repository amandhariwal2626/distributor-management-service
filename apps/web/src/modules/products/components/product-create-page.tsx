"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFullSchema,
  productInfoSchema,
  productHierarchySchema,
  productPackagingSchema,
  productTaxSchema,
  productGeographySchema,
  productAttributesSchema,
  productDocumentsSchema,
  type ProductFormValues,
} from "../schemas";
import { Stepper, type Step } from "@/components/shared/stepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/page-header";
import { Step1Info } from "./product-form/step-1-product-info";
import { Step2Hierarchy } from "./product-form/step-2-hierarchy";
import { Step3Packaging } from "./product-form/step-3-packaging";
import { Step4Tax } from "./product-form/step-4-tax";
import { Step5Geography } from "./product-form/step-5-geography";
import { Step6Attributes } from "./product-form/step-6-attributes";
import { Step7Documents } from "./product-form/step-7-documents";
import { Step8Review } from "./product-form/step-8-review";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useCreateProduct } from "../hooks/use-products";
import { toast } from "sonner";
import type { ZodSchema } from "zod";

const STEPS: Step[] = [
  {
    id: "info",
    title: "Product Information",
    description: "Code, name, identifiers",
  },
  { id: "hierarchy", title: "Hierarchy", description: "BU, division, brand" },
  { id: "packaging", title: "Packaging", description: "UOM and dimensions" },
  { id: "tax", title: "Tax", description: "HSN and GST" },
  { id: "geography", title: "Geography", description: "Region availability" },
  { id: "attributes", title: "Attributes", description: "Product attributes" },
  {
    id: "documents",
    title: "Documents",
    description: "Files and certificates",
  },
  { id: "review", title: "Review & Submit", description: "Final check" },
];

const stepSchemas: Array<ZodSchema | null> = [
  productInfoSchema,
  productHierarchySchema,
  productPackagingSchema,
  productTaxSchema,
  productGeographySchema,
  productAttributesSchema,
  productDocumentsSchema,
  null,
];

const STORAGE_KEY = "dms.product-draft";

export function ProductCreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(
      productFullSchema,
    ) as unknown as Resolver<ProductFormValues>,
    mode: "onBlur",
    defaultValues: {
      code: "",
      sapCode: "",
      name: "",
      shortName: "",
      barcode: "",
      eanCode: "",
      description: "",
      businessUnit: "",
      division: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      subBrand: "",
      variant: "",
      baseUom: "",
      packSize: undefined,
      caseQuantity: undefined,
      weight: undefined,
      volume: undefined,
      uomConversions: [],
      hsn: "",
      gst: undefined,
      cgst: undefined,
      sgst: undefined,
      igst: undefined,
      cess: undefined,
      tds: undefined,
      tcs: undefined,
      geographies: [],
      attributes: [],
      documents: [],
    },
  });

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        methods.reset(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, [methods]);

  useEffect(() => {
    const sub = methods.watch((value) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        setSavedAt(new Date());
      }
    });
    return () => sub.unsubscribe();
  }, [methods]);

  const createMut = useCreateProduct();

  const next = async () => {
    const schema = stepSchemas[step];
    if (schema) {
      const values = methods.getValues();
      const result = schema.safeParse(values);
      if (!result.success) {
        const fields = Object.keys(
          (
            result as { error: { format: () => Record<string, unknown> } }
          ).error.format(),
        ).filter((k) => k !== "_errors");
        if (fields.length) {
          await methods.trigger(fields as Array<keyof ProductFormValues>);
          toast.error("Please fix the highlighted fields");
          return;
        }
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = methods.handleSubmit(async (values) => {
    try {
      const created = await createMut.mutateAsync(
        values as Partial<ProductFormValues>,
      );
      if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
      router.push(`/products/${created.id}`);
    } catch {
      // Error handled by mutation
    }
  });

  const StepComp = useMemo(() => {
    const map = [
      Step1Info,
      Step2Hierarchy,
      Step3Packaging,
      Step4Tax,
      Step5Geography,
      Step6Attributes,
      Step7Documents,
      Step8Review,
    ];
    return map[step];
  }, [step]);

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Create Product"
          description="Define a new product across information, hierarchy, packaging, tax, and rollout."
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/products")}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(methods.getValues()),
                  );
                  toast.success("Draft saved");
                }}
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save draft
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <Card className="h-fit p-3">
            <div className="px-2 pb-3">
              <Progress value={progress} className="h-1" />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Step {step + 1} of {STEPS.length}
                </span>
                {savedAt ? (
                  <span>Saved {savedAt.toLocaleTimeString()}</span>
                ) : null}
              </div>
            </div>
            <Stepper steps={STEPS} current={step} onStepClick={setStep} />
          </Card>

          <div className="flex flex-col gap-4">
            <StepComp />
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={back}
                disabled={step === 0}
              >
                <ChevronLeft className="mr-1.5 h-3.5 w-3.5" />
                Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button size="sm" onClick={next}>
                  Continue
                  <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={submit}
                  disabled={createMut.isPending}
                >
                  {createMut.isPending ? "Submitting…" : "Submit For Approval"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
