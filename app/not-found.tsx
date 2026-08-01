import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20">
        <Compass className="h-8 w-8 text-teal-400" />
      </div>
      <h1 className="font-display text-3xl font-bold">404</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        This page doesn&apos;t exist. Let&apos;s get you back to somewhere useful.
      </p>
      <div className="mt-2 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
