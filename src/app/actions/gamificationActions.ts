"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

    // 1. Verify Ticket
    const { data: registration, error: regError } = await supabase
        .from("registrations")
        .select("*, profiles:user_id (username, xp, rank)")
        .eq("ticket_secret", ticketSecret)
        .single();

    if (regError || !registration) {
        return { success: false, message: "Invalid Authorization Code." };
    }

    if (registration.checked_in) {
        return {
            success: false,
            message: "User already checked in.",
            user: registration.profiles
        };
    }

    // 2. Perform Check-in (Transaction-like via separate calls for now)
    // Update Registration
    const { error: updateError } = await supabase
        .from("registrations")
        .update({ checked_in: true, checked_in_at: new Date().toISOString() })
        .eq("id", registration.id);

    if (updateError) {
        console.error("Check-in update error:", updateError);
        return { success: false, message: "System Error: Could not update status." };
    }

    // 3. Award XP and Update Rank
    const currentXp = registration.profiles?.xp || 0;
    const xpAward = 50;
    const newXp = currentXp + xpAward;

    // Simple Rank Logic
    let newRank = registration.profiles?.rank || "Script Kiddie";
    if (newXp >= 1000) newRank = "Neural Netrunner";
    else if (newXp >= 500) newRank = "Cyber Ninja";
    else if (newXp >= 200) newRank = "Code Breaker";
    else if (newXp >= 50) newRank = "Script Kiddie"; // Initial rank

    const { error: profileError } = await supabase
        .from("profiles")
        .update({ xp: newXp, rank: newRank })
        .eq("id", registration.user_id);

    if (profileError) {
        console.error("XP update error:", profileError);
        // Note: Check-in succeeded but XP failed. Ideally this should be a transaction.
    }

    revalidatePath("/admin/registrations");
    revalidatePath("/profile");

    return {
        success: true,
        message: "Access Granted. +50 XP",
        user: {
            username: registration.profiles?.username || "Unknown",
            xp: newXp,
            rank: newRank
        },
        newXp
    };
}
