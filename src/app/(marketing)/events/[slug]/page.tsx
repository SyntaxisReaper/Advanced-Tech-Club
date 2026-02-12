import { getEventBySlug, getEvents } from "@/services/eventService";
import { MdxRenderer } from "@/components/shared/MdxRenderer";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Share2, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RegisterButton } from "@/components/events/RegisterButton";

export const revalidate = 60; // Revalidate every minute

export async function generateStaticParams() {
    const events = await getEvents();
    return events.map((event) => ({
        slug: event.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return { title: "Event Not Found" };

    return {
        title: `${event.title} - Advanced Tech Club`,
        description: event.description,
    };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-neutral-950 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/events" className="text-indigo-500 hover:text-indigo-400 text-sm mb-4 inline-block">
                        ← Back to Events
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{event.title}</h1>

                    <div className="flex flex-wrap gap-6 text-neutral-400 border-b border-neutral-800 pb-8 mb-8">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>{event.location}</span>
                        </div>
                        {/* Placeholder for time if we add it to frontmatter later */}
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>10:00 AM - 2:00 PM</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <div className="prose prose-invert max-w-none">
                            <MdxRenderer source={event.content || ''} />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-4">Event Details</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-neutral-400 text-sm">
                                    <span>Date</span>
                                    <span className="text-white">{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-neutral-400 text-sm">
                                    <span>Location</span>
                                    <span className="text-white">{event.location}</span>
                                </div>
                                <div className="flex justify-between text-neutral-400 text-sm">
                                    <span>Price</span>
                                    <span className="text-white">Free</span>
                                </div>
                            </div>

                            <RegisterButton eventSlug={slug} registrationLink={event.registration_link} />

                            <Button variant="outline" className="w-full border-neutral-700 text-neutral-300 hover:bg-neutral-800 mt-3">
                                <Share2 className="mr-2 h-4 w-4" /> Share Event
                            </Button>

                            {/* Show feedback button if event date is today or passed */}
                            {event.feedback_link && new Date() >= new Date(event.date) && (
                                <a href={event.feedback_link} target="_blank" rel="noopener noreferrer" className="block w-full mt-3">
                                    <Button variant="outline" className="w-full border-green-500/50 text-green-400 hover:bg-neutral-800">
                                        <MessageSquare className="mr-2 h-4 w-4" /> Give Feedback
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
