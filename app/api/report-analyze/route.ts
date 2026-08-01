import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { buildAgentModel } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const model = buildAgentModel("report");

    let result;

    if (file.type === "application/pdf") {
      // Lazy import so pdf-parse's debug mode doesn't run at build time
      const pdfParse = (await import("pdf-parse")).default;
      const parsed = await pdfParse(buffer);
      const extractedText = parsed.text.trim();

      if (!extractedText) {
        return NextResponse.json(
          { error: "Couldn't extract any text from this PDF. Try a clearer scan or an image instead." },
          { status: 422 }
        );
      }

      result = await model.generateContent([
        {
          text: `Here is the extracted text from a medical report PDF. Analyze it as instructed:\n\n${extractedText}`,
        },
      ]);
    } else if (file.type.startsWith("image/")) {
      const base64 = buffer.toString("base64");
      result = await model.generateContent([
        { text: "Here is a photo of a medical report. Read every value carefully and analyze it as instructed." },
        { inlineData: { data: base64, mimeType: file.type } },
      ]);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or image." },
        { status: 400 }
      );
    }

    const text = result.response.text();

    return NextResponse.json({ analysis: text, fileName: file.name });
  } catch (error) {
    console.error("[/api/report-analyze] error:", error);
    return NextResponse.json(
      { error: "Failed to analyze the report. Please try again." },
      { status: 500 }
    );
  }
}
