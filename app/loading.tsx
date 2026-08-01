export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-teal-500/20 border-t-teal-500" />
        </div>
        <p className="text-sm text-muted-foreground">Loading MedAgent AI…</p>
      </div>
    </div>
  );
}
