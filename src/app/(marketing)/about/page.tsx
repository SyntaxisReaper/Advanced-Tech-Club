import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata = {
    title: "About Us - Advanced Tech Club",
    description: "Learn more about our mission and community.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-[#9D4EDD] text-neutral-400">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>

                <div className="bg-[#474B4F]/80 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-neutral-700/50 shadow-2xl relative overflow-hidden group">
                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9D4EDD]/10 rounded-full blur-3xl -z-10 group-hover:bg-[#9D4EDD]/20 transition-all duration-700" />

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#5A189A]">Us</span>
                    </h1>

                    <div className="prose prose-invert max-w-none space-y-6 text-neutral-200 text-lg leading-relaxed">
                        <p className="font-medium text-xl text-white">
                            Welcome to the Advanced Tech Club.
                        </p>

                        <p>
                            We are a community of student developers, security researchers, and tech enthusiasts dedicated to pushing the boundaries of what’s possible.
                        </p>

                        <p>
                            In an era where technology evolves daily, traditional learning isn't enough. We bridge the gap between theory and practice by building real-world projects, exploring cutting-edge AI, and understanding the security systems that protect our digital lives.
                        </p>

                        <div className="my-8 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800 border-l-4 border-l-[#9D4EDD]">
                            <p className="italic text-neutral-300 m-0">
                                "Whether you're writing your first line of code or deploying complex neural networks, this is your space to build, break, and learn together."
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-neutral-700/50 flex flex-wrap gap-4">
                        <Badge variant="outline" className="text-[#9D4EDD] border-[#9D4EDD]/30 px-3 py-1 text-sm">Innovation</Badge>
                        <Badge variant="outline" className="text-[#9D4EDD] border-[#9D4EDD]/30 px-3 py-1 text-sm">Community</Badge>
                        <Badge variant="outline" className="text-[#9D4EDD] border-[#9D4EDD]/30 px-3 py-1 text-sm">Open Source</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
