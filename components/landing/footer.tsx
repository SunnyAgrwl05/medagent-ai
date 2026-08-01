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
    <footer className="relative border-t border-border/60 bg-background">
      {/* Subtle top gradient line + background wash for visual separation from page content */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-teal-500/[0.03] via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Newsletter — kept visually separate from the link grid below */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 rounded-2xl border border-border/60 bg-gradient-to-br from-teal-500/10 to-indigo-500/10 p-6 sm:p-8"
        >
          <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
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
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-indigo-500">
                <UserRound className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-base font-bold">MedAgent AI</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Built for people who'd rather understand what's going on before
              their next appointment than sit with a vague worry — never
              meant to replace an actual doctor.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {/* TODO: swap with your real GitHub URL if this changes */}

              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all duration-200 hover:border-teal-500/40 hover:text-teal-400 hover:-translate-y-0.5"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
              {/* TODO: swap with your real Twitter/X URL if this changes */}
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all duration-200 hover:border-teal-500/40 hover:text-teal-400 hover:-translate-y-0.5"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>

              {/* TODO: swap with your real LinkedIn URL if this changes */}
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all duration-200 hover:border-teal-500/40 hover:text-teal-400 hover:-translate-y-0.5"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Agents</h4>
            <ul className="mt-3.5 space-y-2.5">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <s.icon className="h-3.5 w-3.5 text-teal-400 transition-transform group-hover:translate-x-0.5" />
                    <span className="transition-transform group-hover:translate-x-0.5">{s.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground/70">Product</h4>
            <ul className="mt-3.5 space-y-2.5">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="mt-5 text-xs font-semibold uppercase tracking-wide text-foreground/70">Legal</h4>
            <ul className="mt-3.5 space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div >
        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} MedAgent AI. Built by{" "}
            <span className="font-medium text-foreground">Sunny</span>, GDG
            Co-Organizer & Tech Lead — for hackathon demo purposes.
          </p>

          <p>
            Not a substitute for professional medical advice, diagnosis, or
            treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}