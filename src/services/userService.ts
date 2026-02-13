import { createClient } from "@/lib/supabase/client";

export interface Profile {
    id: string;
    username: string;
    xp: number;
    rank: string;
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        // It's possible profile doesn't exist yet if trigger failed or wasn't set up
        // We can return a default/mock one or null
        console.error("Error fetching profile:", error);
        return null;
    }
    return data;
}

export interface Registration {
    id: string;
    created_at: string;
    event_slug: string;
    user_id: string;
    email?: string;
    full_name?: string;
    ticket_secret?: string;
    checked_in?: boolean;
    checked_in_at?: string;
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
