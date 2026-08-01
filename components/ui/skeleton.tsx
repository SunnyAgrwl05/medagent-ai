import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
