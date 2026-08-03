import {
  Stethoscope,
  FileScan,
  Pill,
  AudioLines,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createServerSupabase } from "@/lib/supabase";
import { ActivityItem } from "@/types";
import { formatRelativeTime, urgencyColor, urgencyLabel } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  symptom: Stethoscope,
  report: FileScan,
  medicine: Pill,
  voice: AudioLines,
  summary: ClipboardList,
};

export async function ActivityFeed({ userId }: { userId: string }) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("activity_log")
    .select("id, agent, title, description, urgency, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("[activity-feed] error:", error);
  }

  const activity: ActivityItem[] = (data ?? []).map((row) => ({
    id: row.id,
    agent: row.agent,
    title: row.title,
    description: row.description,
    timestamp: row.created_at,
    urgency: row.urgency ?? undefined,
  }));

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Your last consultations across all agents.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {activity.map((item) => {
          const Icon = iconMap[item.agent];
          return (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-white/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20">
                <Icon className="h-5 w-5 text-teal-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {item.description}
                </p>
                {item.urgency && (
                  <Badge
                    variant="outline"
                    className={`mt-2 ${urgencyColor[item.urgency]}`}
                  >
                    {urgencyLabel[item.urgency]}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
