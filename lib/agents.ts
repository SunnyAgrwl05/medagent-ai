import { AgentMeta } from "@/types";

export const AGENTS: AgentMeta[] = [
  {
    id: "symptom",
    name: "Symptom Agent",
    tagline: "Describe how you feel, in your own words",
    description:
      "Asks smart follow-up questions, reasons about possible conditions, and flags urgency level so you know what to do next.",
    icon: "Stethoscope",
    gradient: "from-teal-400 to-emerald-500",
    href: "/dashboard/chat?agent=symptom",
  },
  {
    id: "report",
    name: "Medical Report Agent",
    tagline: "Upload a report, get it explained",
    description:
      "Reads blood work, scans, and lab PDFs — extracts every value and explains what's normal, what's not, and why it matters.",
    icon: "FileScan",
    gradient: "from-indigo-400 to-violet-500",
    href: "/dashboard/reports",
  },
  {
    id: "medicine",
    name: "Medicine Agent",
    tagline: "Snap a photo of any medicine",
    description:
      "Identifies the medicine, explains dosage and precautions, and warns you about interactions before you take it.",
    icon: "Pill",
    gradient: "from-amber-400 to-orange-500",
    href: "/dashboard/medicine",
  },
  {
    id: "voice",
    name: "Voice Agent",
    tagline: "Just talk — hands-free health chat",
    description:
      "Full duplex speech conversation — speak your concern, hear a calm, clear response back, no typing required.",
    icon: "AudioLines",
    gradient: "from-sky-400 to-blue-500",
    href: "/dashboard/voice",
  },
  {
    id: "summary",
    name: "Health Summary Agent",
    tagline: "Your whole health story, summarized",
    description:
      "Pulls every consultation together into one clear narrative with trends and recommendations you can share with your doctor.",
    icon: "ClipboardList",
    gradient: "from-rose-400 to-pink-500",
    href: "/dashboard/summary",
  },
];

export function getAgent(id: string): AgentMeta | undefined {
  return AGENTS.find((a) => a.id === id);
}
