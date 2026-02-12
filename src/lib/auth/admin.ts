import { createClient } from "@/lib/supabase/server";

export async function isAdmin(email?: string | null) {
    if (!email) return false;

    // Fallback for initial bootstrap if DB fails or empty? No, rely on DB.
    // We can keep the hardcoded list as a fallback or "super admins".
    const SUPER_ADMINS = ["syntaxisreaper@gmail.com", "arman@example.com"];
    if (SUPER_ADMINS.includes(email)) return true;

    const supabase = await createClient();
    const { data } = await supabase
        .from("admins")
        .select("email")
        .eq("email", email)
        .single();

    return !!data;
}
