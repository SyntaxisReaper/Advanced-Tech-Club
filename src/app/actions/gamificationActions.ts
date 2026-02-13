"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth/admin";

type CheckInResult = {
    success: boolean;
    message: string;
    user?: {
        username: string;
        xp: number;
        rank: string;
    };
    newXp?: number;
};

export async function checkInUser(ticketSecret: string): Promise<CheckInResult> {
    const supabase = await createClient();

    // 0. Verify Admin Access
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Unauthorized: Not Logged In." };
    }

    const adminEmail = user.email || "";
    if (!(await isAdmin(adminEmail))) {
        return { success: false, message: `Unauthorized: User ${adminEmail} is not an Admin.` };
    }

    // 1. Initialize Admin Client (Bypass RLS)
    // Ensure SUPABASE_SERVICE_ROLE_KEY is set in environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
        return { success: false, message: "Server Configuration Error: Missing Service Key." };
    }

    const adminClient = createAdminClient();

    // 2. Verify Ticket using Admin Client (Split Query to avoid Relation Error)
    // Fetch Registration ONLY
    const { data: registration, error: regError } = await adminClient
        .from("registrations")
        .select("*")
        .eq("ticket_secret", ticketSecret)
        .single();

    if (regError || !registration) {
        console.error("Registration lookup failed:", regError);
        return {
            success: false,
            message: regError ? `DB Error (Reg): ${regError.message} (${regError.code})` : "Invalid Ticket: No registration found."
        };
    }

    // Fetch Profile ONLY
    const { data: profile, error: profileFetchError } = await adminClient
        .from("profiles")
        .select("*")
        .eq("id", registration.user_id)
        .single();

    // If profile missing, treat as default new user
    const currentProfile = profile || { username: "Unknown", xp: 0, rank: "Localhost 🏠" };

    if (registration.checked_in) {
        // RECOVERY: If user is checked in but has NO profile (null), allow proceeding to create it.
        if (profile) {
            return {
                success: false,
                message: "User already checked in.",
                user: {
                    username: currentProfile.username,
                    xp: currentProfile.xp,
                    rank: currentProfile.rank
                }
            };
        }
        // If !profile, fall through to award XP/create profile ("The Recovery Flow")
    }

    // 3. Perform Check-in
    const { error: updateError } = await adminClient
        .from("registrations")
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq("id", registration.id);

    if (updateError) {
        console.error("Check-in update error:", updateError);
        return { success: false, message: "System Error: Could not update status." };
    }

    // 4. Award XP and Update Rank
    const currentXp = currentProfile.xp || 0;
    const xpAward = 50;
    const newXp = currentXp + xpAward;

    // Rank Logic
    // Rank Logic
    let newRank = currentProfile.rank || "Localhost 🏠"; // Default

    // Thresholds
    if (newXp >= 5000) newRank = "Singularity 🌌";
    else if (newXp >= 2500) newRank = "Hypervisor 🏗️";
    else if (newXp >= 1000) newRank = "Node 🟢";
    else if (newXp >= 500) newRank = "Daemon 👻";
    else if (newXp >= 100) newRank = "Localhost 🏠";
    else newRank = "Localhost 🏠"; // Catch-all for < 100 XP

    // Update/Insert Profile (Upsert to handle missing profiles for existing users)
    const { error: profileUpdateError } = await adminClient
        .from("profiles")
        .upsert({
            id: registration.user_id,
            username: currentProfile.username !== "Unknown" ? currentProfile.username : (user.user_metadata?.full_name || user.email?.split('@')[0] || "User"),
            xp: newXp,
            rank: newRank,
            updated_at: new Date().toISOString()
        })
        .select();

    if (profileUpdateError) {
        console.error("XP update error:", profileUpdateError);
        // We log it but don't fail the whole check-in since registration marked as checked-in
        return {
            success: true,
            message: "Access Granted. (XP Update Failed: " + profileUpdateError.message + ")",
            user: { username: currentProfile.username || "Unknown", xp: currentXp, rank: currentProfile.rank }
        };
    }

    revalidatePath("/admin/registrations");
    revalidatePath("/profile");

    return {
        success: true,
        message: "Access Granted. +50 XP",
        user: {
            username: currentProfile.username || "Unknown",
            xp: newXp,
            rank: newRank
        },
        newXp
    };
}
