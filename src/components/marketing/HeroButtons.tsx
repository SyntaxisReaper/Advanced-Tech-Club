"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroButtons() {
    return (
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Button size="lg" className="w-full sm:w-auto bg-[#9D4EDD] hover:bg-[#5A189A] text-white font-semibold px-8 shadow-[0_0_15px_rgba(157,78,221,0.5)] hover:shadow-[0_0_25px_rgba(157,78,221,0.8)] transition-all duration-300 border border-[#9D4EDD]/50">
                        Join the Club <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </motion.div>
            </Link>
            <Link href="/events">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#9D4EDD]/30 text-neutral-300 hover:bg-[#9D4EDD]/10 hover:text-white hover:border-[#9D4EDD] shadow-[0_0_10px_rgba(157,78,221,0.1)] hover:shadow-[0_0_20px_rgba(157,78,221,0.4)] transition-all duration-300 backdrop-blur-sm bg-black/20">
                        Explore Events
                    </Button>
                </motion.div>
            </Link>
        </div>
    );
}
