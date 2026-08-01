"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const data = [
  { week: "W1", consultations: 2, reports: 1 },
  { week: "W2", consultations: 3, reports: 0 },
  { week: "W3", consultations: 1, reports: 2 },
  { week: "W4", consultations: 4, reports: 1 },
  { week: "W5", consultations: 2, reports: 1 },
  { week: "W6", consultations: 5, reports: 3 },
];

export function HealthChart() {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Activity over time</CardTitle>
        <CardDescription>
          Consultations and reports analyzed across the last 6 weeks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConsultations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0abfae" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0abfae" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#635bf1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#635bf1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="consultations"
                stroke="#0abfae"
                fill="url(#colorConsultations)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="reports"
                stroke="#635bf1"
                fill="url(#colorReports)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
