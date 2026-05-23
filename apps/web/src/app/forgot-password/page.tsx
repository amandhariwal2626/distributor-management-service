"use client";

import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type FormValues = { tenantCode: string; email: string };

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(async (values) => {
              await apiClient.post("/auth/forgot-password", values);
              setSubmitted(true);
            })}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="tenantCode">Tenant Code</Label>
              <Input id="tenantCode" placeholder="acme-distribution" {...register("tenantCode")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@company.com" {...register("email")} />
            </div>
            {submitted && (
              <p className="text-xs text-muted-foreground">
                If your account exists, reset instructions were issued.
              </p>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
