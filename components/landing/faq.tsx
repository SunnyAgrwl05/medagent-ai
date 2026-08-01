"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Can this replace my doctor?",
    a: "No, and it won't try to. It's here to help you understand what's going on and how urgent it might be — but for anything real, please see an actual clinician.",
  },
  {
    q: "What's it actually running on?",
    a: "All five agents are powered by Google's Gemini, picked mainly because it's fast even with images and PDFs thrown in, so the chat doesn't feel like it's thinking forever.",
  },
  {
    q: "Can I just upload my blood test PDF?",
    a: "Yep. It pulls the values out of the PDF or photo, checks them against normal ranges, and tells you in plain words what's off and what isn't.",
  },
  {
    q: "How does talking to it work?",
    a: "Your browser handles turning your voice into text, that gets sent over, and the reply is read back out loud — so it's a real back-and-forth, hands-free.",
  },
  {
    q: "Is my data actually private?",
    a: "Everything's tied to your own account with row-level security in the database, so nobody else can see your conversations — not even us, casually.",
  },
  {
    q: "Does it cost anything?",
    a: "Not right now — this is a hackathon build, so everything's free while the demo period runs. Sign up and you'll get full access.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            FAQ
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Questions people usually ask
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-2xl divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40">
          {faqs.map((item, i) => (
            <div key={item.q} className="px-6">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium">{item.q}</span>
                <Plus
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                    open === i && "rotate-45 text-teal-400"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
