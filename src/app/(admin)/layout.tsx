import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/admin";
import Link from "next/link";
import { LayoutDashboard, Calendar, Users, Settings, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !(await isAdmin(user.email))) {
        redirect("/");
    }

    return (
        <div className="flex h-screen bg-neutral-950 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
                <div className="p-6 border-b border-neutral-800">
                    <h1 className="text-xl font-bold text-indigo-500">Admin Panel</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin/events" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                        <Calendar className="h-5 w-5" />
                        <span>Events</span>
                    </Link>
                    <Link href="/admin/registrations" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                        <Users className="h-5 w-5" />
                        <span>Registrations</span>
                    </Link>
                    <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-neutral-800">
                    <form action="/auth/signout" method="post">
                        {/* We might need a proper signout action or link depending on implementation */}
                        <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                            <LogOut className="h-5 w-5" />
                            <span>Exit Admin</span>
                        </Link>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}
