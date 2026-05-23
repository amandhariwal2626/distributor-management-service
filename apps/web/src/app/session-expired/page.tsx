import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SessionExpiredPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Session Expired</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your session expired for security reasons. Please sign in again.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Sign in Again</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
