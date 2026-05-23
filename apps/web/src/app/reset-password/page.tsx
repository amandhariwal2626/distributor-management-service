"use client";

import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type FormValues = { token: string; password: string };

export default function ResetPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>();
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(async (values) => {
              await apiClient.post("/auth/reset-password", values);
              setSubmitted(true);
            })}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="token">Reset Token</Label>
              <Input id="token" placeholder="Paste reset token" {...register("token")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" placeholder="********" {...register("password")} />
            </div>
            {submitted && <p className="text-xs text-muted-foreground">Password reset successful.</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
