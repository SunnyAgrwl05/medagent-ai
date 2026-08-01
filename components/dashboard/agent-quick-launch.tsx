"use client";

import Link from "next/link";
import {
  Stethoscope,
  FileScan,
  Pill,
  AudioLines,
  ClipboardList,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { Card } from "@/components/ui/card";

const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  FileScan,
  Pill,
  AudioLines,
  ClipboardList,
};

export function AgentQuickLaunch() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {AGENTS.map((agent) => {
        const Icon = iconMap[agent.icon];
        return (
          <Link key={agent.id} href={agent.href}>
            <Card className="group h-full border-border/60 bg-card/60 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${agent.gradient}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-400" />
              </div>
              <p className="mt-4 text-sm font-semibold">{agent.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{agent.tagline}</p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
