import { devLog } from "@/lib/retry";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL =
    process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

export interface OpenRouterAttachment {
    base64: string;
    mimeType: string;
}

export interface OpenRouterTurn {
    role: "user" | "assistant";
    content: string;
}

type ORContentPart =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } };
/**
 * Async generator so the route can forward chunks the same way it forwards
 * Gemini chunks — the frontend never knows the provider changed.
 */
export async function* streamOpenRouterResponse(
    systemInstruction: string,
    prompt: string,
    history: OpenRouterTurn[],
    attachments: OpenRouterAttachment[] = []
): AsyncGenerator<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY is not configured");
    }

    devLog("[OpenRouter] Using OpenRouter");

    const userContent: ORContentPart[] = [];
    if (prompt.trim()) userContent.push({ type: "text", text: prompt });
    for (const att of attachments) {
        if (att.mimeType.startsWith("image/")) {
            userContent.push({
                type: "image_url",
                image_url: { url: `data:${att.mimeType};base64,${att.base64}` },
            });
        }
        // Non-image attachments (e.g. PDFs) aren't forwarded to the OpenRouter
        // fallback — vision-only models can't consume them the way Gemini can.
    }

    const messages = [
        { role: "system" as const, content: systemInstruction },
        ...history,
        { role: "user" as const, content: userContent },
    ];

    const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "MedAgent AI",
        },
        body: JSON.stringify({ model: OPENROUTER_MODEL, messages, stream: true }),
    });

    if (!response.ok || !response.body) {
        const errText = await response.text().catch(() => "");
        const error = new Error(`OpenRouter request failed: ${errText}`) as Error & {
            status?: number;
        };
        error.status = response.status;
        throw error;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") return;

            try {
                const parsed = JSON.parse(payload);
                const delta: string | undefined = parsed?.choices?.[0]?.delta?.content;
                if (delta) yield delta;
            } catch {
                // ignore malformed/partial SSE chunk
            }
        }
    }
}

