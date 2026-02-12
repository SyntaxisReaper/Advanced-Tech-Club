import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllEvents } from "@/lib/mdx/mdxLoader";
// import { getTotalRegistrations } from "@/services/eventService"; // To be implemented

export default async function AdminDashboard() {
    // Temporary placeholder stats until DB migration
    const events = getAllEvents();
    const totalEvents = events.length;
    const totalRegistrations = 0; // Placeholder

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-neutral-400 mt-2">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Total Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalEvents}</div>
                        <p className="text-xs text-neutral-500 mt-1">Published workshops & sessions</p>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Total Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalRegistrations}</div>
                        <p className="text-xs text-neutral-500 mt-1">Across all events</p>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900 border-neutral-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">-</div>
                        <p className="text-xs text-neutral-500 mt-1">Registered members</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
