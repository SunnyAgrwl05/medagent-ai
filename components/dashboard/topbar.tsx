"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Sidebar } from "./sidebar";

export function Topbar({ title }: { title: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-border/60 bg-background shadow-2xl">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
