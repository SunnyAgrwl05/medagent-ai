"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Mic, Paperclip, Send, Square, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useVoice } from "@/hooks/useVoice";
import { ChatAttachment } from "@/types";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string, attachments: ChatAttachment[]) => void;
  isLoading: boolean;
  onStop: () => void;
  placeholder?: string;
  allowAttachments?: boolean;
}

export function ChatInput({
  onSend,
  isLoading,
  onStop,
  placeholder = "Describe what you're feeling…",
  allowAttachments = true,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { attachments, addFiles, removeAttachment, clearAttachments } = useMediaUpload();
  const { isListening, startListening, stopListening, isSupported } = useVoice({
    onFinalTranscript: (text) => setValue((prev) => (prev ? `${prev} ${text}` : text)),
  });

  const onDrop = useCallback(
    (accepted: File[]) => {
      addFiles(accepted);
    },
    [addFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { "image/*": [], "application/pdf": [] },
  });

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return;
    onSend(value, attachments);
    setValue("");
    clearAttachments();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative rounded-2xl border border-border/60 bg-card/80 p-3 shadow-lg backdrop-blur transition-colors",
        isDragActive && "border-teal-500 bg-teal-500/5"
      )}
    >
      <input {...getInputProps()} />

      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative flex items-center gap-2 rounded-lg border border-border/60 bg-muted px-2.5 py-1.5 text-xs"
            >
              {att.type === "image" ? (
                <img src={att.url} alt={att.name} className="h-6 w-6 rounded object-cover" />
              ) : (
                <FileText className="h-4 w-4 text-teal-400" />
              )}
              <span className="max-w-[120px] truncate">{att.name}</span>
              <button onClick={() => removeAttachment(att.id)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        {allowAttachments && (
          <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
            <Paperclip className="h-4 w-4" />
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
            />
          </label>
        )}

        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="max-h-32 min-h-[40px] flex-1 resize-none border-none bg-transparent px-2 py-2 shadow-none focus-visible:ring-0"
        />

        {isSupported && (
          <Button
            type="button"
            variant={isListening ? "default" : "ghost"}
            size="icon"
            onClick={isListening ? stopListening : startListening}
            className={cn(isListening && "relative")}
            aria-label="Voice input"
          >
            {isListening && (
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-teal-400" />
            )}
            <Mic className="relative h-4 w-4" />
          </Button>
        )}

        {isLoading ? (
          <Button type="button" variant="destructive" size="icon" onClick={onStop}>
            <Square className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button type="button" size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
