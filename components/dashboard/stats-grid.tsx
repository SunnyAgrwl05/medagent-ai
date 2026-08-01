"use client";

import { motion } from "framer-motion";
import { Activity, MessagesSquare, FileScan, TrendingUp, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HealthStat } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Activity,
  MessagesSquare,
  FileScan,
  TrendingUp,
};

const stats: HealthStat[] = [
  { label: "Consultations this month", value: 12, delta: "+4 vs last month", trend: "up", icon: "MessagesSquare" },
  { label: "Reports analyzed", value: 5, delta: "+2 vs last month", trend: "up", icon: "FileScan" },
  { label: "Avg. urgency level", value: "Low", delta: "Stable", trend: "flat", icon: "Activity" },
  { label: "Health trend", value: "Improving", delta: "Last 30 days", trend: "up", icon: "TrendingUp" },
];

export function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon];
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Card className="border-border/60 bg-card/60 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20">
                  <Icon className="h-5 w-5 text-teal-400" />
                </div>
                {stat.trend && (
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up"
                        ? "text-success"
                        : stat.trend === "down"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  >
                    {stat.delta}
                  </span>
                )}
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
