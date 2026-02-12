"use server";

import { getEventBySlug } from "@/services/eventService";

export async function getEventDetails(slug: string) {
    const event = await getEventBySlug(slug);
    if (!event) return null;

    return {
        title: event.title,
        date: event.date,
        location: event.location,
    };
}
