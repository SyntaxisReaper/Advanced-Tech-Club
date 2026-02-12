import { getAllMdxContent, readMdxFile } from "./mdxUtils";

export interface EventMetadata {
    title: string;
    date: string;
    description: string;
    location: string;
    image?: string;
    registrationLink?: string;
    feedbackLink?: string;
    tags?: string[];
    isPublished?: boolean;
}

export interface Event extends EventMetadata {
    slug: string;
    content: string;
}

export function getAllEvents(): Event[] {
    const events = getAllMdxContent("events");

    return events
        .map((event) => ({
            ...event.metadata,
            slug: event.slug,
            content: event.content,
        } as Event))
        .filter((event) => event.isPublished !== false) // Default to true if undefined
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getEventBySlug(slug: string): Event | null {
    try {
        const { data, content } = readMdxFile("events", `${slug}.mdx`);
        return {
            ...data,
            slug,
            content,
        } as Event;
    } catch (error) {
        return null;
    }
}
