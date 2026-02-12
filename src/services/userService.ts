import { createClient } from "@/lib/supabase/client";

export interface Registration {
    id: string;
    created_at: string;
    event_slug: string;
}

export async function getUserRegistrations(userId: string): Promise<Registration[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching registrations:", error);
        return [];
    }

    return data || [];
}
