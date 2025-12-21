"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Construction, 
  Truck, 
  Warehouse, 
  Hammer, 
  Wrench, 
  Lock,
  ArrowRight,
  ChevronRight,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const categories = [
  { name: "Ekskavatör", icon: Construction },
  { name: "Yükleyici", icon: Truck },
  { name: "Forklift", icon: Warehouse },
  { name: "İş Makinesi", icon: Hammer },
  { name: "Ekipman", icon: Wrench },
];

const recentListings = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?auto=format&fit=crop&q=80&w=500",
    title: "2021 CAT 320 GC",
    description: "Sıfır ayarında, tek kullanıcılı, full bakımlı. Tüm dokümanları mevcut.",
    sellerPhone: "+90 555 123 4567",
    price: "3.850.000 ₺",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=500",
    title: "2020 Volvo EC220",
    description: "2.500 saat çalışma, düzenli bakım yapılmış. Şirket aracı.",
    sellerPhone: "+90 555 987 6543",
    price: "4.200.000 ₺",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=500",
    title: "2019 Komatsu PC200",
    description: "Orta segment, uygun fiyatlı. Hemen teslim edilebilir.",
    sellerPhone: "+90 555 456 7890",
    price: "3.200.000 ₺",
  },
];

export default function BentoGrid() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="relative bg-neutral-950 py-20 overflow-hidden">
      {/* Background Texture - Dot Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" 
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Ambient Lighting Orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grid Container */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card A: Featured Listing (2 cols, Row 1) */}
          <Link href="/ilan/cat-320-gc" className="col-span-1 md:col-span-2">
            <motion.div
              className="group relative h-full overflow-hidden rounded-lg border border-white/5 bg-[#0f0f0f]/80 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
              onMouseEnter={() => setHoveredCard("featured")}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
            <div className="relative h-64 overflow-hidden md:h-80">
              <Image
                src="https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1000&auto=format&fit=crop"
                alt="Featured Machine"
                fill
                className={cn(
                  "object-cover transition-transform duration-500",
                  hoveredCard === "featured" && "scale-105"
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              {/* Metallic Badge */}
              <div className="absolute left-4 top-4 rounded-md border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-bold text-primary shadow-lg backdrop-blur-md">
                Fırsat Ürünü
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="mb-1 text-2xl font-bold text-white">
                2022 CAT 320 GC
              </h3>
              <p className="text-3xl font-extrabold text-primary">
                4.250.000 ₺
              </p>
            </div>
          </motion.div>
          </Link>

          {/* Card B: Categories (1 col, Row 1) */}
          <motion.div
            className="rounded-lg border border-white/5 bg-[#0f0f0f]/80 backdrop-blur-md p-0 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-6 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Kategoriler</h3>
            </div>
            <ul className="divide-y divide-white/5">
              {categories.map((category, index) => {
                const Icon = category.icon;
                const categorySlug = category.name.toLowerCase().replace("ş", "s").replace("ı", "i").replace("ğ", "g").replace("ü", "u").replace("ö", "o");
                return (
                  <li key={category.name}>
                    <Link
                      href={`/ilanlar?category=${categorySlug}`}
                      className="group flex items-center justify-between p-4 transition-colors hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                        <span className="font-medium text-white/90">{category.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Card C: CTA Card (1 col, Row 2) */}
          <motion.div
            className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0f0f0f]/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Striped Background Pattern */}
            <div 
              className="absolute inset-0 opacity-10" 
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #222 10px, #222 20px)'
              }} 
            />

            <div className="relative z-10">
              <h3 className="mb-4 text-2xl font-bold text-white">
                Satıcı mısın?
              </h3>
              <p className="mb-6 text-white/80">
                Makineni satmak mı istiyorsun? 81 İlden alıcılar seni bekliyor.
              </p>
              <button
                className={cn(
                  "mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/20",
                  "bg-white/5 py-3 font-semibold text-white backdrop-blur-sm",
                  "transition-all duration-300 hover:bg-primary hover:border-primary hover:text-white"
                )}
              >
                Hemen İlan Ver
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            
            {/* Background Icon */}
            <div className="absolute -bottom-8 -right-8 opacity-5">
              <Tag className="h-48 w-48 -rotate-12 text-white" />
            </div>
          </motion.div>

          {/* Card D: Live Showcase with Blur Effect (2 cols, Row 2) */}
          <motion.div
            className="col-span-1 rounded-lg border border-white/5 bg-[#0f0f0f]/80 backdrop-blur-md p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Canlı Vitrin</h3>
              <div className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {recentListings.map((listing) => (
                <Link
                  key={listing.id}
                  href="/ilan/cat-320-gc"
                  className="group relative block overflow-hidden rounded-lg border border-white/5 bg-[#0a0a0a] transition-all hover:border-primary/30 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="relative p-4">
                    <h4 className="mb-2 font-bold text-white">{listing.title}</h4>
                    <p className="text-2xl font-extrabold text-primary">
                      {listing.price}
                    </p>
                    
                    {/* Blurred content with overlay */}
                    <div className="relative mt-4 overflow-hidden">
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-transparent via-black/60 to-black/90 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2 text-center">
                          <Lock className="h-6 w-6 text-white/70" />
                          <span className="text-xs font-bold uppercase tracking-widest text-white/80">
                            Detaylar Uygulamada
                          </span>
                        </div>
                      </div>
                      
                      {/* Blurred text content */}
                      <div className="pointer-events-none space-y-2 blur-sm">
                        <p className="text-sm text-white/60">{listing.description}</p>
                        <p className="text-xs text-white/40">{listing.sellerPhone}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

