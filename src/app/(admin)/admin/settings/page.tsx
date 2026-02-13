import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { getAdmins } from "@/services/adminService";
import { AddAdminForm } from "@/components/admin/AddAdminForm";
import { RemoveAdminButton } from "@/components/admin/RemoveAdminButton";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/auth/admin";
import { Badge } from "@/components/ui/badge";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isSuper = isSuperAdmin(user?.email);

    const admins = await getAdmins();

    // Fallback for super admins if DB is empty or just to show them
    const SUPER_ADMINS = ["syntaxisreaper@gmail.com"];

    // Merge DB admins with super admins for display, removing duplicates
    const allAdminEmails = Array.from(new Set([
        ...SUPER_ADMINS,
        ...(admins?.map(a => a.email) || [])
    ]));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-neutral-400 mt-1">Manage admin access and configurations.</p>
            </div>

            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-indigo-500" />
                        Admin Access
                    </CardTitle>
                    <CardDescription className="text-neutral-400">
                        {isSuper
                            ? "Manage platform administrators. You have Super Admin privileges."
                            : "View current administrators. Only Super Admins can add or remove admins."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isSuper && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-white">Add New Admin</h3>
                            <AddAdminForm />
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-white">Current Admins</h3>
                        <div className="space-y-2">
                            {allAdminEmails.map(email => (
                                <div key={email} className="flex items-center justify-between p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                                    <span className="text-neutral-300">{email}</span>
                                    {SUPER_ADMINS.includes(email.toLowerCase()) ? (
                                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs hover:bg-amber-500/20">
                                            Super Admin
                                        </Badge>
                                    ) : (
                                        isSuper && <RemoveAdminButton email={email} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isSuper && (
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center">
                            <User className="mr-2 h-5 w-5 text-purple-500" />
                            User Management (Super Admin)
                        </CardTitle>
                        <CardDescription className="text-neutral-400">
                            Manually adjust user XP and Ranks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-neutral-400">
                            User management interface coming soon. For now, please use Supabase Dashboard or SQL to manually edit user profiles if needed instantly.
                            <br />
                            A dedicated user search and edit tool will be implemented here.
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
