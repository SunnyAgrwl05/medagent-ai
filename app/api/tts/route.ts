import { NextRequest, NextResponse } from "next/server";
import { textToSpeech } from "@/lib/elevenlabs";

export const runtime = "nodejs";

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "CwhRBWXzGAHq8TQ4Fs17";

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text || !text.trim()) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const audio = await textToSpeech(text, VOICE_ID);

        if (!audio) {
            // No key succeeded — useVoice.ts already falls back to
            // speakWithBrowser() on any non-OK response, so nothing there
            // needs to change.
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

