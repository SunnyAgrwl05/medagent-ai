"use client";

import { useCallback, useRef, useState } from "react";
import { ChatAttachment, ChatMessage, AgentId } from "@/types";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

interface UseChatOptions {
  agent: AgentId;
  initialMessages?: ChatMessage[];
}

export function useChat({ agent, initialMessages = [] }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, attachments: ChatAttachment[] = []) => {
      if (!content.trim() && attachments.length === 0) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
        agent,
        attachments,
      };

      const assistantId = generateId();
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        agent,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent,
            message: content,
            attachments,
            history: messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let urgency: ChatMessage["urgency"];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          for (const line of chunk.split("\n")) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);
              if (parsed.type === "text") {
                accumulated += parsed.value;
              } else if (parsed.type === "urgency") {
                urgency = parsed.value;
              }
            } catch {
              accumulated += line;
            }
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: accumulated, urgency, isStreaming: true }
                : m
            )
          );
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Something went wrong", {
            description: "Couldn't reach MedAgent AI. Please try again.",
          });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      "Sorry, I couldn't process that just now. Please try again in a moment.",
                    isStreaming: false,
                  }
                : m
            )
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [agent, messages]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return { messages, sendMessage, isLoading, stop, clear, setMessages };
}


