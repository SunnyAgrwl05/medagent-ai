import { describe, it, expect, vi } from "vitest";
import { withKeyRotation, AllKeysExhaustedError } from "@/lib/retry";

describe("withKeyRotation", () => {
  it("uses the first key when it succeeds", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await withKeyRotation(["k1", "k2"], "provider", fn);

    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("k1", 1);
  });

  it("falls back to the next key when the first fails", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("rate limited"))
      .mockResolvedValueOnce("ok");

    const result = await withKeyRotation(["k1", "k2"], "provider", fn);

    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, "k2", 2);
  });

  it("throws AllKeysExhaustedError when every key fails", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("down"));

    await expect(withKeyRotation(["k1", "k2"], "provider", fn)).rejects.toBeInstanceOf(
      AllKeysExhaustedError
    );
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws immediately when no keys are configured", async () => {
    const fn = vi.fn();

    await expect(withKeyRotation([], "provider", fn)).rejects.toBeInstanceOf(
      AllKeysExhaustedError
    );
    expect(fn).not.toHaveBeenCalled();
  });

  it("exposes the provider name on the error", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("down"));

    const err = await withKeyRotation(["k1"], "gemini", fn).catch((e: unknown) => e);

    expect(err).toBeInstanceOf(AllKeysExhaustedError);
    expect((err as AllKeysExhaustedError).provider).toBe("gemini");
  });

  it("attaches the last underlying error as the cause", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("final failure"));

    const err = await withKeyRotation(["k1", "k2"], "provider", fn).catch(
      (e: unknown) => e
    );

    expect((err as AllKeysExhaustedError).cause).toEqual(new Error("final failure"));
  });
});
