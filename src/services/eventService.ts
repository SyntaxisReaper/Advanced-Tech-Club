import { createClient } from "@/lib/supabase/client";

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

export async function getEvents(includeDrafts = false): Promise<Event[]> {
    const supabase = createClient();
    let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

    if (!includeDrafts) {
        query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching events:', error);
        return [];
    }
    return data || [];
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching event ${slug}:`, error);
        return null;
    }
    return data;
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateEvent(id: string, updates: Partial<Event>) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteEvent(id: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
