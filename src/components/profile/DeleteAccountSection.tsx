"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMyAccount } from "@/app/actions/userManagementActions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

export function DeleteAccountSection() {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            const result = await deleteMyAccount();
            if (result.success) {
                router.push("/"); // Redirect to home
            } else {
                alert(result.message || "Failed to delete account");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An unexpected error occurred");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="mt-12 border-t border-red-900/30 pt-8">
            <h3 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
            <div className="bg-red-950/10 border border-red-900/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="font-medium text-white">Delete Account</h4>
                    <p className="text-sm text-neutral-400">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-neutral-900 border-neutral-800 text-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-500">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-neutral-400">
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700 hover:text-white">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteAccount();
                                }}
                                className="bg-red-600 text-white hover:bg-red-700 border-none"
                                disabled={deleting}
                            >
                                {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Yes, delete my account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
