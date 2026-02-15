"use client";

import { useEffect, useState } from "react";
import { getAllUsersData, UserData } from "@/app/actions/userManagementActions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserButton } from "./DeleteUserButton";
import { Search, Loader2 } from "lucide-react";

export function UserManagementTable() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await getAllUsersData();
            if (result.success && result.users) {
                setUsers(result.users);
            }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((u) =>
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-neutral-500" />
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-neutral-900 border-neutral-800 text-white"
                />
            </div>

            <div className="rounded-md border border-neutral-800 bg-neutral-900 overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-800">
                        <TableRow className="border-neutral-700 hover:bg-neutral-800">
                            <TableHead className="text-neutral-400">Username</TableHead>
                            <TableHead className="text-neutral-400">Email</TableHead>
                            <TableHead className="text-neutral-400">Rank</TableHead>
                            <TableHead className="text-neutral-400 text-right">XP</TableHead>
                            <TableHead className="text-neutral-400 w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-neutral-500 py-8">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableCell className="font-medium text-white">
                                        {user.username}
                                        {user.registrations.length > 0 && (
                                            <Badge variant="outline" className="ml-2 border-indigo-500/30 text-indigo-400 text-[10px] h-5">
                                                {user.registrations.length} Regs
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-neutral-400 text-xs">
                                        {user.email || "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className="bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700"
                                        >
                                            {user.rank}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-white font-mono">
                                        {user.xp}
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <EditUserDialog user={user} />
                                        <DeleteUserButton userId={user.id} username={user.username} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <p className="text-xs text-neutral-500 text-center">
                Access to user management is restricted to Super Admins.
            </p>
        </div>
    );
}
