"use client";

import { useCallback, useState } from "react";
import { generateId } from "@/lib/utils";
import { ChatAttachment } from "@/types";
import { toast } from "sonner";

const MAX_SIZE_MB = 10;

export function useMediaUpload() {
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = useCallback(async (files: File[]) => {
    setIsUploading(true);
    const next: ChatAttachment[] = [];

    for (const file of files) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} is too large`, {
          description: `Max file size is ${MAX_SIZE_MB}MB.`,
        });
        continue;
      }

      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (!isImage && !isPdf) {
        toast.error(`${file.name} isn't supported`, {
          description: "Please upload an image or PDF file.",
        });
        continue;
      }

      const url = URL.createObjectURL(file);
      next.push({
        id: generateId(),
        name: file.name,
        type: isImage ? "image" : "pdf",
        url,
        mimeType: file.type,
      });
    }

    setAttachments((prev) => [...prev, ...next]);
    setIsUploading(false);
    return next;
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAttachments = useCallback(() => setAttachments([]), []);

  return { attachments, addFiles, removeAttachment, clearAttachments, isUploading };
}
