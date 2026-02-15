"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth/admin";
import { logAuditAction } from "@/lib/auditService";

export type UserData = {
    id: string;
    email: string; // From auth or registration
    username: string;
    rank: string;
    xp: number;
    registrations: {
        id: string;
        event_slug: string;
        checked_in: boolean;
    }[];
};

export async function getAllUsersData(): Promise<{ success: boolean; users?: UserData[]; message?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !(await isAdmin(user.email || ""))) {
        return { success: false, message: "Unauthorized" };
    }

    const adminClient = createAdminClient();

    // 1. Fetch all Profiles
    const { data: profiles, error: profilesError } = await adminClient
        .from("profiles")
        .select("*")
        .order("xp", { ascending: false });

    if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return { success: false, message: "Failed to fetch profiles" };
    }

    // 2. Fetch all Registrations
    const { data: registrations, error: regsError } = await adminClient
        .from("registrations")
        .select("id, user_id, email, full_name, event_slug, checked_in");

    if (regsError) {
        console.error("Error fetching registrations:", regsError);
        return { success: false, message: "Failed to fetch registrations" };
    }

    // 3. Aggregate Data
    // We want a list of users. Profiles are the source of truth for "active" gamified users.
    // Registrations might contain users who haven't had a profile created yet (though recovery fixes this).

    // Map profiles to UserData
    const userMap = new Map<string, UserData>();

    profiles.forEach(p => {
        userMap.set(p.id, {
            id: p.id,
            email: "", // Will fill from registrations matching ID or fetch from auth if needed (auth fetch is slow for all users)
            username: p.username || "Unknown",
            rank: p.rank || "Localhost 🏠",
            xp: p.xp || 0,
            registrations: []
        });
    });

    // Attach registrations and fill email if missing (best effort from registration data)
    registrations.forEach(r => {
        let u = userMap.get(r.user_id);

        // If user exists in profiles
        if (u) {
            if (!u.email && r.email) u.email = r.email;
            u.registrations.push({
                id: r.id,
                event_slug: r.event_slug,
                checked_in: r.checked_in || false
            });
        } else {
            // User has registration but NO profile. This shouldn't happen often with fixes, but let's include them.
            // We can create a placeholder entry for them.
            userMap.set(r.user_id, {
                id: r.user_id,
                email: r.email || "Unknown",
                username: r.full_name || "Unregistered",
                rank: "No Profile",
                xp: 0,
                registrations: [{
                    id: r.id,
                    event_slug: r.event_slug,
                    checked_in: r.checked_in || false
                }]
            });
        }
    });

    return { success: true, users: Array.from(userMap.values()) };
}

export async function updateUserStats(userId: string, newRank: string, newXp: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== "syntaxisreaper@gmail.com") { // Strict Super Admin check
        return { success: false, message: "Unauthorized: Super Admin only" };
    }

    const adminClient = createAdminClient();

    // "Killer" Rank Logic
    // If the rank is "Killer", automatic max XP
    let finalXp = newXp;
    let finalRank = newRank;

    // Check if the user being updated is the owner (optional security, but good practice)
    // Or if the rank being set is "Killer"
    if (newRank === "Killer") {
        finalXp = 999999; // Maximize XP
    }

    const { error } = await adminClient
        .from("profiles")
        .update({ rank: finalRank, xp: finalXp, updated_at: new Date().toISOString() })
        .eq("id", userId);

    if (error) {
        console.error("Error updating user stats:", error);
        return { success: false, message: "Update Failed: " + error.message };
    }

    revalidatePath("/profile");

    return { success: true, message: "User updated successfully" };
}

export async function getLeaderboard(): Promise<{ success: boolean; leaderboard?: { username: string; xp: number; rank: string }[] }> {
    const supabase = await createClient(); // Use standard client, public data usually
    // Or use admin client if RLS hides it, but public profiles should be visible.
    // Let's use createClient for now, assuming public read access policy exists or we add one.
    // Re-checking schema: "Public profiles are viewable by everyone" policy exists. Good.

    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("username, xp, rank")
        .order("xp", { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching leaderboard:", error);
        return { success: false };
    }

    return { success: true, leaderboard: profiles || [] };
}

export async function deleteUser(userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !(await isAdmin(user.email || ""))) {
        return { success: false, message: "Unauthorized" };
    }

    const adminClient = createAdminClient();

    // 1. Delete from Auth (this cascades to profiles if set up, but let's be safe)
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

    if (authError) {
        console.error("Error deleting user from auth:", authError);
        return { success: false, message: "Failed to delete from Auth: " + authError.message };
    }

    // 2. Delete from Profiles (Manual cleanup if cascade missing)
    const { error: profileError } = await adminClient
        .from("profiles")
        .delete()
        .eq("id", userId);

    if (profileError) {
        console.warn("Error deleting profile (might already be gone via cascade):", profileError);
    }

    // 3. Delete Registrations (Manual cleanup if cascade missing)
    const { error: regError } = await adminClient
        .from("registrations")
        .delete()
        .eq("user_id", userId);

    if (regError) {
        console.warn("Error deleting registrations (might already be gone via cascade):", regError);
    }

    revalidatePath("/admin/settings");

    // Log the action
    await logAuditAction("DELETE_USER_BY_ADMIN", { target_user_id: userId }, user.id);

    return { success: true, message: "User deleted successfully" };
}

export async function deleteMyAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: "Unauthorized" };
    }

    const adminClient = createAdminClient();
    const userId = user.id;

    // 1. Delete from Auth (cascades)
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

    if (authError) {
        console.error("Error deleting own account:", authError);
        return { success: false, message: "Failed to delete account: " + authError.message };
    }

    // 2. Manual cleanup if needed (profiles/registrations) - relying on cascade or adminClient as above is fine.

    await logAuditAction("USER_SELF_DELETE", { deleted_user_id: userId, email: user.email }, undefined);
    // passing undefined for userId so it doesn't violate FK constraint after user is gone.

    return { success: true, message: "Account deleted successfully" };
}
