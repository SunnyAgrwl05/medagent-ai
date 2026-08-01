import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function generateId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export const urgencyColor: Record<string, string> = {
  low: "text-success bg-success/10 border-success/20",
  moderate: "text-warning bg-warning/10 border-warning/20",
  high: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  emergency: "text-destructive bg-destructive/10 border-destructive/20",
};

export const urgencyLabel: Record<string, string> = {
  low: "Low urgency",
  moderate: "Moderate urgency",
  high: "High urgency",
  emergency: "Emergency",
};

export function bytesToSize(bytes: number): string {
  const sizes = ["B", "KB", "MB", "GB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export function isImageMime(mime: string): boolean {
  return mime.startsWith("image/");
}

export function isPdfMime(mime: string): boolean {
  return mime === "application/pdf";
}
