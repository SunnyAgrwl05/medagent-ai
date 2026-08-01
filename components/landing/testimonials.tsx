"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sunny",
    role: "Caregiver",
    quote:
      "I uploaded my dad's blood report at 11 at night and could finally make sense of what 'elevated creatinine' meant, before our appointment the next morning.",
    initials: "SN",
  },
  {
    name: "Abhijit",
    role: "Software Engineer",
    quote:
      "It caught that I was about to take the same medicine twice under two different brand names. Small thing, but genuinely saved me trouble.",
    initials: "AB",
  },
  {
    name: "Alok",
    role: "New parent",
    quote:
      "Talking instead of typing at 3 AM with a crying kid made all the difference. It walked me through what to keep an eye on, calmly.",
    initials: "AL",
  },
  {
    name: "Shrestha",
    role: "Fitness coach",
    quote:
      "Six months of random symptom checks turned into one clear summary. My doctor actually asked where I got it from.",
    initials: "SH",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-teal-400">
            What people are saying
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            The kind of questions you'd normally Google at 2 AM
          </h2>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full border-border/60 bg-card/60 p-6 backdrop-blur">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-teal-400 text-teal-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  "{t.quote}"
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{t.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-none">{t.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
