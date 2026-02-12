import { getAllRegistrations } from "@/services/userService";
import { getEvents } from "@/services/eventService";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminRegistrationsPage() {
    const registrations = await getAllRegistrations();
    const events = await getEvents(true); // Get all events to map slug to title

    const eventMap = new Map(events.map(e => [e.slug, e.title]));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Registrations</h1>
                <p className="text-neutral-400 mt-1">View all user registrations for events.</p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-950">
                        <TableRow className="border-neutral-800 hover:bg-neutral-950">
                            <TableHead className="text-neutral-400">User</TableHead>
                            <TableHead className="text-neutral-400">Event</TableHead>
                            <TableHead className="text-neutral-400">Registered At</TableHead>
                            <TableHead className="text-neutral-400">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.length === 0 ? (
                            <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                                <TableCell colSpan={4} className="text-center py-8 text-neutral-500">
                                    No registrations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            registrations.map((reg) => (
                                <TableRow key={reg.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className="font-medium text-white">
                                        <div className="flex flex-col">
                                            <span>{reg.full_name || "Unknown User"}</span>
                                            <span className="text-xs text-neutral-500">{reg.email || "No Email"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
                                        {eventMap.get(reg.event_slug) || reg.event_slug}
                                    </TableCell>
                                    <TableCell className="text-neutral-300">
                                        {new Date(reg.created_at).toLocaleDateString()} {new Date(reg.created_at).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10">
                                            Confirmed
                                        </Badge>
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
