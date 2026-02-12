"use client";

import { useTransition, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Need to check if Switch exists, probably not, use checkbox
import { createEventAction, updateEventAction } from "@/app/actions/adminActions"; // We need to handle this properly 
// Since form actions in client components need to be passed or executed.
// Ideally use `useFormState` or similar, but for simplicity we can use standard form action for now 
// OR wrap the action.

import { Event } from "@/types/events";

interface EventFormProps {
    event?: Event;
    isEdit?: boolean;
}

export function EventForm({ event, isEdit = false }: EventFormProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = isEdit
                ? await updateEventAction(event.id, formData)
                : await createEventAction(formData);

            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <form action={clientAction} className="space-y-8 max-w-2xl bg-neutral-900 p-8 rounded-lg border border-neutral-800">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Title</Label>
                        <Input id="title" name="title" required defaultValue={event?.title} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-white">Slug</Label>
                        <Input id="slug" name="slug" required defaultValue={event?.slug} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-white">Date (ISO Format)</Label>
                        <Input id="date" name="date" required defaultValue={event?.date} placeholder="2026-02-17T10:00:00Z" className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-white">Location</Label>
                        <Input id="location" name="location" required defaultValue={event?.location} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Short Description</Label>
                    <Textarea id="description" name="description" required defaultValue={event?.description} className="bg-neutral-950 border-neutral-800 text-white min-h-[100px]" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content" className="text-white">Content (Markdown)</Label>
                    <Textarea id="content" name="content" defaultValue={event?.content} className="bg-neutral-950 border-neutral-800 text-white min-h-[300px] font-mono" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image" className="text-white">Image URL</Label>
                    <Input id="image" name="image" defaultValue={event?.image} className="bg-neutral-950 border-neutral-800 text-white" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="registration_link" className="text-white">Registration Link</Label>
                        <Input id="registration_link" name="registration_link" defaultValue={event?.registration_link} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="feedback_link" className="text-white">Feedback Link</Label>
                        <Input id="feedback_link" name="feedback_link" defaultValue={event?.feedback_link} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags" className="text-white">Tags (Comma separated)</Label>
                    <Input id="tags" name="tags" defaultValue={event?.tags?.join(", ")} className="bg-neutral-950 border-neutral-800 text-white" />
                </div>

                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="is_published" name="is_published" defaultChecked={event?.is_published ?? true} className="h-4 w-4 bg-neutral-950 border-neutral-800 rounded" />
                    <Label htmlFor="is_published" className="text-white">Published</Label>
                </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {isPending ? "Saving..." : (isEdit ? "Update Event" : "Create Event")}
            </Button>
        </form>
    );
}
