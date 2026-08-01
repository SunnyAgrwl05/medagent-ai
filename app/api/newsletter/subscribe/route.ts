import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { z } from "zod";

const schema = z.object({
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        const supabase = await createServerSupabase();

        const { error } = await supabase
            .from("newsletter_subscribers")
            .upsert(
                { email: parsed.data.email },
                { onConflict: "email" }
            );

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("[newsletter-subscribe] error:", err);

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}