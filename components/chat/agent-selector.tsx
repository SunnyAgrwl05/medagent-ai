"use client";

import {
  Stethoscope,
  FileScan,
  Pill,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AgentId } from "@/types";

const chatAgents: { id: AgentId; label: string; icon: LucideIcon }[] = [
  { id: "symptom", label: "Symptom", icon: Stethoscope },
  { id: "report", label: "Reports", icon: FileScan },
  { id: "medicine", label: "Medicine", icon: Pill },
  { id: "summary", label: "Summary", icon: ClipboardList },
];

export function AgentSelector({
  active,
  onChange,
}: {
  active: AgentId;
  onChange: (agent: AgentId) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-border/60 bg-card/60 p-1.5 backdrop-blur scrollbar-thin">
      {chatAgents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => onChange(agent.id)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
            active === agent.id
              ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-md"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}
        >
          <agent.icon className="h-4 w-4" />
          {agent.label}
        </button>
      ))}
    </div>
  );
}
