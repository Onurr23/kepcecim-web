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
import { slugify } from "@/utils/slugify";

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
        <section className="relative z-20 pt-24 pb-16 px-4">
            <div className="mx-auto max-w-7xl">
                {/* Mobile: Horizontal Scroll | Tablet/Desktop: Grid */}
                <div className="flex overflow-x-auto snap-x sm:grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {categories.map((category, index) => {
                        const Icon = iconMap[category.name] || Construction;
                        // Use explicit slug from category object if available, otherwise slugify name
                        const categorySlug = (category as any).slug || slugify(category.name);

                        return (
                            <Link
                                key={category.id}
                                href={`/ilanlar/${categorySlug}`}
                                className="snap-start shrink-0 group flex flex-col items-center justify-center gap-4 bg-neutral-900/50 border border-white/5 rounded-2xl p-6 min-w-[140px] md:min-w-0 aspect-square transition-all duration-300 cursor-pointer hover:border-orange-500/50 hover:bg-neutral-900"
                            >
                                <Icon className="h-8 w-8 text-neutral-600 transition-all duration-300 group-hover:text-orange-500 group-hover:scale-110" />

                                <span className="text-xs font-medium text-neutral-400 text-center transition-colors duration-300 group-hover:text-white uppercase tracking-wider">
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

