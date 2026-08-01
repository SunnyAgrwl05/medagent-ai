import { Part } from "@google/generative-ai";

import {
    AGENT_PROMPTS,
    GeminiChatTurn,
    openGeminiStream,
} from "@/lib/gemini";

import {
    OpenRouterAttachment,
    OpenRouterTurn,
    streamOpenRouterResponse,
} from "@/lib/openrouter";

import {
    AllProvidersExhaustedError,
    getErrorMessage,
} from "@/lib/errors";

import { devLog } from "@/lib/retry";

export type AgentId = keyof typeof AGENT_PROMPTS;

export interface StreamAgentReplyInput {
    agent: AgentId;
    message: string;
    geminiHistory: GeminiChatTurn[];
    geminiParts: Part[];
    openRouterHistory: OpenRouterTurn[];
    attachments?: OpenRouterAttachment[];
}

export async function* streamAgentReply(
    input: StreamAgentReplyInput
): AsyncGenerator<string> {
    const {
        agent,
        message,
        geminiHistory,
        geminiParts,
        openRouterHistory,
        attachments = [],
    } = input;

    let geminiResult: Awaited<
        ReturnType<typeof openGeminiStream>
    > | undefined;

    let geminiError: unknown;

    try {
        geminiResult = await openGeminiStream(
            agent,
            geminiHistory,
            geminiParts
        );
    } catch (err) {
        geminiError = err;

        devLog(
            `[ai-router] Gemini pool exhausted: ${getErrorMessage(err)}`
        );
    }

    if (geminiResult) {
        for await (const chunk of geminiResult.stream) {
            yield chunk.text();
        }
        return;
    }

    try {
        for await (const chunk of streamOpenRouterResponse(
            AGENT_PROMPTS[agent],
            message,
            openRouterHistory,
            attachments
        )) {
            yield chunk;
        }
    } catch (openRouterError) {
        throw new AllProvidersExhaustedError({
            gemini: geminiError,
            openrouter: openRouterError,
        });
    }
}