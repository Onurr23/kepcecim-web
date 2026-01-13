"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Timer, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShowcaseMachine } from "@/services/showcase";

interface BentoGridProps {
  machines: ShowcaseMachine[];
}

export default function BentoGrid({ machines }: BentoGridProps) {

  // If no machines, don't render or show skeleton
  if (!machines || machines.length === 0) return null;

  const featured = machines[0];
  const newArrivals = machines.slice(1, 5);
  console.log(featured);

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

    // Construct Supabase Storage URL if it's a path
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/machine-images/${firstImage}`;
    }
    return firstImage;
  };

  const handleLockedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implementation for toast/modal trigger would go here
    alert("Kepçecim uygulamasını indirerek galeri ve satıcı bilgilerine ulaşabilirsiniz.");
  };

  return (
    <section className="relative bg-black pb-20 pt-8">
      {/* Background Texture - Grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
              VİTRİN
            </h2>
            <p className="text-neutral-400 font-medium tracking-wide text-sm">Günün fırsatları ve yeni gelenler.</p>
          </div>
          <Link
            href="/ilanlar"
            className="group flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-orange-400"
          >
            TÜMÜNÜ GÖR
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        {/* BENTO GRID Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2 h-auto md:h-[600px]">

          {/* LEFT: Deal of the Day (Spans 2 rows on Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 row-span-2"
          >
            <Link
              href={`/ilan/${featured.id}?type=${featured.type}`}
              className="group relative block h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition-all duration-300 hover:border-primary hover:-translate-y-1"
            >
              {/* Deal Badge */}
              <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded bg-red-600 px-3 py-1 font-bold text-white shadow-lg shadow-red-600/20 animate-pulse">
                  <Timer className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider font-black">Fırsat Ürünü</span>
                </div>
                {featured.type === 'rental' && (
                  <div className="flex items-center gap-2 rounded bg-primary px-3 py-1 font-bold text-white">
                    <span className="text-[10px] uppercase tracking-wider font-black">Kiralık</span>
                  </div>
                )}
              </div>


              <Image
                src={getImageUrl(featured.images)}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                {/* Brand & Model Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary font-black tracking-wider uppercase text-sm bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                      {featured.brand?.name}
                    </span>
                    <span className="text-white/80 font-medium text-xs tracking-wide border border-white/20 px-2 py-0.5 rounded">
                      {featured.year}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl leading-none mb-1">
                    {featured.model?.name}
                  </h3>
                  <p className="text-white/60 text-sm font-medium line-clamp-1">{featured.title}</p>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black tracking-tighter text-white md:text-5xl">
                    {formatPrice(featured.price, featured.type)}
                  </span>
                </div>



                <div
                  className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-black/80 px-6 py-4 backdrop-blur-md transition-colors group-hover:bg-black/90"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white uppercase tracking-wide">SATICI BİLGİLERİ</span>
                      <span className="text-xs font-medium text-white/60">Detaylar için ilana git</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-white/50" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* RIGHT: New Arrivals Grid (2x2) */}
          {newArrivals.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="col-span-1 row-span-1"
            >
              <Link
                href={`/ilan/${item.id}?type=${item.type}`}
                className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition-all duration-300 hover:border-primary hover:-translate-y-1"
              >
                <Image
                  src={getImageUrl(item.images)}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-black/80 border border-white/10 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                        {item.year}
                      </span>
                      {item.type === 'rental' && (
                        <span className="rounded bg-primary px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                          kiralık
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brand & Model Block */}
                  <div className="mb-2">
                    <div className="text-primary text-[10px] font-black uppercase tracking-widest mb-0.5">
                      {item.brand?.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <h4 className="line-clamp-1 text-lg font-black uppercase tracking-tight text-white">
                        {item.model?.name}
                      </h4>
                    </div>
                    <p className="text-white/50 text-[10px] font-medium line-clamp-1 uppercase tracking-wide">
                      {item.title}
                    </p>
                  </div>

                  <p className="text-xl font-black tracking-tight text-primary">{formatPrice(item.price, item.type)}</p>
                </div>

                {/* Locked Overlay (Appears on Hover or Static) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-white/10">
                  <Lock className="mb-3 h-8 w-8 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest text-white">Detayları İncele</span>
                </div>
              </Link>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}


