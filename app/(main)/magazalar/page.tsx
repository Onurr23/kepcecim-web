"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, CheckCircle2, Store, ChevronRight, Layers } from "lucide-react";
import { getStores, type Store as StoreType } from "@/services/store";
import DealerCardSkeleton from "@/components/store/DealerCardSkeleton";
import CITIES_DATA from "@/constants/cityAndDistricts.json";

// Helper to format uppercase Turkish city names to Title Case
const formatCityName = (name: string) => {
    return name.toLocaleLowerCase('tr').replace(/(?:^|\s)\S/g, (a) => a.toLocaleUpperCase('tr'));
};

const CITIES = CITIES_DATA.map(c => formatCityName(c.text));

export default function DealersPage() {
    const [dealers, setDealers] = useState<StoreType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    // simple debounce for search
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        async function fetchStores() {
            setLoading(true);
            try {
                const data = await getStores({
                    searchQuery: debouncedSearchQuery,
                    city: selectedCity === "all" ? undefined : selectedCity
                });
                setDealers(data);
            } catch (error) {
                console.error("Failed to fetch stores", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStores();
    }, [debouncedSearchQuery, selectedCity]);


    return (
        <div className="min-h-screen bg-black pb-20">
            {/* --- Header & Search Section --- */}
            <div className="bg-neutral-900 border-b border-white/5 py-12 md:py-16">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Onaylı Satıcılar & Galericiler
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Türkiye&apos;nin 81 ilinden güvenilir iş makinesi tedarikçileri.
                            </p>
                        </div>

                        {/* Search Bar Container */}
                        <div className="w-full max-w-3xl bg-neutral-800/50 p-2 rounded-xl border border-white/10 flex flex-col md:flex-row gap-2 shadow-2xl shadow-black/50">
                            <div className="relative flex-1">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Search className="w-5 h-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Mağaza adı ara..."
                                    className="w-full bg-transparent border-none h-12 pl-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-0"
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="w-full md:w-48 relative border-t md:border-t-0 md:border-l border-white/10">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                </div>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full h-12 bg-transparent text-white pl-9 pr-4 appearance-none outline-none cursor-pointer focus:bg-neutral-800"
                                >
                                    <option value="" className="bg-neutral-900">İl Seçiniz</option>
                                    <option value="all" className="bg-neutral-900">Tüm İller</option>
                                    {CITIES.map((city) => (
                                        <option key={city} value={city} className="bg-neutral-900">
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom arrow for select */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <button className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors">
                                Ara
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Dealer Card Grid --- */}
            <div className="container mx-auto px-4 max-w-7xl mt-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <DealerCardSkeleton key={i} />
                        ))}
                    </div>
                ) : dealers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Mağaza bulunamadı</h3>
                        <p className="text-gray-400 max-w-md">
                            Arama kriterlerinize uygun mağaza bulunamadı. Lütfen farklı anahtar kelimelerle tekrar deneyin veya tüm mağazaları görüntüleyin.
                        </p>
                        <div className="pt-4">
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCity(""); }}
                                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                            >
                                Filtreleri Temizle
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {dealers.map((dealer) => (
                            <Link
                                key={dealer.id}
                                href={`/seller/${dealer.id}`}
                                className="group relative bg-[#121212] rounded-xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:bg-neutral-800 flex flex-col"
                            >
                                {/* Header Image */}
                                <div className="h-32 relative w-full overflow-hidden bg-neutral-900">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10" />
                                    {dealer.coverUrl ? (
                                        <Image
                                            src={dealer.coverUrl}
                                            alt={dealer.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                                            <Store className="w-10 h-10 text-neutral-600" />
                                        </div>
                                    )}
                                </div>

                                {/* Logo */}
                                <div className="absolute top-[4.5rem] left-4 z-20">
                                    <div className="w-16 h-16 rounded-full border-2 border-[#121212] overflow-hidden bg-neutral-900 relative">
                                        {dealer.logoUrl ? (
                                            <Image
                                                src={dealer.logoUrl}
                                                alt={`${dealer.name} logo`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-white font-bold text-xl">
                                                {dealer.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="pt-10 px-4 pb-4 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-oswald font-bold text-lg text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                                            {dealer.name}
                                        </h3>
                                        {dealer.isVerified && (
                                            <div className="text-blue-500" title="Onaylı Satıcı">
                                                <CheckCircle2 className="w-5 h-5 fill-blue-500/20" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center text-sm text-gray-400 mb-3 gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>
                                            {dealer.district || dealer.city ? `${dealer.district ? dealer.district + ', ' : ''}${dealer.city || ''}` : 'Konum Belirtilmemiş'}
                                        </span>
                                        <span className="mx-1">•</span>
                                        <span>{dealer.year}</span>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                                        <span className="text-gray-400 font-medium">Toplam İlan</span>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md border border-white/5">
                                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-white font-bold">{dealer.adCount}</span>
                                            <span className="text-xs text-gray-400">İlan</span>
                                        </div>
                                    </div>
                                </div>

                            </Link>
                        ))}

                        {/* --- 'Become a Seller' CTA Card --- */}
                        <Link
                            href="/kurumsal-uyelik"
                            className="group relative flex flex-col items-center justify-center text-center p-6 rounded-xl border-2 border-dashed border-neutral-700 hover:border-orange-500 hover:bg-orange-500/5 transition-all duration-300 min-h-[300px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
                                <Store className="w-8 h-8 text-gray-400 group-hover:text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 font-oswald">
                                Sizin mağazanız nerede?
                            </h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-[200px]">
                                Hemen indirimli fiyatlarla mağazanızı oluşturun, milyonlara ulaşın.
                            </p>

                            <button className="h-9 px-4 border border-white/20 rounded-md text-sm font-medium text-white hover:bg-white hover:text-black hover:border-white transition-colors">
                                Mağaza Aç
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
