"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ExternalLink } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { getUserRegistrations } from "@/services/userService";
import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// If sonner not present, I might need to adjust imports after checking.

interface RegisterButtonProps {
    eventSlug: string;
    registrationLink?: string;
}

export function RegisterButton({ eventSlug, registrationLink }: RegisterButtonProps) {
    const { user, loading } = useUser();
    const router = useRouter();
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        async function checkStatus() {
            if (user) {
                try {
                    const regs = await getUserRegistrations(user.id);
                    const registered = regs.some(r => r.event_slug === eventSlug);
                    setIsRegistered(registered);
                } catch (error) {
                    console.error("Failed to check registration status", error);
                }
            }
            setCheckingStatus(false);
        }

        if (!loading) {
            checkStatus();
        }
    }, [user, loading, eventSlug]);

    const handleRegister = async () => {
        if (!user) {
            router.push(`/login?next=/events/${eventSlug}`);
            return;
        }

        setRegistering(true);
        try {
            const response = await fetch("/api/register-event", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventSlug }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to register");
            }

            setIsRegistered(true);
            // toast.success("Successfully registered for event!"); 
            alert("Successfully registered for event!"); // Fallback if toast not found
            router.refresh();
        } catch (error: any) {
            // toast.error(error.message);
            alert(error.message);
        } finally {
            setRegistering(false);
        }
    };

    if (loading || checkingStatus) {
        return (
            <Button disabled className="w-full bg-neutral-800 text-neutral-400">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </Button>
        );
    }

    return (
        <div className="space-y-3">
            {registrationLink && (
                <a href={registrationLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button variant="outline" className="w-full border-indigo-500/50 text-indigo-400 hover:bg-neutral-800">
                        <ExternalLink className="mr-2 h-4 w-4" /> Fill Registration Form
                    </Button>
                </a>
            )}

            {isRegistered ? (
                <Button disabled className="w-full bg-green-600/20 text-green-500 border border-green-600/50 font-bold">
                    <Check className="mr-2 h-4 w-4" /> Registered
                </Button>
            ) : (
                <Button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                    {registering ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                        </>
                    ) : (
                        "Register Now"
                    )}
                </Button>
            )}
        </div>
    );
}
