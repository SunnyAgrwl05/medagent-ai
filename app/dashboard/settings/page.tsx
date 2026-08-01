"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Moon, Sun, Laptop, Bell, Volume2, Trash2 } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [saveHistory, setSaveHistory] = useState(true);

  return (
    <>
      <Topbar title="Settings" />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how MedAgent AI looks on your device.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                    theme === opt.value
                      ? "border-teal-500 bg-teal-500/10 text-teal-400"
                      : "border-border/60 text-muted-foreground hover:border-teal-500/30"
                  )}
                >
                  <opt.icon className="h-5 w-5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Fine-tune how agents behave.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label>Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when an analysis finishes
                  </p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label>Auto-speak responses</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically read Voice Agent replies aloud
                  </p>
                </div>
              </div>
              <Switch checked={autoSpeak} onCheckedChange={setAutoSpeak} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Save consultation history</Label>
                <p className="text-xs text-muted-foreground">
                  Used to power your Health Summary Agent
                </p>
              </div>
              <Switch checked={saveHistory} onCheckedChange={setSaveHistory} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>Irreversible actions — proceed carefully.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Clear all consultation history</p>
              <p className="text-xs text-muted-foreground">
                Permanently deletes all chats, reports, and summaries.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() =>
                toast.success("History cleared", {
                  description: "All your consultation history has been removed.",
                })
              }
            >
              <Trash2 className="h-4 w-4" /> Clear history
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
