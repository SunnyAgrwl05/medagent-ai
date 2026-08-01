"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Stethoscope,
  FileScan,
  Pill,
  AudioLines,
  ClipboardList,
  User,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/chat?agent=symptom", label: "Symptom Agent", icon: Stethoscope },
  { href: "/dashboard/reports", label: "Report Agent", icon: FileScan },
  { href: "/dashboard/medicine", label: "Medicine Agent", icon: Pill },
  { href: "/dashboard/voice", label: "Voice Agent", icon: AudioLines },
  { href: "/dashboard/summary", label: "Health Summary", icon: ClipboardList },
];

const bottomItems = [
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return base === "/dashboard" ? pathname === base : pathname.startsWith(base);
  };

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-indigo-500">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-base font-bold">MedAgent AI</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1.5 md:hidden">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Agents
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gradient-to-r from-teal-500/15 to-indigo-500/15 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("h-4 w-4", active && "text-teal-400")}
              />
              {item.label}
            </Link>
          );
        })}

        <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </p>
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gradient-to-r from-teal-500/15 to-indigo-500/15 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-teal-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold">Emergency?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          If this is a medical emergency, call your local emergency number
          immediately. Do not wait for an AI response.
        </p>
      </div>
    </div>
  );
}
