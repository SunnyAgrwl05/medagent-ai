"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { AgentSelector } from "@/components/chat/agent-selector";
import { MessageBubble } from "@/components/chat/message-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import { useChat } from "@/hooks/useChat";
import { AgentId } from "@/types";
import { getAgent } from "@/lib/agents";

const placeholders: Record<AgentId, string> = {
  symptom: "Describe what you're feeling — e.g. 'I've had a sore throat since yesterday'",
  report: "Paste a description, or attach a PDF/image of your report below",
  medicine: "Type a medicine name, or attach a photo below",
  voice: "Type or use the mic to talk",
  summary: "Ask me to summarize your health history",
};

function ChatPageInner() {
  const searchParams = useSearchParams();
  const initialAgent = (searchParams.get("agent") as AgentId) || "symptom";
  const [agent, setAgent] = useState<AgentId>(initialAgent);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading, stop, clear } = useChat({ agent });

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const agentMeta = getAgent(agent);

  return (
    <>
      <Topbar title="AI Chat" />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8">
        <AgentSelector active={agent} onChange={setAgent} />

        <div
          ref={scrollRef}
          className="flex-1 space-y-6 overflow-y-auto rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur scrollbar-thin sm:p-6"
          style={{ minHeight: "50vh", maxHeight: "62vh" }}
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20">
                <Sparkles className="h-6 w-6 text-teal-400" />
              </div>
              <p className="font-display text-lg font-semibold">
                {agentMeta?.name ?? "MedAgent AI"}
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {agentMeta?.description}
              </p>
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
        </div>

        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
          onStop={stop}
          placeholder={placeholders[agent]}
        />
      </main>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatPageInner />
    </Suspense>
  );
}
