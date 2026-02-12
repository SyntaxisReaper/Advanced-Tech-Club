import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Create New Event</h1>
                <p className="text-neutral-400 mt-1">Add a new workshop or session.</p>
            </div>
            <EventForm />
        </div>
    );
}
