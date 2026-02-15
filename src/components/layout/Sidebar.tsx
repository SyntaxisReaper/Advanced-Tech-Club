"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, User, Trophy, Settings, LogOut } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Competitions", href: "/competitions", icon: Trophy },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 w-64 py-6 px-4">
            <div className="mb-8 px-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Member Area</h2>
                <p className="text-xs text-neutral-500 mt-1">Manage your activities</p>
            </div>

            <div className="flex-1 space-y-1">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                                isActive
                                    ? "bg-indigo-600/10 text-indigo-400"
                                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-indigo-400" : "text-neutral-500")} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto pt-6 border-t border-neutral-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20 px-3"
                    onClick={async () => await logout()}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
