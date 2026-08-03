import { describe, it, expect } from "vitest";
import {
  cn,
  formatRelativeTime,
  generateId,
  truncate,
  bytesToSize,
  isImageMime,
  isPdfMime,
} from "@/lib/utils";

describe("formatRelativeTime", () => {
  const now = Date.now();

  it("returns 'just now' for anything under a minute", () => {
    expect(formatRelativeTime(new Date(now - 1000).toISOString())).toBe("just now");
    expect(formatRelativeTime(new Date(now - 59_000).toISOString())).toBe("just now");
  });

  it("returns minutes ago", () => {
    expect(formatRelativeTime(new Date(now - 5 * 60_000).toISOString())).toBe("5m ago");
  });

  it("returns hours ago", () => {
    expect(formatRelativeTime(new Date(now - 3 * 3_600_000).toISOString())).toBe(
      "3h ago"
    );
  });

  it("returns days ago", () => {
    expect(formatRelativeTime(new Date(now - 2 * 86_400_000).toISOString())).toBe(
      "2d ago"
    );
  });

  it("falls back to a short date after 7 days", () => {
    const date = new Date(now - 10 * 86_400_000);
    const expected = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    expect(formatRelativeTime(date.toISOString())).toBe(expected);
  });
});

describe("truncate", () => {
  it("leaves short strings untouched", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long strings with an ellipsis", () => {
    expect(truncate("a very long sentence here", 10)).toBe("a very lon…");
  });

  it("handles empty strings", () => {
    expect(truncate("", 5)).toBe("");
  });
});

describe("bytesToSize", () => {
  it("returns 0 B for zero bytes", () => {
    expect(bytesToSize(0)).toBe("0 B");
  });

  it("formats bytes, KB, and MB", () => {
    expect(bytesToSize(512)).toBe("512.0 B");
    expect(bytesToSize(2048)).toBe("2.0 KB");
    expect(bytesToSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});

describe("mime helpers", () => {
  it("detects image mime types", () => {
    expect(isImageMime("image/png")).toBe(true);
    expect(isImageMime("image/jpeg")).toBe(true);
    expect(isImageMime("application/pdf")).toBe(false);
  });

  it("detects pdf mime type", () => {
    expect(isPdfMime("application/pdf")).toBe(true);
    expect(isPdfMime("image/png")).toBe(false);
  });
});

describe("generateId", () => {
  it("produces a non-empty string", () => {
    expect(generateId().length).toBeGreaterThan(0);
  });

  it("produces unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("cn", () => {
  it("merges conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
