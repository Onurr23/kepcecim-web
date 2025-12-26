"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import FilterSidebar from "@/components/listing/FilterSidebar";
import ListingCard from "@/components/listing/ListingCard";

// Mock Data
const LISTINGS = Array.from({ length: 9 }).map((_, i) => ({
  id: i === 0 ? "cat-320-gc" : `listing-${i + 1}`,
  title: i % 2 === 0 ? "2022 CAT 320 GC - Az Saatte" : "2020 Volvo EC220 - Bakımlı",
  price: i % 2 === 0 ? "4.250.000 ₺" : "3.850.000 ₺",
  location: i % 3 === 0 ? "İstanbul" : i % 3 === 1 ? "Ankara" : "İzmir",
  image: i % 2 === 0 
    ? "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800"
    : "https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?q=80&w=800",
  specs: {
    year: 2020 + (i % 3),
    hours: `${1000 + (i * 500)} Saat`,
    weight: `${20 + (i % 5)} Ton`
  }
}));

export default function ListingsPage() {
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-20 relative overflow-hidden">
      {/* Background Texture - Dot Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" 
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header & Mobile Filter Button */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">İş Makineleri</h1>
            <p className="mt-1 text-sm text-neutral-400">124 İlan listeleniyor</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0F0F0F] px-4 py-2 text-sm font-medium text-white lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filtrele
            </button>
            
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border border-white/10 bg-[#0F0F0F] py-2 pl-4 pr-10 text-sm font-medium text-white focus:border-primary focus:outline-none"
              >
                <option value="newest">En Yeniler</option>
                <option value="price_asc">Fiyata Göre Artan</option>
                <option value="price_desc">Fiyata Göre Azalan</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="lg:col-span-1">
            <FilterSidebar />
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {LISTINGS.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
            
            {/* Pagination / Load More (Placeholder) */}
            <div className="mt-12 text-center">
              <button className="rounded-lg border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/20">
                Daha Fazla Göster
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
