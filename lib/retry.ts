import { getErrorMessage } from "@/lib/errors";

export function devLog(...args: unknown[]): void {
   if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log(...args);
   }
}

export class AllKeysExhaustedError extends Error {
   public readonly provider: string;
   public readonly cause?: unknown;

   constructor(provider: string, cause?: unknown) {
      const suffix = cause !== undefined ? `: ${getErrorMessage(cause)}` : "";
      super(`${provider}: all API keys exhausted or none configured${suffix}`);
      this.name = "AllKeysExhaustedError";
      this.provider = provider;
      this.cause = cause;
      Object.setPrototypeOf(this, AllKeysExhaustedError.prototype);
   }
}

export async function withKeyRotation<T>(
   keys: string[],
   providerName: string,
   fn: (key: string, keyNumber: number) => Promise<T>
): Promise<T> {
   if (keys.length === 0) {
      throw new AllKeysExhaustedError(providerName);
   }

   let lastError: unknown;

   for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const keyNumber = i + 1;

      try {
         return await fn(key, keyNumber);
      } catch (err) {
         lastError = err;
         devLog(
            `[${providerName}] key #${keyNumber} failed: ${getErrorMessage(
               err
            )} — trying next key`
         );
      }
   }

   throw new AllKeysExhaustedError(providerName, lastError);
}
