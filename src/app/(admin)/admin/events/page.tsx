import { getEvents } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminEventsPage() {
    // Fetch all events including drafts
    const events = await getEvents(true);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Events</h1>
                    <p className="text-neutral-400 mt-1">Manage workshops, competitions, and sessions.</p>
                </div>
                <Link href="/admin/events/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Event
                    </Button>
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-950">
                        <TableRow className="border-neutral-800 hover:bg-neutral-950">
                            <TableHead className="text-neutral-400">Title</TableHead>
                            <TableHead className="text-neutral-400">Date</TableHead>
                            <TableHead className="text-neutral-400">Status</TableHead>
                            <TableHead className="text-neutral-400">Registrations</TableHead>
                            <TableHead className="text-neutral-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                                <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                                    No events found. Create your first event!
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <TableRow key={event.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className="font-medium text-white">
                                        {event.title}
                                        <div className="text-xs text-neutral-500 mt-1">{event.slug}</div>
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
                                        {new Date(event.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={event.is_published ? "default" : "secondary"} className={event.is_published ? "bg-green-600/20 text-green-400 hover:bg-green-600/30" : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"}>
                                            {event.is_published ? "Published" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
                                        {/* Placeholder for registration count */}
                                        -
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/events/${event.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/events/${event.slug}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-neutral-800">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            {/* Delete button (will need client component for action) */}
                                            <form action={async () => {
                                                "use server";
                                                const { deleteEvent } = await import("@/services/eventService");
                                                await deleteEvent(event.id);
                                            }}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-neutral-800">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
