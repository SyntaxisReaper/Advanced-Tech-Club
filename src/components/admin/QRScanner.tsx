"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState, useTransition } from "react";
import { checkInUser } from "@/app/actions/gamificationActions";
import { Loader2, CheckCircle2, XCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QRScanner() {
    const [scanResult, setScanResult] = useState<{
        success?: boolean;
        message?: string;
        user?: { username: string; xp: number; rank: string };
        newXp?: number;
    } | null>(null);

    const [isPending, startTransition] = useTransition();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Initialize Scanner
        // Use a slight timeout to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            if (!scannerRef.current) {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    /* verbose= */ false
                );

                scanner.render(onScanSuccess, onScanFailure);
                scannerRef.current = scanner;
            }
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
    }, []);

    function onScanSuccess(decodedText: string) {
        if (isPending || scanResult?.success) return; // Debounce

        // Pause scanning effectively by ignoring results or clearing
        // For better UX, we just ignore new scans while processing

        startTransition(async () => {
            try {
                // Determine if decodedText is a UUID (ticket secret)
                // Simple check: length
                if (decodedText.length < 10) return;

                const result = await checkInUser(decodedText);
                setScanResult(result);

                // If success, maybe pause scanner for a bit?
                if (result.success) {
                    // Scanner continues running, but we show overlay
                }

            } catch (error) {
                console.error(error);
                setScanResult({ success: false, message: "Network or Server Error" });
            }
        });
    }

    function onScanFailure(error: any) {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${error}`);
    }

    const resetScan = () => {
        setScanResult(null);
    };

    return (
        <div className="max-w-md mx-auto my-8 space-y-6">
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-black">
                {!scanResult ? (
                    <div id="reader" className="w-full" />
                ) : (
                    <div className={`p-8 flex flex-col items-center justify-center min-h-[300px] text-center ${scanResult.success ? 'bg-green-950/30' : 'bg-red-950/30'}`}>
                        {scanResult.success ? (
                            <>
                                <CheckCircle2 className="w-24 h-24 text-green-500 mb-4 animate-in zoom-in duration-300" />
                                <h2 className="text-3xl font-bold text-white mb-2">ACCESS GRANTED</h2>
                                <p className="text-green-400 mb-6">{scanResult.message}</p>

                                {scanResult.user && (
                                    <div className="bg-neutral-900/80 p-6 rounded-xl border border-neutral-800 w-full animate-in slide-in-from-bottom duration-500">
                                        <div className="text-neutral-400 text-sm uppercase tracking-wider mb-2">Identify</div>
                                        <div className="text-2xl font-bold text-white mb-1">{scanResult.user.username}</div>
                                        <div className="flex items-center justify-center text-amber-500 font-mono">
                                            <Zap className="w-4 h-4 mr-1" />
                                            {scanResult.user.rank}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-neutral-800">
                                            <span className="text-green-400 font-bold">+50 XP</span> Awarded
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <XCircle className="w-24 h-24 text-red-500 mb-4 animate-in zoom-in magnitude-150 duration-300" />
                                <h2 className="text-3xl font-bold text-white mb-2">UNAUTHORIZED</h2>
                                <p className="text-red-400 mb-6">{scanResult.message}</p>
                            </>
                        )}

                        <Button onClick={resetScan} className="mt-8 bg-neutral-100 text-black hover:bg-white w-full">
                            Scan Next Member
                        </Button>
                    </div>
                )}
                {/* Overlay loading state */}
                {isPending && !scanResult && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="text-center">
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                            <p className="text-indigo-400 font-mono animate-pulse">VERIFYING DECRYPTION KEY...</p>
                        </div>
                    </div>
                )}
            </div>

            {!scanResult && (
                <div className="text-center text-neutral-500 text-sm">
                    Point camera at a Member Protocol Pass to verify access.
                </div>
            )}
        </div>
    );
}
