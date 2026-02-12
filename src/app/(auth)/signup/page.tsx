"use client";

import { useState } from "react";
import Link from "next/link";
// import { useUtilityUser } from "@/hooks/useUser"; // Assuming hooks/useUser is correct path
// Correction: Avoiding circular deps if userUser is strictly for session reading.
// Using standard form submission for now.

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
import { signup, loginWithGoogle } from "../actions";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    fullName: z.string().min(2, {
        message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append("fullName", values.fullName);
        formData.append("email", values.email);
        formData.append("password", values.password);

        const result = await signup(formData);
        if (result?.error) {
            setError(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-400">
                        Or{" "}
                        <Link href="/login" className="font-medium text-indigo-500 hover:text-indigo-400">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                <div className="bg-neutral-900 px-6 py-8 shadow rounded-lg sm:px-10 border border-neutral-800">
                    <form action={async (formData) => { await loginWithGoogle(formData); }} className="mb-6">
                        <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-200 border-0">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Sign up with Google
                        </Button>
                    </form>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-neutral-900 px-2 text-neutral-500">Or continue with email</span>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-300">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" className="bg-neutral-950 border-neutral-800 text-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-300">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" className="bg-neutral-950 border-neutral-800 text-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign up
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
