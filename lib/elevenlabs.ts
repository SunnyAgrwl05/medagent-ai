import { withKeyRotation, devLog } from "@/lib/retry";
import { getErrorMessage } from "@/lib/errors";

function getElevenLabsKeys(): string[] {
    return [1, 2, 3, 4]
        .map((i) => process.env[`ELEVENLABS_API_KEY_${i}`])
        .filter((key): key is string => Boolean(key && key.trim().length > 0));
}

/**
 * Returns MP3 audio bytes on success, or `null` if every key failed —
 * callers should treat `null` as "fall back to browser TTS", never throw.
 */
export async function textToSpeech(
    text: string,
    voiceId: string
): Promise<ArrayBuffer | null> {
    const keys = getElevenLabsKeys();

    if (keys.length === 0) {
        devLog("[ElevenLabs] No API keys configured — falling back to Browser TTS");
        return null;
    }

    try {
        return await withKeyRotation(keys, "ElevenLabs", async (key) => {
            const response = await fetch(
                `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                {
                    method: "POST",
                    headers: {
                        "xi-api-key": key,
                        "Content-Type": "application/json",
                        Accept: "audio/mpeg",
                    },
                    body: JSON.stringify({
                        text,
                        model_id: "eleven_multilingual_v2",
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.8,
                            style: 0.3,
                            use_speaker_boost: true,
                        },
                    }),
                }
            );

            if (!response.ok) {
                const errText = await response.text();
                const error = new Error(`ElevenLabs request failed: ${errText}`) as Error & {
                    status?: number;
                };
                error.status = response.status;
                throw error;
            }

            const buffer = await response.arrayBuffer();
            if (buffer.byteLength === 0) {
                throw new Error("ElevenLabs returned empty audio");
            }
            return buffer;
        });
    } catch (err) {
        devLog(
            `[ElevenLabs] Falling back to Browser TTS (${getErrorMessage(err)})`
        );
        return null;
    }
}

