"use client";

import { motion } from "framer-motion";
import { Bot, FileText, User } from "lucide-react";
import { ChatMessage } from "@/types";
import { MarkdownRenderer } from "./markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { urgencyColor, urgencyLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3", isUser && "flex-row-reverse")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-gradient-to-br from-slate-500 to-slate-600"
            : "bg-gradient-to-br from-teal-400 to-indigo-500"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser && "items-end")}>
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att) =>
              att.type === "image" ? (
                <img
                  key={att.id}
                  src={att.url}
                  alt={att.name}
                  className="h-24 w-24 rounded-xl border border-border/60 object-cover"
                />
              ) : (
                <div
                  key={att.id}
                  className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted px-3 py-2 text-xs"
                >
                  <FileText className="h-4 w-4 text-teal-400" />
                  {att.name}
                </div>
              )
            )}
          </div>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "rounded-tr-sm bg-gradient-to-br from-teal-500 to-indigo-500 text-white"
              : "rounded-tl-sm border border-border/60 bg-card"
          )}
        >
          {message.isStreaming && !message.content ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {message.urgency && (
          <Badge variant="outline" className={urgencyColor[message.urgency]}>
            {urgencyLabel[message.urgency]}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
