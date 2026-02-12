import { createClient } from "@/lib/supabase/server";

export async function getAllRegistrations() {
    const supabase = await createClient();

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

export async function getAdmins() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("admins")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching admins:", error);
        return [];
    }
    return data || [];
}
