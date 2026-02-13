"use client";

import { motion } from "framer-motion";
import { Activity, Shield, Wifi, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero3D() {
    return (
        <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
            {/* Main Floating Card */}
            <motion.div
                initial={{ transform: "rotateY(-10deg) rotateX(10deg)" }}
                animate={{
                    transform: [
                        "rotateY(-10deg) rotateX(10deg) translateY(0px)",
                        "rotateY(-5deg) rotateX(5deg) translateY(-20px)",
                        "rotateY(-10deg) rotateX(10deg) translateY(0px)"
                    ]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative w-80 h-96 bg-black/20 backdrop-blur-md border border-neutral-700/50 rounded-2xl p-6 shadow-2xl transform-style-3d"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-neutral-700 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#9D4EDD] animate-pulse" />
                        <span className="text-sm font-mono text-neutral-300">SYSTEM ONLINE</span>
                    </div>
                    <Wifi className="w-4 h-4 text-[#9D4EDD]" />
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Stat visual */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-neutral-400">
                            <span>SECURITY LEVEL</span>
                            <span>98%</span>
                        </div>
                        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "98%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-[#9D4EDD] to-[#5A189A]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 flex flex-col items-center gap-2">
                            <Shield className="w-6 h-6 text-[#9D4EDD]" />
                            <span className="text-xs text-neutral-400">Active Defense</span>
                        </div>
                        <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 flex flex-col items-center gap-2">
                            <Activity className="w-6 h-6 text-[#9D4EDD]" />
                            <span className="text-xs text-neutral-400">Net Traffic</span>
                        </div>
                    </div>

                    {/* Interactive "Buttons" inside the 3D card */}
                    <div className="pt-4 space-y-3">
                        <Button size="sm" className="w-full bg-[#9D4EDD]/10 hover:bg-[#9D4EDD]/20 text-[#9D4EDD] border border-[#9D4EDD]/30 justify-between group">
                            <span className="flex items-center gap-2"><Terminal className="w-4 h-4" /> Run Diagnostics</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </Button>
                        <Button size="sm" variant="ghost" className="w-full text-neutral-400 hover:text-white justify-start">
                            View Logs
                        </Button>
                    </div>
                </div>

                {/* Floating Elements (Badges/Decorations) */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute -right-12 top-10 bg-black/80 backdrop-blur-md border border-[#9D4EDD] p-3 rounded-lg shadow-lg"
                    style={{ transform: "translateZ(40px)" }}
                >
                    <span className="text-xs font-bold text-white">v2.0.4 Live</span>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                    className="absolute -left-8 bottom-20 bg-[#9D4EDD] text-white p-2 rounded-lg shadow-lg flex items-center gap-2"
                    style={{ transform: "translateZ(20px)" }}
                >
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-bold">Optimized</span>
                </motion.div>
            </motion.div>

            {/* Glow backing */}
            <div className="absolute inset-0 bg-[#9D4EDD]/20 blur-[100px] rounded-full -z-10" />
        </div>
    );
}
