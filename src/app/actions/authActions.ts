"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function resetPassword(email: string) {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email) {
        return { success: false, message: "Email is required" };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/dashboard/profile&type=recovery`,
    });

    if (error) {
        console.error("Reset password error:", error);
        return { success: false, message: "Could not send reset link. Please try again." };
        // Security note: In a real app, we might not want to reveal if email exists or not, 
        // but Supabase usually handles this by sending a fake success or distinct error.
        // For now, simple error message.
    }

    return { success: true, message: "Check your email for the reset link." };
}
