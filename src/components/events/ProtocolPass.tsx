"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Badge } from "@/components/ui/badge";
import { MoveRight, Zap } from "lucide-react";

interface ProtocolPassProps {
    eventName: string;
    date: string;
    location: string;
    username: string;
    rank: string;
    ticketSecret: string;
    checkedIn: boolean;
}

export function ProtocolPass({
    eventName,
    date,
    location,
    username,
    rank,
    ticketSecret,
    checkedIn,
}: ProtocolPassProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div className="perspective-1000 w-full max-w-sm mx-auto my-8">
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transition: "transform 0.1s ease-out",
                }}
                className={`
          relative overflow-hidden rounded-xl border border-neutral-700/50 
          bg-neutral-900/90 shadow-2xl backdrop-blur-xl
          bg-[url('/noise.png')] bg-blend-overlay
          group select-none
        `}
            >
                {/* Holographic Sheen */}
                <div
                    className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-cyan-500/30 to-purple-500/30 pointer-events-none group-hover:opacity-40 transition-opacity"
                    style={{
                        transform: `translate(${rotation.y * 2}px, ${rotation.x * 2}px)`,
                    }}
                />

                {/* Status Indicators */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500" />

                <div className="p-6 relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-[10px] tracking-[0.2em] text-cyan-500 font-mono mb-1 uppercase">
                                Protocol Pass
                            </div>
                            <h3 className="text-xl font-bold text-white leading-tight">
                                {eventName}
                            </h3>
                        </div>
                        {checkedIn ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30 uppercase font-mono tracking-wider text-xs">
                                Access Granted
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-amber-400 border-amber-500/50 bg-amber-900/10 uppercase font-mono tracking-wider text-xs animate-pulse">
                                Standby
                            </Badge>
                        )}
                    </div>

                    {/* QR Code Section */}
                    <div className="bg-white p-3 rounded-lg w-fit mx-auto mb-6 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 128, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={ticketSecret}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <div className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase mb-1">Authorization Code</div>
                        <div className="font-mono text-xs text-neutral-400 break-all">{ticketSecret.slice(0, 8)}...{ticketSecret.slice(-8)}</div>
                    </div>

                    {/* User Details */}
                    <div className="border-t border-neutral-800 pt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {username.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-white">{username}</div>
                                <div className="text-xs text-purple-400 flex items-center">
                                    <Zap className="w-3 h-3 mr-1" />
                                    {rank}
                                </div>
                            </div>
                        </div>
                        <MoveRight className="text-neutral-600 w-5 h-5" />
                    </div>
                </div>

                {/* Footer info */}
                <div className="bg-black/40 p-3 flex justify-between items-center text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <span>{location}</span>
                </div>
            </div>

            {/* Reflection element under the card */}
            <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/50 blur-xl rounded-full opacity-40 mx-auto w-[90%]" />
        </div>
    );
}
