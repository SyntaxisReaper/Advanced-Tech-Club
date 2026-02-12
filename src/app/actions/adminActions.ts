"use server";

import { createEvent, updateEvent, deleteEvent } from "@/services/eventService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/admin";

async function checkAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !(await isAdmin(user.email))) {
        throw new Error("Unauthorized");
    }
}

export async function checkIsAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    return await isAdmin(user.email);
}

export async function createEventAction(formData: FormData) {
    await checkAdmin();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const date = formData.get("date") as string; // ISO string expected
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const registration_link = formData.get("registration_link") as string;
    const feedback_link = formData.get("feedback_link") as string;
    const tagsString = formData.get("tags") as string; // Comma separated
    const is_published = formData.get("is_published") === "on";

    const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);

    try {
        await createEvent({
            slug,
            title,
            date,
            location,
            description,
            content,
            image,
            registration_link,
            feedback_link,
            tags,
            is_published
        });
    } catch (error) {
        console.error("Error creating event:", error);
        return { error: "Failed to create event" };
    }

    revalidatePath("/events");
    revalidatePath("/admin/events");
    redirect("/admin/events");
}

export async function updateEventAction(id: string, formData: FormData) {
    await checkAdmin();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string; // Usually slug updates are tricky, let's allow it but warn user
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const registration_link = formData.get("registration_link") as string;
    const feedback_link = formData.get("feedback_link") as string;
    const tagsString = formData.get("tags") as string;
    const is_published = formData.get("is_published") === "on";

    const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);

    try {
        await updateEvent(id, {
            slug,
            title,
            date,
            location,
            description,
            content,
            image,
            registration_link,
            feedback_link,
            tags,
            is_published
        });
    } catch (error: any) {
        console.error("Error updating event:", error);
        return { error: error.message || "Failed to update event" };
    }

    revalidatePath("/events");
    revalidatePath(`/events/${slug}`);
    revalidatePath("/admin/events");
    redirect("/admin/events");
}

export async function deleteEventAction(id: string) {
    await checkAdmin();
    await deleteEvent(id);
    revalidatePath("/events");
    revalidatePath("/admin/events");
}

export async function addAdminAction(formData: FormData) {
    await checkAdmin();
    const email = formData.get("email") as string;
    if (!email) return { error: "Email is required" };

    const supabase = await createClient();
    const { error } = await supabase
        .from("admins")
        .insert({ email });

    if (error) {
        console.error("Error adding admin:", error);
        return { error: "Failed to add admin" };
    }

    revalidatePath("/admin/settings");
}

export async function removeAdminAction(formData: FormData) {
    await checkAdmin();
    const email = formData.get("email") as string;
    if (!email) return { error: "Email is required" };

    // Prevent removing self if there's no other admin? 
    // Or just prevent removing the super admins from the code.
    const SUPER_ADMINS = ["syntaxisreaper@gmail.com"];
    if (SUPER_ADMINS.includes(email)) {
        return { error: "Cannot remove super admin" };
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from("admins")
        .delete()
        .eq("email", email);

    if (error) {
        console.error("Error removing admin:", error);
        return { error: "Failed to remove admin" };
    }

    revalidatePath("/admin/settings");
}
