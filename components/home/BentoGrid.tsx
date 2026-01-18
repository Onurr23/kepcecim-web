"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Timer } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShowcaseMachine } from "@/services/showcase";
import { slugify } from "@/utils/slugify";

interface BentoGridProps {
  machines: ShowcaseMachine[];
}

type TabType = 'all' | 'sale' | 'rental';

export default function BentoGrid({ machines }: BentoGridProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  if (!machines || machines.length === 0) return null;

  // Filter machines based on active tab
  const filteredMachines = useMemo(() => {
    if (activeTab === 'all') return machines;
    // Assuming 'sale' corresponds to type 'sale' and 'rental' to type 'rental'
    // The original code used 'satilik' and 'kiralik' which implies a direct mapping to machine.type
    // If machine.type is 'sale' or 'rental', this filter works.
    return machines.filter(m => m.type === activeTab);
  }, [machines, activeTab]);

  const featured = filteredMachines[0];
  const smallCards = filteredMachines.slice(1, 5);

  const getSlug = (item: ShowcaseMachine) => {
    const parts = [];
    if (item.category?.name) parts.push(slugify(item.category.name));
    if (item.brand?.name) parts.push(slugify(item.brand.name));
    if (item.model?.name) parts.push(slugify(item.model.name));
    parts.push(slugify(item.title));
    parts.push(item.id);
    return parts.join('-');
  };

  const formatPrice = (price: string | number, type: 'sale' | 'rental') => {
    let formatted = "";
    if (typeof price === 'number') {
      formatted = new Intl.NumberFormat('tr-TR').format(price) + ' ₺';
    } else {
      formatted = price;
    }

    if (type === 'rental') {
      return `${formatted} / GÜN`;
    }
    return formatted;
  };

  const getImageUrl = (images: string[]) => {
    if (!images || images.length === 0) return "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1000&auto=format&fit=crop";
    const firstImage = images[0];
    if (firstImage.startsWith('http')) return firstImage;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/machine-images/${firstImage}`;
    }
    return firstImage;
  };

  return (
    <section className="relative bg-neutral-950 py-16">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#404040 1px, transparent 1px), linear-gradient(90deg, #404040 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER & TABS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase mb-1">
              VİTRİN
            </h2>
            <p className="text-neutral-400 font-medium text-sm max-w-md">
              Günün fırsatları ve öne çıkan iş makineleri.
            </p>
          </div>

          <div className="bg-neutral-900/80 p-1.5 rounded-full border border-white/5 flex items-center overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'sale', label: 'Satılık' },
              { id: 'rental', label: 'Kiralık' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* GRID LAYOUT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[640px]"
          >
            {featured ? (
              <>
                {/* BIG CARD */}
                <motion.div
                  className="col-span-1 md:col-span-2 md:row-span-2 group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10"
                >
                  <Link href={`/ilan/${getSlug(featured)}?type=${featured.type}`} className="block h-full w-full">
                    <div className="absolute inset-0">
                      <Image
                        src={getImageUrl(featured.images)}
                        alt={featured.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black via-black/90 to-transparent" />

                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 text-white">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-blue-600/20 backdrop-blur-md flex items-center gap-1.5">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            YENİ
                          </span>
                          {featured.type === 'rental' && (
                            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-purple-600/20 backdrop-blur-md">
                              KİRALIK
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="mb-4">
                          <h3 className="text-3xl md:text-5xl font-black text-white mb-2 leading-none tracking-tight uppercase">
                            {featured.brand?.name} <span className="text-white">{featured.model?.name}</span>
                          </h3>
                          <p className="text-lg text-white/70 font-medium tracking-tight">
                            {featured.category?.name || "İş Makinesi"} • {featured.year} Model
                          </p>
                        </div>

                        <div className="flex items-end justify-between border-t border-white/10 pt-4 mt-2">
                          <div className="flex items-center gap-3">
                            <p className="text-4xl font-extrabold text-orange-500 tracking-tight">
                              {formatPrice(featured.price, featured.type)}
                            </p>
                            <ArrowUpRight className="w-6 h-6 text-orange-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* SMALL CARDS */}
                <div className="md:col-span-1 md:row-span-2 grid grid-cols-1 gap-4 h-full">
                  {smallCards.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 min-h-[280px] md:min-h-0 md:h-full"
                    >
                      <Link href={`/ilan/${getSlug(item)}?type=${item.type}`} className="block h-full w-full">
                        <div className="absolute inset-0">
                          <Image
                            src={getImageUrl(item.images)}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                          <div className="flex justify-between items-start">
                            <span className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg shadow-red-600/20 flex items-center gap-1">
                              <Timer className="w-2.5 h-2.5" /> FIRSAT
                            </span>
                          </div>

                          <div className="translate-y-1 group-hover:translate-y-0 transition-transform">
                            <h4 className="text-lg font-black text-white line-clamp-1 group-hover:text-orange-400 transition-colors uppercase tracking-tight mb-2">
                              {item.brand?.name} {item.model?.name}
                            </h4>
                            <p className="text-xl font-extrabold text-orange-500 tracking-tight">
                              {formatPrice(item.price, item.type)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="col-span-full flex items-center justify-center h-64 text-neutral-500 font-medium">
                Bu kategoride uygun ilan bulunamadı.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
