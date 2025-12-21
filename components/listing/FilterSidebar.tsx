"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FilterSidebar() {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  return (
    <div className="hidden h-fit space-y-8 rounded-xl border border-white/5 bg-[#0F0F0F]/80 p-5 backdrop-blur-md lg:sticky lg:top-24 lg:block">
      
      {/* Kategori */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Kategori</h3>
        <div className="space-y-2">
          {["Ekskavatör", "Yükleyici", "Forklift", "Bekoloder", "Silindir"].map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-white/5 checked:bg-primary checked:border-primary transition-all" />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Marka */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Marka</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Marka ara..." 
            className="w-full rounded border border-white/10 bg-black py-2 pl-9 pr-3 text-sm text-white placeholder-neutral-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {["Caterpillar", "Komatsu", "Volvo", "Hitachi", "JCB", "Hidromek", "Liebherr"].map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-white/5 checked:bg-primary checked:border-primary transition-all" />
                <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Fiyat Aralığı */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Fiyat Aralığı</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full rounded border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-neutral-500">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full rounded border border-white/10 bg-black px-3 py-2 text-sm text-white placeholder-neutral-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Yıl */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Yıl</h3>
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <select className="w-full appearance-none rounded border border-white/10 bg-black px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">Min</option>
              {Array.from({ length: 20 }, (_, i) => 2024 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          </div>
          <span className="text-neutral-500">-</span>
          <div className="relative w-full">
            <select className="w-full appearance-none rounded border border-white/10 bg-black px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">Max</option>
              {Array.from({ length: 20 }, (_, i) => 2024 - i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Konum */}
      <div className="space-y-3">
        <h3 className="font-bold text-white">Konum</h3>
        <div className="relative">
          <select className="w-full appearance-none rounded border border-white/10 bg-black px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">İl Seçiniz</option>
            <option value="istanbul">İstanbul</option>
            <option value="ankara">Ankara</option>
            <option value="izmir">İzmir</option>
            <option value="bursa">Bursa</option>
            <option value="antalya">Antalya</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      <button className="w-full rounded-lg bg-primary py-3 font-bold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
        Filtreleri Uygula
      </button>
    </div>
  );
}

