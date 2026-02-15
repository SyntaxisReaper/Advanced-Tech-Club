import Link from "next/link";
import { getEvents } from "@/services/eventService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 60; // Revalidate every minute

export const metadata = {
    title: "Events - Advanced Tech Club",
    description: "Upcoming workshops, hackathons, and meetups.",
};

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Upcoming Events</h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto">
                        Discover workshops, competitions, and meetups designed to help you grow your skills and network with fellow tech enthusiasts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <Card key={event.slug} className="bg-[#474B4F]/80 backdrop-blur-md border-neutral-700/50 text-neutral-200 hover:border-[#9D4EDD]/50 transition-colors duration-300">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">
                                        {event.tags?.[0] || 'Event'}
                                    </Badge>
                                    <span className="text-xs text-neutral-500 font-mono">
                                        {new Date(event.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-xl text-white">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-neutral-400 text-sm line-clamp-3 mb-4">
                                    {event.description}
                                </p>
                                <div className="flex items-center text-xs text-neutral-500 space-x-4">
                                    <div className="flex items-center">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {event.location}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/events/${event.slug}`} className="w-full">
                                    <Button className="w-full bg-neutral-800 hover:bg-neutral-700 text-white">
                                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-neutral-500">No upcoming events found. Check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
