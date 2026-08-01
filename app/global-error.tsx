"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="font-display text-xl font-bold">Something went wrong</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            MedAgent AI hit an unexpected error. You can try again, or head
            back to the dashboard.
          </p>
          <div className="mt-2 flex gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
