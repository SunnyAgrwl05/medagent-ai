import { getErrorMessage } from "./errors";

export function devLog(...args: unknown[]) {
    if (process.env.NODE_ENV !== "production") {
        console.log(...args);
    }
}

export async function withKeyRotation<T>(
    keys: string[],
    provider: string,
    fn: (key: string, keyNumber: number) => Promise<T>
): Promise<T> {
    let lastError: unknown;

    for (let i = 0; i < keys.length; i++) {
        try {
            devLog(`[${provider}] Using Key ${i + 1}`);
            return await fn(keys[i], i + 1);
        } catch (err) {
            lastError = err;
            devLog(
                `[${provider}] Key ${i + 1} failed: ${getErrorMessage(err)}`
            );

            if (i < keys.length - 1) {
                devLog(`[${provider}] Switching to Key ${i + 2}`);
            }
        }
    }

    throw lastError ?? new Error(`${provider}: All keys failed.`);
}