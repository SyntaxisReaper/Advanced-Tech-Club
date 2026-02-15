import { createAdminClient } from "@/lib/supabase/admin";

export async function logAuditAction(action: string, details: any, userId?: string, ipAddress?: string) {
    const supabase = createAdminClient();

    try {
        const { error } = await supabase
            .from("audit_logs")
            .insert({
                action,
                details,
                user_id: userId,
                ip_address: ipAddress
            });

        if (error) {
            console.error("Failed to log audit action:", error);
            // Don't throw, we don't want to break the main action flow just because logging failed
        }
    } catch (err) {
        console.error("Exception logging audit action:", err);
    }
}
