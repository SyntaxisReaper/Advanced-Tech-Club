import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Shield } from "lucide-react";
import { addAdminAction, removeAdminAction } from "@/app/actions/adminActions";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { data: admins } = await supabase.from("admins").select("*").order("created_at", { ascending: true });

    // Fallback for super admins if DB is empty or just to show them
    const SUPER_ADMINS = ["syntaxisreaper@gmail.com", "arman@example.com"];

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
                        <form action={addAdminAction} className="flex gap-2 max-w-md">
                            <Input name="email" type="email" placeholder="admin@example.com" required className="bg-neutral-950 border-neutral-800 text-white" />
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="h-4 w-4 mr-2" /> Add
                            </Button>
                        </form>
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
                                        <form action={removeAdminAction}>
                                            <input type="hidden" name="email" value={email} />
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-neutral-900">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
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
