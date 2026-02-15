"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "@/app/actions/userManagementActions";

export function DeleteUserButton({ userId, username }: { userId: string; username: string }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteUser(userId);
            if (result.success) {
                // Table auto-revalidates via server action
                setOpen(false);
            } else {
                alert(result.message || "Failed to delete user");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 ml-1"
                    title="Delete User"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-neutral-900 border-neutral-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="h-5 w-5" />
                        Delete User?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-neutral-400">
                        Are you sure you want to delete <span className="font-bold text-white">{username}</span>?
                        <br /><br />
                        This action cannot be undone. All their data (XP, Rank, Registrations) will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700 hover:text-white">Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Delete Permanently
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
