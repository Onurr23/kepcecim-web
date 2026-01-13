"use client";

import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SellerBanner() {
    return (
        <section className="relative w-full overflow-hidden bg-neutral-900 border-t border-white/10 py-12 md:py-16">
            {/* Background Texture - Striped */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                    backgroundSize: '10px 10px'
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">

                    {/* Left Side: Text Content */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left">
                        <div className="mb-2 flex items-center gap-2 text-orange-500">
                            <Store className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-widest">Kurumsal Üyelik</span>
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
                            MAKİNENİ <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">HIZLI SAT.</span>
                        </h2>
                        <p className="mt-4 max-w-xl text-lg text-neutral-400">
                            Türkiye'nin en büyük iş makinesi pazar yerinde ücretsiz mağazanı aç, binlerce alıcıya anında ulaş.
                        </p>
                    </div>

                    {/* Right Side: CTA Button */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/kurumsal/magaza-ac"
                            className={cn(
                                "group flex items-center gap-4 rounded-xl px-8 py-4",
                                "bg-white text-black text-lg font-black tracking-wide", // Solid White, Black Text, Heavy Font
                                "transition-all duration-300",
                                "hover:bg-gray-200 hover:scale-105 shadow-xl shadow-white/5"
                            )}
                        >
                            <span>ÜCRETSİZ MAĞAZA AÇ</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
