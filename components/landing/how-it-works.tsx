"use client";

import { motion } from "framer-motion";
import { MessageSquarePlus, Brain, FileHeart } from "lucide-react";

const steps = [
  {
    icon: MessageSquarePlus,
    title: "Say what's going on",
    description:
      "Type it, say it out loud, or upload something — a symptom, a lab report, or a photo of a medicine strip.",
  },
  {
    icon: Brain,
    title: "It actually thinks it through",
    description:
      "The right agent picks up the conversation, asks the follow-ups a real person would, and gives you a straight answer.",
  },
  {
    icon: FileHeart,
    title: "It remembers, so you don't have to",
    description:
      "Every conversation adds to your health picture, so patterns show up over weeks and months instead of getting lost.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            How it works
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            No waiting rooms, no appointments
          </h2>
        </div>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-lg">
                <step.icon className="h-7 w-7 text-teal-400" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
