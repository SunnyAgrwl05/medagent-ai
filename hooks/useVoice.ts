"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseVoiceOptions {
  onFinalTranscript?: (text: string) => void;
  lang?: string;
}

export function useVoice({ onFinalTranscript, lang = "en-US" }: UseVoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  onFinalTranscriptRef.current = onFinalTranscript;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    } else {
      setIsSupported(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onresult = (event: any) => {
        let finalText = "";
        let interimText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }

        if (finalText) {
          setTranscript(finalText);
          onFinalTranscriptRef.current?.(finalText);
        } else if (interimText) {
          setTranscript(interimText);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    const audioEl = new Audio();
    audioEl.onplay = () => setIsSpeaking(true);
    audioEl.onended = () => setIsSpeaking(false);
    audioEl.onerror = () => setIsSpeaking(false);
    audioRef.current = audioEl;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
      audioEl.onplay = null;
      audioEl.onended = null;
      audioEl.onerror = null;
      audioEl.pause();
    };
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    audioRef.current?.pause();
    setIsSpeaking(false);
    setTranscript("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // already running, ignore
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const speakWithBrowser = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [lang]
  );

  const speak = useCallback(
    async (text: string) => {
      if (!text || !text.trim()) return;

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          const errBody = await res.text();
          console.error("[useVoice] /api/tts failed:", res.status, errBody);
          throw new Error("TTS API failed");
        }

        const blob = await res.blob();

        if (blob.size === 0) {
          throw new Error("Empty audio returned");
        }

        const url = URL.createObjectURL(blob);
        const audioEl = audioRef.current;
        if (!audioEl) throw new Error("No audio element");

        audioEl.pause();
        audioEl.src = url;
        audioEl.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };

        await audioEl.play();
      } catch (err) {
        console.error("[useVoice] Falling back to browser voice:", err);
        speakWithBrowser(text);
      }
    },
    [speakWithBrowser]
  );

  const stopSpeaking = useCallback(() => {
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}