"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Volume2, VolumeX, AlertCircle } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageBubble } from "@/components/chat/message-bubble";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";
import { cn } from "@/lib/utils";

export default function VoicePage() {
  const { messages, sendMessage, isLoading } = useChat({ agent: "voice" });
  const [lastSpokenId, setLastSpokenId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice({
    onFinalTranscript: (text) => {
      if (text.trim()) sendMessage(text.trim());
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (
      lastAssistant &&
      !lastAssistant.isStreaming &&
      lastAssistant.content &&
      lastAssistant.id !== lastSpokenId
    ) {
      speak(lastAssistant.content.replace(/[*_#`]/g, ""));
      setLastSpokenId(lastAssistant.id);
    }
  }, [messages, lastSpokenId, speak]);

  return (
    <>
      <Topbar title="Voice Agent" />
      <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Talk it through, hands-free
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Press the mic, describe how you feel, and MedAgent AI will speak
            back its response.
          </p>
        </div>

        {!isSupported && (
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
              <p className="text-sm text-warning">
                Your browser doesn&apos;t support speech recognition. Try Chrome or
                Edge, or use the text chat instead.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="flex flex-col items-center justify-center gap-6 border-border/60 bg-card/60 p-8 backdrop-blur">
            <div className="relative flex h-32 w-32 items-center justify-center">
              {isListening && (
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-teal-400" />
              )}
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={!isSupported}
                className={cn(
                  "flex h-24 w-24 items-center justify-center rounded-full shadow-xl transition-all",
                  isListening
                    ? "bg-gradient-to-br from-rose-500 to-red-600"
                    : "bg-gradient-to-br from-teal-500 to-indigo-500 hover:scale-105"
                )}
              >
                <Mic className="h-9 w-9 text-white" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isListening ? "Listening…" : isLoading ? "Thinking…" : "Tap to speak"}
              </p>
              {transcript && (
                <p className="mt-2 max-w-[220px] text-xs italic text-muted-foreground">
                  &quot;{transcript}&quot;
                </p>
              )}
            </div>

            <Button
              variant="glass"
              size="sm"
              onClick={isSpeaking ? stopSpeaking : undefined}
              disabled={!isSpeaking}
              className="gap-2"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4" /> Stop speaking
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" /> Not speaking
                </>
              )}
            </Button>
          </Card>

          <div
            ref={scrollRef}
            className="space-y-6 overflow-y-auto rounded-2xl border border-border/60 bg-card/30 p-4 backdrop-blur scrollbar-thin sm:p-6"
            style={{ minHeight: "50vh", maxHeight: "62vh" }}
          >
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground"
              >
                Your conversation will appear here as you speak.
              </motion.div>
            ) : (
              messages.map((m) => <MessageBubble key={m.id} message={m} />)
            )}
          </div>
        </div>
      </main>
    </>
  );
}
