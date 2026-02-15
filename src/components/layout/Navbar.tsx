"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Terminal, Trophy, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user, loading } = useUser();

    const navItems = [
        { name: "Events", href: "/events" },
        { name: "About", href: "/about" },
        { name: "Competitions", href: "/competitions" },
    ];

    const isActive = (path: string) => pathname?.startsWith(path);

    return (
        <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-md border-b border-[#9D4EDD]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Terminal className="h-8 w-8 text-[#9D4EDD]" />
                            <span className="text-xl font-bold text-white tracking-tight">
                                Advanced Tech Club
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                                        isActive(item.href)
                                            ? "text-white bg-neutral-800"
                                            : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {user && (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className={cn(
                                            "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                                            isActive("/dashboard")
                                                ? "text-white bg-neutral-800"
                                                : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                                        )}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className={cn(
                                            "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                                            isActive("/profile")
                                                ? "text-white bg-neutral-800"
                                                : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                                        )}
                                    >
                                        Profile
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            {loading ? (
                                <div className="h-9 w-20 bg-neutral-800 animate-pulse rounded-md" />
                            ) : user ? (
                                <UserNav user={user} />
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-neutral-800">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                                            Join Club
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-neutral-300 hover:text-white"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-neutral-900 border-b border-neutral-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium",
                                    isActive(item.href)
                                        ? "text-white bg-neutral-800"
                                        : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                href="/dashboard"
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium",
                                    isActive("/dashboard")
                                        ? "text-white bg-neutral-800"
                                        : "text-neutral-300 hover:text-white hover:bg-neutral-800"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                        <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-col space-y-2 px-3">
                            {user ? (
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-950/20"
                                    onClick={async () => {
                                        await logout();
                                        setIsOpen(false);
                                    }}
                                >
                                    Log out
                                </Button>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-neutral-300">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                                            Join Club
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import { logout } from "@/app/(auth)/actions";

function UserNav({ user }: { user: any }) {
    // Get initials
    const initials = user.email?.substring(0, 2).toUpperCase() || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="@user" />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-neutral-900 border-neutral-800 text-neutral-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">User</p>
                        <p className="text-xs leading-none text-neutral-400">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-800" />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="focus:bg-neutral-800 focus:text-white cursor-pointer" asChild>
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-neutral-800 focus:text-white cursor-pointer" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-neutral-800 focus:text-white cursor-pointer" asChild>
                        <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-neutral-800" />
                <DropdownMenuItem
                    className="text-red-500 focus:bg-red-950/20 focus:text-red-400 cursor-pointer"
                    onClick={async () => await logout()}
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
