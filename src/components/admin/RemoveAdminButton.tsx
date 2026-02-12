"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { removeAdminAction } from "@/app/actions/adminActions";

export function RemoveAdminButton({ email }: { email: string }) {
    const [isPending, startTransition] = useTransition();

    async function clientAction() {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", email);
            await removeAdminAction(formData);
        });
    }

    return (
        <form action={clientAction}>
            <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-neutral-900"
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
        </form>
    );
}
