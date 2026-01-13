"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Construction,
    Truck,
    Warehouse,
    Tractor,
    Wrench,
    Hammer,
    Pickaxe,
    Zap,
    Wind,
    ArrowUpRight,
    Cylinder,
    LayoutGrid,
    CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
    sort_order: number;
}

interface CategoryStripProps {
    categories: Category[];
}

const iconMap: Record<string, any> = {
    "Ekskavatör": Construction,
    "Bekoloder": Tractor,
    "Loder (Yükleyici)": Truck,
    "Forklift": Warehouse,
    "Telehandler (Teleskobik Yükleyici)": ArrowUpRight,
    "Mobil Vinç": Wind,
    "Greyder": Zap,
    "Dozer": CircleDot,
    "Silindir": Cylinder,
    "Diğer Makineler": LayoutGrid,
};

export default function CategoryStrip({ categories }: CategoryStripProps) {
    return (
        <section className="relative z-20 -mt-10 mb-8 border-y border-white/5 bg-neutral-900/95 backdrop-blur-md py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-4 md:gap-8 overflow-x-auto pb-4 pt-2 snap-x scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category, index) => {
                        const Icon = iconMap[category.name] || Construction;
                        const categorySlug = category.name.toLowerCase()
                            .replace(/ğ/g, "g")
                            .replace(/ü/g, "u")
                            .replace(/ş/g, "s")
                            .replace(/ı/g, "i")
                            .replace(/ö/g, "o")
                            .replace(/ç/g, "c")
                            .replace(/\s+/g, "-")
                            .replace(/[()]/g, ""); // Remove parentheses for slug

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="snap-start shrink-0"
                            >
                                <Link
                                    href={`/ilanlar?category=${category.id}`}
                                    className="group flex flex-col items-center gap-3"
                                >
                                    <div className={cn(
                                        "flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900",
                                        "transition-all duration-300",
                                        "group-hover:border-primary group-hover:bg-neutral-900",
                                        "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]",
                                        "group-hover:-translate-y-1"
                                    )}>
                                        <Icon className="h-6 w-6 md:h-8 md:w-8 stroke-[1.5] text-white/80 transition-all duration-300 group-hover:scale-110 group-hover:stroke-[2] group-hover:text-primary" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-neutral-500 transition-colors group-hover:text-primary text-center max-w-[80px] md:max-w-[100px]">
                                        {category.name}
                                    </span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

