/**
 * Safely extracts a human-readable message from any thrown value.
 * Handles Error instances, strings, and arbitrary thrown objects.
 */
export function getErrorMessage(error: unknown): string {
   if (error instanceof Error) return error.message;
   if (typeof error === "string") return error;

   try {
      return JSON.stringify(error);
   } catch {
      return String(error);
   }
}

export interface AllProvidersExhaustedErrorCauses {
   gemini?: unknown;
   openrouter?: unknown;
}

/**
 * Thrown by streamAgentReply when both the Gemini key pool and the
 * OpenRouter fallback have failed. Carries both underlying causes so
 * callers/logs can see why each provider failed.
 */
export class AllProvidersExhaustedError extends Error {
   public readonly gemini?: unknown;
   public readonly openrouter?: unknown;

   constructor(causes: AllProvidersExhaustedErrorCauses) {
      const parts: string[] = [];
      if (causes.gemini !== undefined) {
         parts.push(`Gemini: ${getErrorMessage(causes.gemini)}`);
      }
      if (causes.openrouter !== undefined) {
         parts.push(`OpenRouter: ${getErrorMessage(causes.openrouter)}`);
      }

      super(
         `All providers exhausted.${parts.length ? " " + parts.join(" | ") : ""}`
      );

      this.name = "AllProvidersExhaustedError";
      this.gemini = causes.gemini;
      this.openrouter = causes.openrouter;

      // Maintain proper prototype chain when compiled down.
      Object.setPrototypeOf(this, AllProvidersExhaustedError.prototype);
   }
}