"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Stethoscope, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Agents", href: "#agents" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div
        className={cn(
          "container flex items-center justify-between rounded-2xl px-4 py-2 transition-all duration-300",
          scrolled && "glass shadow-lg shadow-black/5"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500 shadow-lg shadow-teal-500/30">
            <Stethoscope className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">
            MedAgent<span className="text-gradient"> AI</span>
          </span>
        </Link>

        <nav className="hidden items-center md:flex">
          <div className="relative flex items-center">
            {/* static background line connecting all dots */}
            <div className="absolute left-[59px] right-[59px] top-[7px] h-px bg-border" />

            {/* glowing trail that fills up to the traveling indicator */}
            <motion.div
              className="absolute top-[7px] h-px origin-left bg-gradient-to-r from-teal-400 to-indigo-400"
              style={{ left: 59 }}
              animate={{
                width: hoveredIndex === null ? 0 : hoveredIndex * 118,
                opacity: hoveredIndex === null ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* traveling glowing indicator dot */}
            <motion.div
              className="pointer-events-none absolute top-[7px] z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400 shadow-[0_0_12px_3px_rgba(45,212,191,0.7)]"
              animate={{
                left: hoveredIndex === null ? 59 : 59 + hoveredIndex * 118,
                opacity: hoveredIndex === null ? 0 : 1,
                scale: hoveredIndex === null ? 0.5 : 1,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
            />

            {links.map((link, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative flex w-[118px] flex-col items-center gap-2 py-2 [perspective:600px]"
                >
                  <span
                    className={cn(
                      "relative z-10 h-2 w-2 rounded-full border transition-all duration-300",
                      isHovered
                        ? "scale-125 border-teal-400 bg-teal-400"
                        : "border-muted-foreground/40 bg-background"
                    )}
                  />
                  <motion.span
                    animate={{
                      rotateX: isHovered ? -8 : 0,
                      y: isHovered ? -2 : 0,
                      scale: isHovered ? 1.06 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isHovered ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <SignedOut>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get started free</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        <button
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mt-2 rounded-2xl glass p-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3">
              <ThemeToggle />
              <SignedOut>
                <Button variant="ghost" asChild className="flex-1">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild className="flex-1">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}