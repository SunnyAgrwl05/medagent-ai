"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FileScan, UploadCloud, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";
import { bytesToSize } from "@/lib/utils";

export default function ReportsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File too large", { description: "Max size is 10MB." });
      return;
    }
    setFile(f);
    setAnalysis(null);
    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "application/pdf": [] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setAnalysis(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/report-analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis);
      toast.success("Report analyzed", { description: "Your explanation is ready below." });
    } catch (err) {
      toast.error("Couldn't analyze report", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setAnalysis(null);
  };

  return (
    <>
      <Topbar title="Medical Report Agent" />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Understand your lab report in plain language
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a PDF or photo of your blood work, urinalysis, or scan
            summary — every value gets explained, abnormal ones highlighted.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Upload report</CardTitle>
              <CardDescription>PDF or image, up to 10MB.</CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div
                  {...getRootProps()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
                    isDragActive ? "border-teal-500 bg-teal-500/5" : "border-border/60 hover:border-teal-500/40"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20">
                    <UploadCloud className="h-6 w-6 text-teal-400" />
                  </div>
                  <p className="text-sm font-medium">
                    Drag & drop your report here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-teal-400" />
                      <div>
                        <p className="max-w-[200px] truncate text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{bytesToSize(file.size)}</p>
                      </div>
                    </div>
                    <button onClick={reset} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {preview && (
                    <img src={preview} alt="Report preview" className="max-h-64 w-full rounded-xl object-contain" />
                  )}
                  <Button className="w-full" onClick={handleAnalyze} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Analyzing…
                      </>
                    ) : (
                      <>
                        <FileScan className="h-4 w-4" /> Analyze report
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
              <CardDescription>Plain-language breakdown of your values.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}
              <AnimatePresence>
                {analysis && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <MarkdownRenderer content={analysis} />
                  </motion.div>
                )}
              </AnimatePresence>
              {!analysis && !isLoading && (
                <p className="text-sm text-muted-foreground">
                  Your explanation will appear here once you analyze a report.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
