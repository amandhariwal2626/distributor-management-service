"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { invitesService } from "@/services/invites";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InviteAcceptPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await invitesService.accept(params.token, password);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Accept Invite</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button className="w-full" onClick={submit} disabled={loading}>{loading ? "Submitting..." : "Set Password"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
