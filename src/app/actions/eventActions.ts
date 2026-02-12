"use server";

import { getEventBySlug } from "@/lib/mdx/mdxLoader";

export async function getEventDetails(slug: string) {
    const event = getEventBySlug(slug);
    if (!event) return null;

    return {
        title: event.title,
        date: event.date,
        location: event.location,
    };
}
