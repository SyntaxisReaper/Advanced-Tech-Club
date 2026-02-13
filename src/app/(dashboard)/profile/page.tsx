"use client";

import { useUser } from "@/hooks/useUser";
import { getUserRegistrations, Registration, getUserProfile, Profile } from "@/services/userService";
import { useEffect, useState } from "react";
import { getEventDetails } from "@/app/actions/eventActions";
import { Loader2, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProtocolPass } from "@/components/events/ProtocolPass";

interface ExtendedRegistration extends Registration {
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
}

export default function ProfilePage() {
    const { user, loading } = useUser();
    const [registrations, setRegistrations] = useState<ExtendedRegistration[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [fetchingData, setFetchingData] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!user) return;

            try {
                // Fetch Profile (XP/Rank)
                const userProfile = await getUserProfile(user.id);
                setProfile(userProfile);

                // Fetch Registrations
                const regs = await getUserRegistrations(user.id);

                // Fetch event details for each registration
                const extendedRegs = await Promise.all(
                    regs.map(async (reg) => {
                        const eventDetails = await getEventDetails(reg.event_slug);
                        return {
                            ...reg,
                            eventTitle: eventDetails?.title || reg.event_slug,
                            eventDate: eventDetails?.date || "",
                            eventLocation: eventDetails?.location || "TBD",
                        };
                    })
                );
                setRegistrations(extendedRegs);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setFetchingData(false);
            }
        }

        if (!loading && user) {
            fetchData();
        } else if (!loading && !user) {
            setFetchingData(false);
        }
    }, [user, loading]);

    if (loading || fetchingData) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Please Log In</h1>
                <p className="text-neutral-400">You need to be logged in to view your profile.</p>
                <Link href="/login" className="text-indigo-500 hover:text-indigo-400 mt-4 inline-block">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 py-12 pt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Profile Header / Stats */}
                <div className="mb-12">
                    <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-50">
                            <Trophy className="w-32 h-32 text-indigo-500/10 rotate-12" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{profile?.username || user.user_metadata?.full_name || "Agent"}</h1>
                                <p className="text-neutral-400">{user.email}</p>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 min-w-[140px]">
                                    <div className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Current Rank</div>
                                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 flex items-center">
                                        <Zap className="w-5 h-5 mr-2 text-amber-500" />
                                        {profile?.rank || "Initiate"}
                                    </div>
                                </div>
                                <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 min-w-[140px]">
                                    <div className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Total XP</div>
                                    <div className="text-2xl font-bold text-white font-mono">
                                        {profile?.xp || 0} <span className="text-sm text-neutral-500">XP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* XP Progress Bar (Mockup for next rank) */}
                        <div className="mt-8">
                            <div className="flex justify-between text-xs text-neutral-400 mb-2">
                                <span>Progress to next rank</span>
                                <span>{(profile?.xp || 0) % 1000} / 1000 XP</span>
                            </div>
                            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    style={{ width: `${Math.min(((profile?.xp || 0) % 1000) / 10, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Your Protocol Passes</h2>
                    {user.email === "syntaxisreaper@gmail.com" && (
                        <Link href="/admin">
                            <Button variant="outline" className="border-indigo-500/50 text-indigo-400 hover:bg-neutral-900">
                                Admin Dashboard
                            </Button>
                        </Link>
                    )}
                </div>

                {registrations.length === 0 ? (
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-neutral-800 p-4 rounded-full mb-4">
                                <Zap className="h-8 w-8 text-neutral-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No Active Passes</h3>
                            <p className="text-neutral-400 max-w-md mb-6">
                                You haven&apos;t registered for any upcoming events. Join an event to receive your Protocol Pass.
                            </p>
                            <Link href="/events">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Browse Events
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {registrations.map((reg) => (
                            <ProtocolPass
                                key={reg.id}
                                eventName={reg.eventTitle}
                                date={reg.eventDate}
                                location={reg.eventLocation}
                                username={profile?.username || reg.full_name || "User"}
                                rank={profile?.rank || "Initiate"}
                                ticketSecret={reg.ticket_secret || "NO_TICKET"}
                                checkedIn={reg.checked_in || false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
