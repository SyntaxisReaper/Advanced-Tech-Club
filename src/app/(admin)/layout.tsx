"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const navLinks = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/events", label: "Events", icon: Calendar },
        { href: "/admin/registrations", label: "Registrations", icon: Users },
        { href: "/admin/scanner", label: "Scanner", icon: Calendar }, // Added Scanner link
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
                <h1 className="text-lg font-bold text-indigo-500">Admin Panel</h1>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {isSidebarOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 
                transform transition-transform duration-200 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 flex flex-col pt-16 md:pt-0
            `}>
                <div className="p-6 border-b border-neutral-800 hidden md:block">
                    <h1 className="text-xl font-bold text-indigo-500">Admin Panel</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-indigo-600/10 text-indigo-400'
                                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-800">
                    <form action="/auth/signout" method="post">
                        <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
                            <LogOut className="h-5 w-5" />
                            <span>Exit Admin</span>
                        </Link>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 pt-20 md:p-8 w-full">
                {children}
            </main>
        </div>
    );
}

