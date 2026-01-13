"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { performGlobalSearch } from "@/app/actions/global-search";

interface GlobalSearchInputProps {
    className?: string;
    placeholder?: string;
}

export default function GlobalSearchInput({
    className,
    placeholder = "İş makinesi, parça veya hizmet ara...",
}: GlobalSearchInputProps) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (!query.trim()) return;
        router.push(`/ilanlar?q=${encodeURIComponent(query.trim())}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className={cn("relative group w-full max-w-2xl mx-auto", className)}>
            {/* Glow Effect */}
            <div
                className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-orange-600/50 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
            />

            <div className="relative flex items-center">
                {/* Glass Container */}
                <div className="relative w-full overflow-hidden rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 group-hover:bg-white/15">
                    <div className="flex items-center px-4 h-14 md:h-16">
                        <Search className="h-6 w-6 text-white/70 mr-3 shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="w-full h-full bg-transparent text-white placeholder:text-white/50 text-lg outline-none selection:bg-primary/30 min-w-0"
                        />

                        {/* Right Side Action (Optional - Search Button) */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSearch}
                            className="ml-2 hidden md:flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-black font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            ARA
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
