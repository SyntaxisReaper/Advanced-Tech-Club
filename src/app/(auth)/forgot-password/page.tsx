"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "../../actions/authActions";
import { Loader2, ArrowLeft } from "lucide-react";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const result = await resetPassword(values.email);
            if (result.success) {
                setMessage(result.message || "Reset link sent.");
            } else {
                setError(result.message || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <div className="bg-[#474B4F]/80 backdrop-blur-md px-6 py-8 shadow rounded-lg sm:px-10 border border-neutral-700/50">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                            {message && (
                                <div className="bg-green-500/10 border border-green-500 text-green-500 text-sm p-3 rounded-md">
                                    {message}
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-300">Email address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="john@example.com" className="bg-neutral-950 border-neutral-800 text-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Reset Link
                            </Button>
                        </form>
                    </Form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="flex items-center justify-center text-sm font-medium text-indigo-500 hover:text-indigo-400">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
