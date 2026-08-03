import { describe, it, expect } from "vitest";
import { getErrorMessage, AllProvidersExhaustedError } from "@/lib/errors";

describe("getErrorMessage", () => {
  it("returns the message for Error instances", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns thrown strings as-is", () => {
    expect(getErrorMessage("just a string")).toBe("just a string");
  });

  it("stringifies arbitrary objects", () => {
    expect(getErrorMessage({ code: 42 })).toBe(JSON.stringify({ code: 42 }));
  });

  it("falls back to String() for non-serializable values", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(getErrorMessage(circular)).toBe(String(circular));
  });
});

describe("AllProvidersExhaustedError", () => {
  it("builds a combined message from both causes", () => {
    const err = new AllProvidersExhaustedError({
      gemini: new Error("quota"),
      openrouter: new Error("timeout"),
    });

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AllProvidersExhaustedError);
    expect(err.message).toContain("All providers exhausted");
    expect(err.message).toContain("Gemini: quota");
    expect(err.message).toContain("OpenRouter: timeout");
    expect(err.gemini).toBeInstanceOf(Error);
    expect(err.openrouter).toBeInstanceOf(Error);
  });

  it("omits missing causes from the message", () => {
    const err = new AllProvidersExhaustedError({ openrouter: new Error("timeout") });
    expect(err.message).not.toContain("Gemini");
    expect(err.message).toContain("OpenRouter: timeout");
  });

  it("keeps the prototype chain intact", () => {
    const err = new AllProvidersExhaustedError({});
    expect(Object.getPrototypeOf(err)).toBe(AllProvidersExhaustedError.prototype);
  });
});
