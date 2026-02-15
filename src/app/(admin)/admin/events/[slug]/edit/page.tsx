import { EventForm } from "@/components/admin/EventForm";
import { getEventBySlug } from "@/services/eventService";
import { notFound } from "next/navigation";

export default async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Edit Event</h1>
                <p className="text-neutral-400 mt-1">Update event details.</p>
            </div>
            <EventForm event={event} isEdit={true} />
        </div>
    );
}
