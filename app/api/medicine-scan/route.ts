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
    const medicineName = formData.get("medicineName") as string | null;

    if (!file && !medicineName?.trim()) {
      return NextResponse.json(
        { error: "Upload a photo or type the medicine name" },
        { status: 400 }
      );
    }

    const model = buildAgentModel("medicine");
    const parts: (
      | { text: string }
      | { inlineData: { data: string; mimeType: string } }
    )[] = [];

    if (medicineName?.trim()) {
      parts.push({ text: `Identify and explain this medicine: ${medicineName.trim()}` });
    } else {
      parts.push({ text: "Identify the medicine shown in this photo and explain it." });
    }

    if (file) {
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "Image exceeds 10MB limit" }, { status: 400 });
      }
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Please upload an image file" }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      parts.push({ inlineData: { data: buffer.toString("base64"), mimeType: file.type } });
    }

    const result = await model.generateContent(parts);
    const text = result.response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error("[/api/medicine-scan] error:", error);
    return NextResponse.json(
      { error: "Failed to identify the medicine. Please try again." },
      { status: 500 }
    );
  }
}
