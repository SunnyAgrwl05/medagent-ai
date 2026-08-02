import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { textToSpeech } from "@/lib/elevenlabs";

export const runtime = "nodejs";

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "CwhRBWXzGAHq8TQ4Fs17";
const MAX_TEXT_LENGTH = 5000;

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { text } = await req.json();

        if (!text || !text.trim()) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (text.length > MAX_TEXT_LENGTH) {
            return NextResponse.json(
                { error: "Text exceeds maximum length of " + MAX_TEXT_LENGTH + " characters" },
                { status: 400 }
            );
        }

        const audio = await textToSpeech(text, VOICE_ID);

        if (!audio) {
            return NextResponse.json(
                { error: "All ElevenLabs keys unavailable" },
                { status: 503 }
            );
        }

        return new NextResponse(audio, {
            status: 200,
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        console.error("[api/tts] unexpected error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}