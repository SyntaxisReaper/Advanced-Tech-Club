"use client";

import { useUser } from "@/hooks/useUser";
import { Loader2, User as UserIcon, Mail, Calendar, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getUserRegistrations, Registration } from "@/services/userService";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const { user, loading } = useUser();

    if (loading || !user) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const initials = user.email?.substring(0, 2).toUpperCase() || "U";

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-neutral-400 mt-2">Manage your account settings and preferences.</p>
            </div>

            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Personal Information</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Basic details about your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-6">
                        <Avatar className="h-20 w-20 border-2 border-neutral-700">
                            <AvatarImage src="/avatars/01.png" />
                            <AvatarFallback className="text-lg bg-indigo-600 text-white">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <Button variant="outline" className="text-neutral-300 border-neutral-700 hover:bg-neutral-800">
                                Change Avatar
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-neutral-300">Full Name</Label>
                        <div className="flex items-center space-x-2 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-neutral-400">
                            <UserIcon className="h-4 w-4" />
                            <span>{user.user_metadata?.full_name || "N/A"}</span>
                        </div>
                        <p className="text-xs text-neutral-500">
                            To change your name, please contact support (Feature coming soon).
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-neutral-300">Email Address</Label>
                        <div className="flex items-center space-x-2 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-neutral-400">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Registered Events</h2>
                <DashboardEventsList userId={user.id} />
            </div>

            <Card className="bg-neutral-900 border-neutral-800 opacity-50">
                <CardHeader>
                    <CardTitle className="text-xl text-white">Account Security</CardTitle>
                    <CardDescription className="text-neutral-400">
                        Password and authentication settings (Coming Soon).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button disabled className="w-full">
                        Change Password
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

function DashboardEventsList({ userId }: { userId: string }) {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRegs() {
            try {
                const regs = await getUserRegistrations(userId);
                setRegistrations(regs);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchRegs();
    }, [userId]);

    if (loading) {
        return <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />;
    }

    if (registrations.length === 0) {
        return (
            <Card className="bg-neutral-900 border-neutral-800">
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <Calendar className="h-10 w-10 text-neutral-600 mb-3" />
                    <p className="text-neutral-400 text-sm mb-3">No registered events.</p>
                    <Link href="/events">
                        <Button variant="outline" size="sm" className="border-indigo-500/50 text-indigo-400 hover:bg-neutral-800">
                            Find Event
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map(reg => (
                <EventCard key={reg.id} slug={reg.event_slug} />
            ))}
        </div>
    );
}

import { getEventDetails } from "@/app/actions/eventActions";

function EventCard({ slug }: { slug: string }) {
    const [eventDetails, setEventDetails] = useState<{ title: string, date: string } | null>(null);

    useEffect(() => {
        getEventDetails(slug).then(details => {
            if (details) setEventDetails(details);
        });
    }, [slug]);

    const title = eventDetails?.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const isCompleted = eventDetails && new Date() >= new Date(eventDetails.date);

    return (
        <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base text-white">{title}</CardTitle>
                    {isCompleted && (
                        <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/20">
                            Completed
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500">Registered</span>
                    <Link href={`/events/${slug}`}>
                        <Button size="sm" variant="secondary" className="h-8 text-xs bg-neutral-800 text-neutral-300 hover:bg-neutral-700">
                            View <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
