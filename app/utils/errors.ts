export class AllProvidersExhaustedError extends Error {
  details?: unknown;

  constructor(details?: unknown) {
    super("All AI providers failed.");
    this.name = "AllProvidersExhaustedError";
    this.details = details;
  }
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}