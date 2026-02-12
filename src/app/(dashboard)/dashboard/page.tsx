"use client";

import { useUser } from "@/hooks/useUser";
import { getUserRegistrations, Registration } from "@/services/userService";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventBySlug } from "@/lib/mdx/mdxLoader"; // Note: accessing MDX loader from client component might fail if not careful, better to fetch metadata via API or use server component. 
// Refactor: We need a server component or API to get event details by slug list.
// For now, let's just list the slugs or creating a client-safe way.
// Actually, mdxLoader uses 'fs' which is server-only.
// We should make this page a Server Component or fetch data via server action/API.
// Let's make it a Client Component calling a Server Action for fetching data.

import { Loader2, Calendar, ArrowRight, Trophy, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { user, loading } = useUser();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loadingRegs, setLoadingRegs] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (user) {
                const regs = await getUserRegistrations(user.id);
                setRegistrations(regs);
                setLoadingRegs(false);
            }
        }
        if (!loading && user) {
            fetchData();
        }
    }, [user, loading]);

    if (loading || loadingRegs) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {user?.user_metadata?.full_name || 'Member'}</h1>
                <p className="text-neutral-400 mt-2">Here's what's happening in your tech journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardStat title="Events Registered" value={registrations.length.toString()} icon={Calendar} />
                <DashboardStat title="Competitions" value="0" icon={Trophy} />
                <DashboardStat title="Points" value="0" icon={UserIcon} /> {/* Placeholder */}
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">My Upcoming Events</h2>
                    <Link href="/events" className="text-sm text-indigo-400 hover:text-indigo-300">
                        Browse all events
                    </Link>
                </div>

                {registrations.length === 0 ? (
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="h-12 w-12 text-neutral-600 mb-4" />
                            <p className="text-neutral-400 text-lg mb-4">You haven't registered for any events yet.</p>
                            <Link href="/events">
                                <Button variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-neutral-800">
                                    Find an Event
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {registrations.map(reg => (
                            <EventCard key={reg.id} slug={reg.event_slug} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DashboardStat({ title, value, icon: Icon }: { title: string, value: string, icon: any }) {
    return (
        <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-400">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
            </CardContent>
        </Card>
    )
}

function EventCard({ slug }: { slug: string }) {
    // Determine title from slug for now since we can't access MDX easily from client without API
    // A robust solution would retrieve event metadata via a server action or API route
    const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
                <CardTitle className="text-lg text-white">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">Registered</span>
                    <Link href={`/events/${slug}`}>
                        <Button size="sm" variant="secondary" className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700">
                            View Details <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
