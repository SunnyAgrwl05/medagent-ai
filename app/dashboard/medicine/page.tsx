"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, UploadCloud, X, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function MedicinePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [medicineName, setMedicineName] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Image too large", { description: "Max size is 10MB." });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setAnalysis(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleScan = async () => {
    if (!file && !medicineName.trim()) {
      toast.error("Nothing to scan", { description: "Upload a photo or type a medicine name." });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (medicineName.trim()) formData.append("medicineName", medicineName.trim());
      const res = await fetch("/api/medicine-scan", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setAnalysis(data.analysis);
      toast.success("Medicine identified");
    } catch (err) {
      toast.error("Couldn't identify medicine", {
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
      <Topbar title="Medicine Agent" />
      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Know exactly what you&apos;re taking
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Photograph a strip, bottle, or box — or just type the name — for
            dosage, precautions, and interactions.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Identify medicine</CardTitle>
              <CardDescription>Choose a photo or type the name.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="photo">
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="photo">Photo</TabsTrigger>
                  <TabsTrigger value="name">Type name</TabsTrigger>
                </TabsList>

                <TabsContent value="photo">
                  {!file ? (
                    <div
                      {...getRootProps()}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
                        isDragActive ? "border-teal-500 bg-teal-500/5" : "border-border/60 hover:border-teal-500/40"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20">
                        <UploadCloud className="h-6 w-6 text-orange-400" />
                      </div>
                      <p className="text-sm font-medium">
                        Drag & drop a medicine photo, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Best results: clear photo of the label/strip
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <img src={preview!} alt="Medicine preview" className="max-h-64 w-full rounded-xl object-contain" />
                        <button
                          onClick={reset}
                          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="name">
                  <Input
                    placeholder="e.g. Azithromycin 500mg"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                  />
                </TabsContent>
              </Tabs>

              <Button className="mt-4 w-full" onClick={handleScan} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Identifying…
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" /> Identify medicine
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Dosage, precautions, and side effects.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              )}
              <AnimatePresence>
                {analysis && !isLoading && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
                      <Pill className="h-6 w-6 text-white" />
                    </div>
                    <MarkdownRenderer content={analysis} />
                  </motion.div>
                )}
              </AnimatePresence>
              {!analysis && !isLoading && (
                <p className="text-sm text-muted-foreground">
                  Details will appear here once you identify a medicine.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
