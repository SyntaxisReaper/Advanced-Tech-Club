export interface Event {
    id: string;
    slug: string;
    title: string;
    date: string;
    location: string;
    description: string;
    image: string;
    registration_link?: string;
    feedback_link?: string;
    tags: string[];
    is_published: boolean;
    content?: string;
}
