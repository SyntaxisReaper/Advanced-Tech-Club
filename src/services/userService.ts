import { createClient } from "@/lib/supabase/client";

export interface Registration {
    id: string;
    created_at: string;
    event_slug: string;
    email?: string;
    full_name?: string;
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

export async function getAllRegistrations(): Promise<Registration[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching all registrations:", error);
        return [];
    }

    return data || [];
}
