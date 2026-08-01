export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_10%,transparent_70%)]" />
      <div className="absolute -left-32 top-[-10%] h-[520px] w-[520px] animate-blob rounded-full bg-teal-500/25 blur-[110px]" />
      <div className="absolute right-[-10%] top-[10%] h-[480px] w-[480px] animate-blob rounded-full bg-indigo-500/25 blur-[110px] [animation-delay:2s]" />
      <div className="absolute left-[30%] top-[40%] h-[420px] w-[420px] animate-blob rounded-full bg-emerald-400/15 blur-[110px] [animation-delay:4s]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
    </div>
  );
}
