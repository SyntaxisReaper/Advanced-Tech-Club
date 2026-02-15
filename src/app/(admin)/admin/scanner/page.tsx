import { QRScanner } from "@/components/admin/QRScanner";
import { Shield } from "lucide-react";

export default function AdminScannerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                    <Shield className="mr-3 h-8 w-8 text-indigo-500" />
                    Security Scanner
                </h1>
                <p className="text-neutral-400 mt-1">Verify Protocol Passes and grant secure access.</p>
            </div>

            <QRScanner />
        </div>
    );
}
