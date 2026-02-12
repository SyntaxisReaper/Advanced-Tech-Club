import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventSlug } = await request.json();

    if (!eventSlug) {
        return NextResponse.json({ error: "Event slug is required" }, { status: 400 });
    }

    const { error } = await supabase
        .from("registrations")
        .insert({
            user_id: user.id,
            event_slug: eventSlug,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        });

    if (error) {
        if (error.code === "23505") { // Unique violation
            return NextResponse.json({ error: "Already registered" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
