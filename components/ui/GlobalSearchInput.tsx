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
        // Arama sonuçlarının ilanlar sayfasında görünmesi için
        // doğrudan varsayılan "satılık" sekmesine, query parametresiyle yönlendiriyoruz.
        router.push(`/ilanlar/satilik?q=${encodeURIComponent(query.trim())}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className={cn("relative group w-full max-w-3xl mx-auto", className)}>
            {/* Glow Effect */}
            <div
                className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-orange-600/50 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
            />

            <div className="relative flex items-center">
                {/* Glass Container */}
                <div className="relative w-full flex items-center bg-neutral-900/60 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl shadow-black/50 transition-all duration-300 group-hover:bg-neutral-900/70 h-16">

                    <div className="flex-1 flex items-center px-4 h-full pl-6">
                        <Search className="h-5 w-5 text-white/50 mr-3 shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Marka, model veya ilan no ara..."
                            className="w-full h-full bg-transparent text-white placeholder:text-gray-400 text-lg outline-none selection:bg-primary/30 min-w-0"
                        />
                    </div>

                    {/* Search Button */}
                    <div className="p-1.5">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSearch}
                            className="flex items-center justify-center h-12 px-8 rounded-full bg-orange-600 text-white font-semibold text-base hover:bg-orange-700 transition-colors shadow-lg"
                        >
                            ARA
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
