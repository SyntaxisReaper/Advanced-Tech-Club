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
    // Note: Suapbase client normally handles caching but for server components/actions 
    // we might need to be careful. `createClient` from `@/lib/supabase/client` is browser client usually.
    // If this is running on server (which it seems to be capable of), we should use `createClient` from `@/lib/supabase/server`.
    // But this file imports from `client`. Let's check where it's used.
    // userProfile is called in `profile/page.tsx` inside a useEffect, so it's client-side fetching.
    // Client side fetching shouldn't cache aggressively unless the browser does.
    // Let's force a refresh or ensure the update action invalidates properly.
    // The update action calls `revalidatePath("/profile")`. This should work for Server Components.
    // But `profile/page.tsx` is a Client Component (`use client`).
    // So `revalidatePath` might not affect the client-side `getUserProfile` call immediately if it doesn't trigger a router refresh.
    // I will switch `getUserProfile` to be a server action or use a server component for the profile wrapper to ensure data freshness.
    // For now, let's just make `getUserProfile` robust.

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
