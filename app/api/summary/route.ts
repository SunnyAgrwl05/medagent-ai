import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { buildAgentModel } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

interface HistoryEntry {
  agent: string;
  title: string;
  description: string;
  date: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: { history?: HistoryEntry[] } = await req.json();
    const history = body.history ?? [];

    if (history.length === 0) {
      return NextResponse.json({
        analysis:
          "You don't have any consultations logged yet. Once you talk to the Symptom, Report, or Medicine agents a few times, come back here for a complete summary of your health story.",
      });
    }

    const model = buildAgentModel("summary");
    const logText = history
      .map((h, i) => `${i + 1}. [${h.agent}] ${h.title} (${h.date}) — ${h.description}`)
      .join("\n");

    const result = await model.generateContent([
      { text: `Here is the user's consultation log. Produce the health summary as instructed:\n\n${logText}` },
    ]);

    return NextResponse.json({ analysis: result.response.text() });
  } catch (error) {
    console.error("[/api/summary] error:", error);
    return NextResponse.json(
      { error: "Failed to generate your health summary. Please try again." },
      { status: 500 }
    );
  }
}
