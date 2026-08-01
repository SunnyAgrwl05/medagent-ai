"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  FileScan,
  Pill,
  AudioLines,
  ClipboardList,
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

export function AgentShowcase() {
  return (
    <section id="agents" className="relative py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-teal-400">
            The agent team
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Five specialists, working as one
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each agent focuses on just one job, so it can help you better.
            Together, they cover everything from a quick symptom check to a
            full health summary.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, i) => {
            const Icon = iconMap[agent.icon];
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <Card className="group relative h-full overflow-hidden border-border/60 bg-card/60 p-2 backdrop-blur transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/10">
                  <div
                    className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${agent.gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
                  />
                  <div className="relative p-6">
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${agent.gradient} shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-display text-lg font-semibold">
                      {agent.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-teal-400">
                      {agent.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {agent.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}