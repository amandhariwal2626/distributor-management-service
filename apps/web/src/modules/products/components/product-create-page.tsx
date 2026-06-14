"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stepper } from "@/components/shared/stepper";
import { ErrorState } from "@/components/shared/error-state";
import { useCreateProduct } from "../hooks/use-products";
import { createProductSchema } from "../schemas";
import { Step1ProductInfo } from "./product-form/step-1-product-info";
import { Step2Hierarchy } from "./product-form/step-2-hierarchy";
import { Step3Packaging } from "./product-form/step-3-packaging";
import { Step4Tax } from "./product-form/step-4-tax";
import { Step6Attributes } from "./product-form/step-6-attributes";
import { Step7Documents } from "./product-form/step-7-documents";
import { Step8Review } from "./product-form/step-8-review";
import type { ProductAttribute } from "../types";

const steps = [
  { id: "info", label: "Product Info", description: "Basic details" },
  { id: "hierarchy", label: "Hierarchy", description: "Category & brand" },
  { id: "packaging", label: "Packaging", description: "UOM & dimensions" },
  { id: "tax", label: "Tax", description: "GST & HSN" },
  { id: "attributes", label: "Attributes", description: "Custom fields" },
  { id: "documents", label: "Documents", description: "Files & images" },
  { id: "review", label: "Review", description: "Final checks" },
];

const defaultValues = {
  productCode: "",
  productName: "",
  shortName: "",
  description: "",
  categoryId: "",
  subCategoryId: "",
  brandId: "",
  manufacturerId: "",
  uomId: "",
  taxGroupId: "",
  barcode: "",
  hsnCode: "",
  skuType: "",
  shelfLifeDays: undefined as number | undefined,
  reorderLevel: undefined as number | undefined,
};

export function ProductCreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [documents, setDocuments] = useState<{ id: string; file: File; documentType: string }[]>([]);
  const createProduct = useCreateProduct();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolver = zodResolver(createProductSchema) as any
  const form = useForm({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const [productCode, productName] = useWatch({
    control: form.control,
    name: ["productCode", "productName"],
  });

  const canProceed = () => {
    if (currentStep === 0) {
      return !!(productCode && productName);
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    const values = form.watch();
    createProduct.mutate(
      {
        productCode: values.productCode,
        productName: values.productName,
        shortName: values.shortName || undefined,
        description: values.description || undefined,
        categoryId: values.categoryId || undefined,
        subCategoryId: values.subCategoryId || undefined,
        brandId: values.brandId || undefined,
        manufacturerId: values.manufacturerId || undefined,
        uomId: values.uomId || undefined,
        taxGroupId: values.taxGroupId || undefined,
        barcode: values.barcode || undefined,
        hsnCode: values.hsnCode || undefined,
        skuType: values.skuType || undefined,
        shelfLifeDays: values.shelfLifeDays ?? undefined,
        reorderLevel: values.reorderLevel ?? undefined,
        attributes: attributes,
      },
      {
        onSuccess: () => router.push("/products"),
      },
    );
  };

  if (createProduct.isError) {
    return (
      <ErrorState
        title="Failed to create product"
        message={createProduct.error?.message}
        onRetry={handleSubmit}
      />
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/products")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Product
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete all steps to create a new product
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      <Stepper steps={steps} currentStep={currentStep} />

      <Card>
        <CardContent className="p-6 max-w-full">
          <FormProvider {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              {currentStep === 0 && <Step1ProductInfo />}
              {currentStep === 1 && <Step2Hierarchy />}
              {currentStep === 2 && <Step3Packaging />}
              {currentStep === 3 && <Step4Tax />}
              {currentStep === 4 && (
                <Step6Attributes
                  value={attributes}
                  onChange={(attrs) => setAttributes(attrs)}
                />
              )}
              {currentStep === 5 && (
                <Step7Documents
                  value={documents}
                  onChange={(docs) => setDocuments(docs)}
                />
              )}
              {currentStep === 6 && (
                <Step8Review
                  data={{
                    productInfo: form.watch() as Record<string, unknown>,
                    hierarchy: form.watch() as Record<string, unknown>,
                    packaging: form.watch() as Record<string, unknown>,
                    tax: form.watch() as Record<string, unknown>,
                    geography: { states: [] },
                    attributes,
                    documents,
                  }}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  submitting={createProduct.isPending}
                />
              )}
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {currentStep < 6 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
