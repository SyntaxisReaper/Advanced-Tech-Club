import { createClient } from "@/lib/supabase/server";
import { Event } from "@/types/events";

export type { Event }; // Re-export for convenience if needed, but better to import from types

export async function getEvents(includeDrafts = false): Promise<Event[]> {
    const supabase = await createClient();
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
    const supabase = await createClient();
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
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateEvent(id: string, updates: Partial<Event>) {
    const supabase = await createClient();
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
    const supabase = await createClient();
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

    if (error) throw error;
}
