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
import BackhoeLoaderIcon from "@/components/icons/BackhoeLoaderIcon";
import CraneIcon from "@/components/icons/CraneIcon";
import ForkliftIcon from "@/components/icons/ForkliftIcon";
import LoaderIcon from "@/components/icons/LoaderIcon";
import ExcavatorIcon2 from "@/components/icons/ExcavatorIcon2";
import TelehandlerIcon from "@/components/icons/TelehandlerIcon";
import GraderIcon from "@/components/icons/GraderIcon";
import DozerIcon from "@/components/icons/DozerIcon";
import RoadRollerIcon from "@/components/icons/RoadRollerIcon";
import OtherMachinesIcon from "@/components/icons/OtherMachinesIcon";
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
    "Ekskavatör": ExcavatorIcon2,
    "Bekoloder": BackhoeLoaderIcon,
    "Loder (Yükleyici)": LoaderIcon,
    "Forklift": ForkliftIcon,
    "Telehandler (Teleskobik Yükleyici)": TelehandlerIcon,
    "Mobil Vinç": CraneIcon,
    "Greyder": GraderIcon,
    "Dozer": DozerIcon,
    "Silindir": RoadRollerIcon,
    "Diğer Makineler": OtherMachinesIcon,
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

                        // Wide machinery icons need a boost to match visual weight of squares
                        const isWide = ["Bekoloder", "Loader (Yükleyici)", "Dozer", "Greyder", "Silindir"].some(
                            name => category.name.includes(name)
                        );

                        return (
                            <Link
                                key={category.id}
                                href={`/ilanlar/${categorySlug}`}
                                className="snap-start shrink-0 group flex flex-col items-center justify-center gap-6 bg-neutral-900/40 border border-white/5 rounded-3xl p-8 min-w-[160px] md:min-w-0 aspect-square transition-all duration-400 cursor-pointer hover:border-orange-500/40 hover:bg-neutral-900/80 hover:shadow-2xl hover:shadow-orange-500/10"
                            >
                                <div className="relative flex items-center justify-center h-16 w-16 md:h-24 md:w-24">
                                    <Icon
                                        size={80}
                                        className={cn(
                                            "w-full h-full text-neutral-500 transition-all duration-500 group-hover:text-orange-500 group-hover:scale-110 drop-shadow-sm",
                                            isWide && "scale-[1.35]"
                                        )}
                                    />
                                </div>

                                <span className="text-xs md:text-sm font-bold text-neutral-400 text-center transition-colors duration-300 group-hover:text-white uppercase tracking-widest px-2">
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

