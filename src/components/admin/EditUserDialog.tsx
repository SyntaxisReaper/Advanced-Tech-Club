"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData, updateUserStats } from "@/app/actions/userManagementActions";
import { Pencil, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface EditUserDialogProps {
    user: UserData;
}

const RANKS = ["Localhost 🏠", "Daemon 👻", "Node 🟢", "Hypervisor 🏗️", "Singularity 🌌"];

export function EditUserDialog({ user }: EditUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [rank, setRank] = useState(user.rank);
    const [xp, setXp] = useState(user.xp.toString());

    const handleSave = () => {
        startTransition(async () => {
            const xpVal = parseInt(xp);
            if (isNaN(xpVal)) {
                // toast.error("Invalid XP value");
                alert("Invalid XP value");
                return;
            }

            const result = await updateUserStats(user.id, rank, xpVal);
            if (result.success) {
                setOpen(false);
                // toast.success("User updated!");
            } else {
                console.error(result.message);
                alert(result.message);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User: {user.username}</DialogTitle>
                    <DialogDescription>
                        Manually adjust Rank and XP. Changes are immediate.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rank" className="text-right text-neutral-400">
                            Rank
                        </Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="col-span-3 bg-neutral-800 border-neutral-700 text-white justify-between">
                                    {rank}
                                    <span className="opacity-50">▼</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white">
                                {RANKS.map((r) => (
                                    <DropdownMenuItem
                                        key={r}
                                        onClick={() => setRank(r)}
                                        className="hover:bg-neutral-700 cursor-pointer"
                                    >
                                        {r}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="xp" className="text-right text-neutral-400">
                            XP
                        </Label>
                        <Input
                            id="xp"
                            type="number"
                            value={xp}
                            onChange={(e) => setXp(e.target.value)}
                            className="col-span-3 bg-neutral-800 border-neutral-700 text-white"
                        />
                    </div>
                </div>
                <div className="bg-neutral-950/50 p-3 rounded-md text-xs text-neutral-500 mb-4 max-h-32 overflow-y-auto">
                    <p className="font-bold mb-1">Registrations:</p>
                    {user.registrations.length === 0 ? (
                        <p>None</p>
                    ) : (
                        <ul className="list-disc pl-4 space-y-1">
                            {user.registrations.map((reg) => (
                                <li key={reg.id}>
                                    {reg.event_slug} {reg.checked_in ? "✅" : "⏳"}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={isPending}
                        onClick={handleSave}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
