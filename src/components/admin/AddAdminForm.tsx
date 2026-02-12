"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { addAdminAction } from "@/app/actions/adminActions";

export function AddAdminForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    async function clientAction(formData: FormData) {
        setError(null);
        startTransition(async () => {
            const result = await addAdminAction(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <div className="space-y-2">
            <form action={clientAction} className="flex gap-2 max-w-md">
                <Input
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    className="bg-neutral-950 border-neutral-800 text-white"
                />
                <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    Add
                </Button>
            </form>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
