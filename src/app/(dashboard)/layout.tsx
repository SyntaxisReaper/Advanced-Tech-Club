import { Sidebar } from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-[calc(100vh-4rem)]"> {/* 4rem for Navbar height */}
                <aside className="hidden md:block fixed h-[calc(100vh-4rem)] top-16">
                    <Sidebar />
                </aside>
                <main className="flex-1 md:ml-64 bg-neutral-950 p-6 md:p-10">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
