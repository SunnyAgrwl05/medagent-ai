import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Part } from "@google/generative-ai";
import { streamAgentReply } from "@/lib/ai-router";
import { GeminiChatTurn } from "@/lib/gemini";
import { OpenRouterAttachment, OpenRouterTurn } from "@/lib/openrouter";
import { AgentId } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatRequestBody {
  agent: AgentId;
  message: string;
  attachments?: { url: string; mimeType: string; type: string; name: string }[];
  history?: { role: string; content: string }[];
}

const VALID_AGENTS: AgentId[] = ["symptom", "report", "medicine", "voice", "summary"];


function detectUrgency(text: string): string | undefined {
  const lower = text.toLowerCase();

  const match = lower.match(/urgency\s*(?:level)?\s*:?\s*\*{0,2}\s*(low|moderate|high|emergency)/i);
  if (match) {
    return match[1];
  }

  return undefined;
}

async function fetchAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body: ChatRequestBody = await req.json();
    const { agent, message, attachments = [], history = [] } = body;

    if (!VALID_AGENTS.includes(agent)) {
      return new Response(JSON.stringify({ error: "Invalid agent" }), { status: 400 });
    }
    if (!message?.trim() && attachments.length === 0) {
      return new Response(JSON.stringify({ error: "Empty message" }), { status: 400 });
    }

    // ── Gemini-shaped history/parts (unchanged from original logic) ──
    const geminiHistory: GeminiChatTurn[] = history
      .filter((h) => h.role === "user" || h.role === "assistant")
      .map((h) => ({
        role: h.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: h.content }],
      }));

    // ── OpenRouter-shaped history, built in parallel for fallback use ──
    const openRouterHistory: OpenRouterTurn[] = history
      .filter((h) => h.role === "user" || h.role === "assistant")
      .map((h) => ({
        role: h.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: h.content,
      }));

    const geminiParts: Part[] = [];
    const openRouterAttachments: OpenRouterAttachment[] = [];

    if (message?.trim()) geminiParts.push({ text: message });

    for (const att of attachments) {
      if (att.type === "image" || att.type === "pdf") {
        try {
          const base64 = await fetchAsBase64(att.url);
          geminiParts.push({ inlineData: { data: base64, mimeType: att.mimeType } });
          openRouterAttachments.push({ base64, mimeType: att.mimeType });
        } catch {
          // skip attachment that failed to fetch
        }
      }
    }

    const encoder = new TextEncoder();
    let fullText = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunkText of streamAgentReply({
            agent,
            message,
            geminiHistory,
            geminiParts,
            openRouterHistory,
            attachments: openRouterAttachments,
          })) {
            fullText += chunkText;
            controller.enqueue(
              encoder.encode(JSON.stringify({ type: "text", value: chunkText }) + "\n")
            );
          }
          const urgency = detectUrgency(fullText);
          if (urgency) {
            controller.enqueue(
              encoder.encode(JSON.stringify({ type: "urgency", value: urgency }) + "\n")
            );
          }
          controller.close();
        } catch (err) {
          console.error("[/api/chat] stream error:", err);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "text",
                value: "\n\nSorry, something interrupted the response. Please try again.",
              }) + "\n"
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("[/api/chat] error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong processing your request." }),
      { status: 500 }
    );
  }
}