"use client";

import { motion } from "framer-motion";
import React from "react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    index: number;
}

export function MotionFeatureCard({ icon, title, description, index }: FeatureCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
                scale: 1.02,
                boxShadow: "0 0 20px rgba(157, 78, 221, 0.3)",
                borderColor: "rgba(157, 78, 221, 0.6)"
            }}
            className="p-6 rounded-2xl bg-[#474B4F]/40 backdrop-blur-md border border-neutral-700/50 transition-all duration-300"
        >
            <div className="mb-4 p-3 bg-[#9D4EDD]/10 rounded-lg w-fit border border-[#9D4EDD]/20">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-neutral-400">{description}</p>
        </motion.div>
    );
}
