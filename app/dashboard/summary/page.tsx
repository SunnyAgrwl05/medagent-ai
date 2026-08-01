"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, RefreshCw, Loader2, Download, FileText, MessageCircle, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateSummaryPDF, shareSummaryOnWhatsApp } from "@/lib/pdf-export";

const mockHistory = [
  {
    agent: "Symptom Agent",
    title: "Headache & mild fever",
    description: "Assessed as low urgency, advised rest and fluids.",
    date: "2026-07-24",
  },
  {
    agent: "Report Agent",
    title: "CBC blood panel",
    description: "Slightly low iron and vitamin D, otherwise normal.",
    date: "2026-07-20",
  },
  {
    agent: "Medicine Agent",
    title: "Azithromycin 500mg",
    description: "Explained dosage schedule and food interaction notes.",
    date: "2026-07-15",
  },
  {
    agent: "Symptom Agent",
    title: "Persistent sore throat",
    description: "Assessed as low-moderate, recommended saline gargle and monitoring.",
    date: "2026-07-10",
  },
];

export default function SummaryPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: mockHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate summary");
      setSummary(data.analysis);
      toast.success("Health summary ready");
    } catch (err) {
      toast.error("Couldn't generate summary", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMarkdown = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medagent-health-summary.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    if (!summary) return;
    setIsExportingPdf(true);
    try {
      generateSummaryPDF(summary, mockHistory);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error("Couldn't generate PDF", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleWhatsAppShare = () => {
    if (!summary) return;
    shareSummaryOnWhatsApp(summary);
  };

  return (
    <>
      <Topbar title="Health Summary Agent" />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Your whole health story, in one place
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pulls every consultation together into a narrative you can bring
              to your next appointment.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary && (
              <>
                <Button
                  variant="glass"
                  onClick={handleWhatsAppShare}
                  className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                >
                  <MessageCircle className="h-4 w-4" /> Share on WhatsApp
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="glass" disabled={isExportingPdf}>
                      {isExportingPdf ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Download
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={downloadPdf}>
                      <FileDown className="h-4 w-4" /> Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={downloadMarkdown}>
                      <FileText className="h-4 w-4" /> Download as Markdown
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            <Button onClick={generateSummary} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" /> {summary ? "Regenerate" : "Generate summary"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card/60 backdrop-blur lg:col-span-1">
            <CardHeader>
              <CardTitle>Consultation log</CardTitle>
              <CardDescription>What the summary is based on.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockHistory.map((h, i) => (
                <div key={i} className="rounded-xl border border-border/60 p-3">
                  <p className="text-xs font-semibold text-teal-400">{h.agent}</p>
                  <p className="mt-1 text-sm font-medium">{h.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{h.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground/70">{h.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur lg:col-span-2">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Generated narrative, trend, and recommendations.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}
              <AnimatePresence>
                {summary && !isLoading && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500">
                      <ClipboardList className="h-6 w-6 text-white" />
                    </div>
                    <MarkdownRenderer content={summary} />
                  </motion.div>
                )}
              </AnimatePresence>
              {!summary && !isLoading && (
                <p className="text-sm text-muted-foreground">
                  Click &quot;Generate summary&quot; to turn your consultation log into
                  one clear narrative.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}