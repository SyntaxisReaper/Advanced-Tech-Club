import { getLeaderboard } from "@/app/actions/userManagementActions";
import { Trophy, Medal, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export async function Leaderboard() {
    const { leaderboard } = await getLeaderboard();
    const topUsers = leaderboard || [];

    return (
        <div className="w-full max-w-4xl mx-auto bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    Top Contributors
                </h2>
                <p className="text-neutral-400">The elite hackers of our community.</p>
            </div>

            <div className="space-y-4">
                {topUsers.length === 0 ? (
                    <div className="text-center text-neutral-500 py-8">
                        No ranked players yet. Be the first!
                    </div>
                ) : (
                    topUsers.map((user, index) => (
                        <div
                            key={user.username}
                            className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50 hover:border-indigo-500/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-8 text-center font-bold text-neutral-500">
                                    {index === 0 && <Crown className="h-6 w-6 text-yellow-500 mx-auto" />}
                                    {index === 1 && <Medal className="h-6 w-6 text-gray-400 mx-auto" />}
                                    {index === 2 && <Medal className="h-6 w-6 text-amber-700 mx-auto" />}
                                    {index > 2 && `#${index + 1}`}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-lg">{user.username || "Anonymous"}</div>
                                    <div className="text-xs text-neutral-400">{user.rank}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
                                    {user.xp.toLocaleString()} XP
                                </Badge>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
