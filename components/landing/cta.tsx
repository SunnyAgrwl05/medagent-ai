"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-teal-600/20 via-card to-indigo-600/20 px-8 py-16 text-center shadow-2xl"
        >
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/30 blur-[100px]" />
          <h2 className="relative font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Stop scrolling through forums for
            <span className="text-gradient"> answers</span> — just ask.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            Sign up for free and start your first conversation in under a
            minute. No forms, no waiting.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start free consultation <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
