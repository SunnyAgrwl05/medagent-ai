export type AgentId =
  | "symptom"
  | "report"
  | "medicine"
  | "voice"
  | "summary";

export interface AgentMeta {
  id: AgentId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  gradient: string;
  href: string;
}

export type UrgencyLevel = "low" | "moderate" | "high" | "emergency";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  agent?: AgentId;
  urgency?: UrgencyLevel;
  attachments?: ChatAttachment[];
  isStreaming?: boolean;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: "image" | "pdf" | "audio";
  url: string;
  mimeType: string;
}

export interface SymptomAssessment {
  possibleConditions: {
    name: string;
    likelihood: "low" | "moderate" | "high";
    explanation: string;
  }[];
  urgency: UrgencyLevel;
  followUpQuestions: string[];
  recommendation: string;
  redFlags: string[];
}

export interface LabValue {
  test: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "low" | "high" | "critical";
  explanation: string;
}

export interface ReportAnalysis {
  summary: string;
  values: LabValue[];
  abnormalCount: number;
  overallImpression: string;
  suggestedActions: string[];
}

export interface MedicineInfo {
  name: string;
  genericName: string;
  composition: string[];
  uses: string[];
  dosage: string;
  precautions: string[];
  sideEffects: string[];
  interactions: string[];
  disclaimer: string;
}

export interface HealthSummary {
  period: string;
  totalConsultations: number;
  topConcerns: string[];
  overallTrend: "improving" | "stable" | "worsening" | "insufficient-data";
  narrative: string;
  recommendations: string[];
}

export interface HealthStat {
  label: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon: string;
}

export interface ActivityItem {
  id: string;
  agent: AgentId;
  title: string;
  description: string;
  timestamp: string;
  urgency?: UrgencyLevel;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}




