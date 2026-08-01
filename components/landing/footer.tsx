"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  UserRound,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Send,
  Loader2,
  Stethoscope,
  FileScan,
  Pill,
  AudioLines,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SOCIAL_LINKS = {
  github: "https://github.com/SunnyAgrwl05",
  twitter: "https://x.com/SunnyTechLead",
  linkedin: "https://www.linkedin.com/in/sunny-kumar-a06484297",
  instagram: "https://www.instagram.com/upskillyfy/",
};

const services = [
  { label: "Symptom Agent", href: "/dashboard/chat?agent=symptom", icon: Stethoscope },
  { label: "Report Agent", href: "/dashboard/reports", icon: FileScan },
  { label: "Medicine Agent", href: "/dashboard/medicine", icon: Pill },
  { label: "Voice Agent", href: "/dashboard/voice", icon: AudioLines },
  { label: "Health Summary", href: "/dashboard/summary", icon: ClipboardList },
];

const productLinks = [
  { label: "Agents", href: "#agents" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "FAQ", href: "#faq" },
];

const legalLinks = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Medical disclaimer", href: "/disclaimer" },
];

// Shared style for footer nav links — permanently tinted pill, not hover-only,
// so the active/recognizable state is always visible.
const navLinkClass =
  "group -ml-2.5 flex w-fit items-center gap-2 rounded-md bg-teal-500/10 px-2.5 py-1.5 text-sm text-teal-300 transition-colors duration-150 hover:bg-teal-500/20 hover:text-teal-200";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");
      toast.success("You're in! We'll let you know when something new ships.");
      setEmail("");
    } catch (err) {
      toast.error("Couldn't subscribe", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background">
      {/* Top hairline + dual aurora glow for a more distinctive, modern backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-[8%] h-[420px] w-[480px] rounded-full bg-teal-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -top-40 right-[8%] h-[420px] w-[480px] rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Newsletter — gradient-bordered glass card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 rounded-2xl bg-gradient-to-r from-teal-500/50 via-indigo-500/25 to-white/5 p-px"
        >
          <div className="flex flex-col items-start justify-between gap-5 rounded-[15px] bg-background/95 p-6 backdrop-blur-sm lg:flex-row lg:items-center sm:p-8">
            <div>
              <h3 className="font-display text-lg font-bold sm:text-xl">Want to hear when we ship something new?</h3>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                Drop your email — we'll only reach out when there's an actual new agent or feature, nothing else.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="h-10 flex-1"
              />
              <Button type="submit" disabled={isSubmitting} className="h-10 shrink-0">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Subscribe
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Link grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-b border-border/60 pb-10 sm:grid-cols-4 lg:gap-x-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-indigo-500 shadow-[0_0_0_1px_rgba(45,212,191,0.3),0_6px_20px_-6px_rgba(45,212,191,0.5)]">
                <UserRound className="h-4 w-4 text-white" />
              </div>
              <span className="font-display bg-gradient-to-br from-foreground to-teal-300 bg-clip-text text-base font-bold text-transparent">
                MedAgent AI
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Built for people who'd rather understand what's going on before
              their next appointment than sit with a vague worry — never
              meant to replace an actual doctor.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#24292e] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#33383f]"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-neutral-800"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a66c2] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#0b75dd]"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[radial-gradient(circle_at_30%_110%,_#fdf497_0%,_#fdf497_5%,_#fd5949_45%,_#d6249f_60%,_#285AEB_90%)] text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Agents</h4>
            <ul className="mt-3.5 space-y-2">
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className={navLinkClass}>
                    <s.icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Product</h4>
            <ul className="mt-3.5 space-y-2">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={navLinkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-foreground/70">Legal</h4>
            <ul className="mt-3.5 space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={navLinkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} MedAgent AI. Built by{" "}
            <span className="font-medium text-teal-400">Sunny</span>, GDG
            Co-Organizer & Tech Lead — for hackathon demo purposes.
          </p>

          <p>
            Not a doctor. Not a diagnosis. Just a starting point for your next
            conversation with one.
          </p>
        </div>
      </div>
    </footer>
  );
}