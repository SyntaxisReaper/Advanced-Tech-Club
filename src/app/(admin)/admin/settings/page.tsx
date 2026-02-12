import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { getAdmins } from "@/services/adminService";
import { AddAdminForm } from "@/components/admin/AddAdminForm";
import { RemoveAdminButton } from "@/components/admin/RemoveAdminButton";

export default async function AdminSettingsPage() {
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
                        Manage who has access to this admin dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-white">Add New Admin</h3>
                        <AddAdminForm />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-white">Current Admins</h3>
                        <div className="space-y-2">
                            {allAdminEmails.map(email => (
                                <div key={email} className="flex items-center justify-between p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                                    <span className="text-neutral-300">{email}</span>
                                    {SUPER_ADMINS.includes(email) ? (
                                        <span className="text-xs text-indigo-400 font-medium px-2 py-1 bg-indigo-500/10 rounded">Super Admin</span>
                                    ) : (
                                        <RemoveAdminButton email={email} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
