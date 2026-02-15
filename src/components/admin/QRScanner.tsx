"use client";

import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState, useTransition } from "react";
import { checkInUser } from "@/app/actions/gamificationActions";
import { Loader2, CheckCircle2, XCircle, Zap, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QRScanner() {
    const [scanResult, setScanResult] = useState<{
        success?: boolean;
        message?: string;
        user?: { username: string; xp: number; rank: string };
        newXp?: number;
    } | null>(null);

    const [isPending, startTransition] = useTransition();
    const [permissionGranted, setPermissionGranted] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Initial permission check and setup
    useEffect(() => {
        // Check if camera permission is already granted
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                // Devices found, permission likely granted or queryable
                // We don't auto-start to avoid jarring UX, user clicks start
            }
        }).catch(err => {
            console.log("Permissions not granted yet", err);
        });

        return () => {
            if (scannerRef.current) {
                try {
                    scannerRef.current.clear();
                } catch (e) {
                    console.error("Error clearing scanner", e);
                }
            }
        };
    }, []);

    const startScanning = () => {
        setPermissionGranted(true);
        // Use a slight timeout to ensure DOM is ready
        setTimeout(() => {
            if (!scannerRef.current) {
                const scanner = new Html5QrcodeScanner(
                    "reader",
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                        showTorchButtonIfSupported: true,
                        videoConstraints: {
                            facingMode: "environment"
                        }
                    },
                    /* verbose= */ false
                );

                scanner.render(onScanSuccess, onScanFailure);
                scannerRef.current = scanner;
            }
        }, 300); // Increased timeout slightly
    };

    function onScanSuccess(decodedText: string) {
        if (isPending || scanResult?.success) return; // Debounce

        startTransition(async () => {
            try {
                if (decodedText.length < 10) return;

                const result = await checkInUser(decodedText);
                setScanResult(result);

                // Stop scanning on success to show result clearly
                if (result.success && scannerRef.current) {
                    scannerRef.current.pause(true);
                }

            } catch (error) {
                console.error(error);
                setScanResult({ success: false, message: "Network or Server Error" });
            }
        });
    }

    function onScanFailure(error: any) {
        // handle scan failure
    }

    const resetScan = () => {
        setScanResult(null);
        if (scannerRef.current) {
            scannerRef.current.resume();
        }
    };

    return (
        <div className="max-w-md mx-auto my-8 space-y-6">
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-black min-h-[350px] flex flex-col justify-center">
                {!permissionGranted ? (
                    <div className="text-center p-8">
                        <div className="bg-neutral-900 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                            <Camera className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Camera Access Required</h3>
                        <p className="text-neutral-400 mb-6">Please allow camera access to scan Protocol Passes.</p>
                        <Button onClick={startScanning} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                            Enable Camera & Start Scanning
                        </Button>
                    </div>
                ) : !scanResult ? (
                    <div id="reader" className="w-full h-full" />
                ) : (
                    <div className={`p-8 flex flex-col items-center justify-center h-full text-center ${scanResult.success ? 'bg-green-950/20' : 'bg-red-950/20'}`}>
                        {scanResult.success ? (
                            <>
                                <CheckCircle2 className="w-24 h-24 text-green-500 mb-4 animate-in zoom-in duration-300" />
                                <h2 className="text-3xl font-bold text-white mb-2">ACCESS GRANTED</h2>
                                <p className="text-green-400 mb-6">{scanResult.message}</p>

                                {scanResult.user && (
                                    <div className="bg-neutral-900/90 p-6 rounded-xl border border-neutral-800 w-full animate-in slide-in-from-bottom duration-500 shadow-xl">
                                        <div className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Member Identity</div>
                                        <div className="text-2xl font-bold text-white mb-1">{scanResult.user.username}</div>
                                        <div className="flex items-center justify-center text-amber-500 font-mono mb-4">
                                            <Zap className="w-4 h-4 mr-1" />
                                            {scanResult.user.rank}
                                        </div>
                                        <div className="pt-4 border-t border-neutral-800 flex justify-between items-center px-4">
                                            <span className="text-neutral-400 text-sm">Reward</span>
                                            <span className="text-green-400 font-bold font-mono text-lg">+50 XP</span>
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

            {permissionGranted && !scanResult && (
                <div className="text-center text-neutral-500 text-sm">
                    Point camera at a Member Protocol Pass to verify access.
                </div>
            )}
        </div>
    );
}
