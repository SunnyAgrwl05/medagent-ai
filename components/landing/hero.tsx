"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Stethoscope, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedBackground } from "./animated-background";

const demoScript: { role: "user" | "agent"; text: string; agent?: string }[] = [
  { role: "user", text: "I've had a dull headache and mild fever since this morning." },
  {
    role: "agent",
    agent: "Symptom Agent",
    text: "Got it. Any sensitivity to light, neck stiffness, or nausea alongside the fever?",
  },
  { role: "user", text: "No neck stiffness. Just tired and a bit achy." },
  {
    role: "agent",
    agent: "Symptom Agent",
    text: "Likely a mild viral infection. Urgency: Low. Rest, fluids, and monitor for 24–48h.",
  },
];

function TypingDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (visibleCount >= demoScript.length) {
      const resetTimer = setTimeout(() => {
        setVisibleCount(0);
        setCharIndex(0);
      }, 2400);
      return () => clearTimeout(resetTimer);
    }

    const current = demoScript[visibleCount];
    if (charIndex < current.text.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 14);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setVisibleCount((v) => v + 1);
      setCharIndex(0);
    }, 650);
    return () => clearTimeout(t);
  }, [visibleCount, charIndex]);

  return (
    <div className="flex flex-col gap-3">
      {demoScript.slice(0, visibleCount + 1).map((msg, i) => {
        const isLast = i === visibleCount;
        const text = isLast ? msg.text.slice(0, charIndex) : msg.text;
        return (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-md bg-gradient-to-br from-teal-500 to-indigo-500 text-white"
                  : "rounded-bl-md border border-white/10 bg-white/5 text-foreground"
              }`}
            >
              {msg.agent && (
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-teal-300">
                  <Bot className="h-3 w-3" /> {msg.agent}
                </div>
              )}
              {text}
              {isLast && charIndex < msg.text.length && (
                <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-caret-blink bg-current align-middle" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28">
      <AnimatedBackground />
      <div className="container grid items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Got a health question at
            <br />
            <span className="text-gradient">2 in the morning?</span>
            <br />
            We've got you covered.
          </h1>

          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Tell it what's bothering you, upload a lab report, snap a photo
            of a medicine strip, or just talk it out — MedAgent AI walks
            through it with you and keeps a running picture of your health
            over time.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start free consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="glass" asChild>
              <Link href="#agents">See what it can do</Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            Meant to inform, not diagnose — always check with a real doctor for anything serious.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-teal-500/20 to-indigo-500/20 blur-2xl" />
          <div className="glass-strong animate-float rounded-[1.75rem] p-5 shadow-2xl shadow-black/20 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500">
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">Symptom Agent</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> chatting now
                  </p>
                </div>
              </div>
              <Badge variant="success">Low urgency</Badge>
            </div>
            <TypingDemo />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
