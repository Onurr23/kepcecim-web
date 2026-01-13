"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import FilterSidebar from "@/components/listing/FilterSidebar";
import ListingCard from "@/components/listing/ListingCard";
import ListingCardSkeleton from "@/components/listing/ListingCardSkeleton";
import InFeedCTA from "@/components/listing/InFeedCTA";
import NoResults from "@/components/listing/NoResults";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useListingFilters } from "@/hooks/useListingFilters";

interface ListingsClientProps {
    initialCategories: any[];
    initialBrands: any[];
}

function ListingsContent({ initialCategories, initialBrands }: ListingsClientProps) {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const queryParam = searchParams.get("q");

    const [activeTab, setActiveTab] = useState<"sale" | "rent" | "part">("sale");
    const router = useRouter();

    const {
        filters,
        updateFilter,
        resetFilters,
        categories,
        availableBrands,
        subCategories,
        isForklift,
        isCrane,
        isExcavator
    } = useListingFilters(initialCategories, initialBrands, activeTab, {
        category: categoryParam || null,
        brand: brandParam || null
    });

    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState("newest");

    // Pagination State
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 50;
    const [totalCount, setTotalCount] = useState(0);

    const supabase = createClient();

    const [counts, setCounts] = useState({ sale: 0, rent: 0, part: 0 });

    // Sync URL with filter state (Handle Back/Forward navigation)
    useEffect(() => {
        if (categoryParam && filters.category !== categoryParam) {
            updateFilter('category', categoryParam);
        }
        if (!categoryParam && filters.category) {
            updateFilter('category', null);
        }

        if (brandParam && filters.brand !== brandParam) {
            updateFilter('brand', brandParam);
        }
        if (!brandParam && filters.brand) {
            updateFilter('brand', null);
        }
    }, [categoryParam, brandParam, filters.category, filters.brand, updateFilter]);

    // Helper to safely get relation name
    const getName = (rel: any) => Array.isArray(rel) ? rel[0]?.name : rel?.name;

    // Reset page when tab or filters change
    useEffect(() => {
        setPage(1);
    }, [activeTab, filters, queryParam]);

    // Fetch counts for tabs with ALL active filters applied
    useEffect(() => {
        async function fetchCounts() {
            try {
                // Helper to apply current filters to a count query
                const applyFiltersToCount = (query: any, type: 'sale' | 'rent' | 'part') => {
                    if (queryParam) query = query.textSearch('searchable_text', queryParam);
                    if (filters.category) query = query.eq('category', filters.category);

                    // Brand filter needs care: Parts might assume different brand IDs if tables differ
                    // But if we are filtering by a Machine Brand ID, applying it to Parts table (which uses parts_brands) 
                    // will simply result in 0 matches if IDs don't overlap, which is correct behavior (0 results found).
                    if (filters.brand) query = query.eq('brand', filters.brand);

                    if (filters.city) query = query.contains('location', { city: filters.city });

                    if (filters.yearRange[0]) query = query.gte('year', filters.yearRange[0]);
                    if (filters.yearRange[1]) query = query.lte('year', filters.yearRange[1]);

                    return query;
                };

                const saleQuery = applyFiltersToCount(
                    supabase.from("sales_machines").select("id", { count: "exact", head: true }).eq("status", "active"),
                    'sale'
                );

                const rentQuery = applyFiltersToCount(
                    supabase.from("rental_machines").select("id", { count: "exact", head: true }).eq("is_available", true),
                    'rent'
                );

                const partQuery = applyFiltersToCount(
                    supabase.from("parts").select("id", { count: "exact", head: true }),
                    'part'
                );

                const results = await Promise.all([saleQuery, rentQuery, partQuery]);

                setCounts({
                    sale: results[0].count || 0,
                    rent: results[1].count || 0,
                    part: results[2].count || 0
                });
            } catch (err) {
                console.error("Error fetching counts:", err);
            }
        }
        fetchCounts();
    }, [
        queryParam,
        filters.category,
        filters.brand,
        filters.city,
        filters.yearRange,
        filters.sub_type
    ]);

    // Handle Tab Change with Filter Clearing logic
    const handleTabChange = (newTab: "sale" | "rent" | "part") => {
        if (activeTab === newTab) return;

        const isMachineToPart = (activeTab === 'sale' || activeTab === 'rent') && newTab === 'part';
        const isPartToMachine = activeTab === 'part' && (newTab === 'sale' || newTab === 'rent');

        if (isMachineToPart || isPartToMachine) {
            // Clear Category and Brand filters when switching contexts (Machine <-> Part)
            // to avoid UUID mismatch/invalid filter state
            resetFilters();
            // Also need to clear URL params if they exist, to prevent re-application
            if (categoryParam || brandParam) {
                router.push('/ilanlar');
            }
        }

        setActiveTab(newTab);
    };

    const hasMachineFilters = Boolean(filters.category || filters.brand);

    // Fetch listings based on active tab and page
    useEffect(() => {
        async function fetchListings() {
            setLoading(true);
            try {
                let data: any[] = [];
                let count: number | null = 0;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                let error = null;

                const from = (page - 1) * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;

                // Base Query Builder
                let query: any;

                if (activeTab === "sale") {
                    query = supabase
                        .from("sales_machines")
                        .select(`
              id, title, year, hours_meter,
              pricing, location, status,
              images, searchable_text,
              brand:machine_brands(name),
              model:machine_models(name),
              brand_id:brand, category_id:category
            `, { count: "exact" })
                        .eq("status", "active");
                } else if (activeTab === "rent") {
                    query = supabase
                        .from("rental_machines")
                        .select(`
              id, title, year, hours_meter,
              pricing, location, is_available,
              images, searchable_text,
              brand:machine_brands(name),
              model:machine_models(name),
              brand_id:brand, category_id:category
            `, { count: "exact" })
                        .eq("is_available", true);
                } else if (activeTab === "part") {
                    query = supabase
                        .from("parts")
                        .select(`
              id, title, images, searchable_text,
              pricing, location, year:production_year,
              brand:parts_brands(name),
              category:parts_categories(name),
              sub_category:parts_sub_categories(name)
            `, { count: "exact" });
                }

                // Apply Search Query
                if (queryParam) {
                    query = query.textSearch('searchable_text', queryParam);
                }

                // Apply Common Filters
                if (filters.category) {
                    // Ensure column name is 'category' for all tables
                    query = query.eq('category', filters.category);
                }

                if (filters.brand) {
                    query = query.eq('brand', filters.brand);
                }

                // Parts specific sub-category filter (reusing sub_type filter state)
                if (activeTab === 'part' && filters.sub_type) {
                    query = query.eq('sub_category', filters.sub_type);
                }

                if (filters.city) {
                    query = query.contains('location', { city: filters.city });
                }

                // Machine specific sub_type (Forklift type etc) - Only if NOT part
                if (activeTab !== 'part' && filters.sub_type) {
                    query = query.eq('sub_type', filters.sub_type);
                }

                const specsFilters: any = {};
                if (filters.mastType) specsFilters.mastType = filters.mastType;
                if (filters.craneType) specsFilters.craneType = filters.craneType;

                if (Object.keys(specsFilters).length > 0) {
                    query = query.contains('specifications', specsFilters);
                }

                // Price Range Filter 
                // Note: Pricing is JSONB, so difficult to range filter efficiently without generated columns or specific RPCs.
                // Skipping price range filter implementation for now as it requires complex JSONB query or RPC.
                // Assuming basic implementation provided elsewhere or Todo.

                if (filters.yearRange[0]) query = query.gte('year', filters.yearRange[0]);
                if (filters.yearRange[1]) query = query.lte('year', filters.yearRange[1]);

                if (sortBy === "newest") query = query.order("created_at", { ascending: false });
                else if (sortBy === "price_asc") {
                    query = query.order("created_at", { ascending: false });
                } else if (sortBy === "price_desc") {
                    query = query.order("created_at", { ascending: false });
                }

                const { data: resultData, count: resultCount, error: resultError } = await query.range(from, to);

                if (resultError) throw resultError;
                count = resultCount;
                data = resultData || [];

                // Mapping Logic
                const mappedData = data.map(item => {
                    if (activeTab === "part") {
                        const brandName = getName(item.brand);
                        const subCatName = getName(item.sub_category);
                        const priceVal = item.pricing?.price;
                        const currency = item.pricing?.currency || "TL";

                        return {
                            id: item.id,
                            title: item.title,
                            subtitle: `${brandName || ''} • ${subCatName || 'Parça'}`,
                            price: priceVal ? `${Number(priceVal).toLocaleString("tr-TR")} ${currency}` : "Fiyat Sorunuz",
                            location: item.location ? `${item.location.city || ''}` : "Konum Belirtilmedi",
                            image: Array.isArray(item.images) ? item.images[0] : (typeof item.images === 'string' ? JSON.parse(item.images)[0] : "https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?q=80&w=800"),
                            type: "part",
                            badgeText: "PARÇA",
                            specs: { year: item.year || "-", hours: "-", weight: "-" }
                        };
                    }

                    const brandName = getName(item.brand);
                    const modelName = getName(item.model);
                    const isSale = activeTab === "sale";
                    const priceVal = isSale ? (item.pricing?.price || item.pricing?.salePrice) : item.pricing?.dailyRate;
                    const currency = item.pricing?.currency || "₺";
                    const suffix = isSale ? "" : " ₺/gün";

                    return {
                        id: item.id,
                        title: item.title || `${brandName || ''} ${modelName || ''}`,
                        subtitle: `${brandName || ""} • ${modelName || ""}`,
                        price: priceVal ? `${Number(priceVal).toLocaleString("tr-TR")} ${isSale ? currency : suffix}` : "Fiyat Sorunuz",
                        location: item.location ? `${item.location.district}, ${item.location.city}` : "Konum Belirtilmedi",
                        image: item.images?.[0] || "https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?q=80&w=800",
                        type: activeTab,
                        badgeText: item.year?.toString(),
                        specs: {
                            year: item.year,
                            hours: item.hours_meter ? `${item.hours_meter} Saat` : "Belirtilmedi",
                            weight: "N/A"
                        }
                    };
                });

                setListings(mappedData);
                setTotalCount(count || 0);
            } catch (err) {
                console.error("Error fetching listings:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchListings();
    }, [activeTab, page, filters, sortBy]);

    // Helper: Remove specific filter and sync URL
    const removeActiveFilter = (key: string) => {
        // 1. Update Layout/State
        if (key === 'category') {
            updateFilter('category', null);
        } else if (key === 'brand') {
            updateFilter('brand', null);
        } else if (key === 'city') {
            updateFilter('city', null);
        } else if (key === 'yearRange') {
            updateFilter('yearRange', [null, null]);
        }

        // 2. Sync URL
        const params = new URLSearchParams(searchParams);
        if (params.has(key)) {
            params.delete(key);
            router.push(`/ilanlar?${params.toString()}`);
        }
    };

    const getPageTitle = () => {
        if (queryParam) {
            return `"${queryParam}" için arama sonuçları`;
        }
        if (categoryParam) {
            // Try to find name in categories list
            const cat = categories.find(c =>
                c.id.toString() === categoryParam ||
                c.slug === categoryParam
            );
            return cat ? `Satılık ${cat.name} İlanları` : `Satılık ${categoryParam} İlanları`;
        }
        if (brandParam) {
            // Try to find name in brands list
            const brand = availableBrands.find(b =>
                b.id.toString() === brandParam
            );
            return brand ? `Satılık ${brand.name}` : `Satılık ${brandParam}`;
        }
        return "Tüm İş Makineleri";
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const hasActiveFilters = Boolean(
        queryParam ||
        filters.category ||
        filters.brand ||
        filters.city ||
        filters.yearRange[0] ||
        filters.sub_type
    );

    const handleClearAll = () => {
        resetFilters();
        if (queryParam || categoryParam || brandParam) {
            router.push('/ilanlar');
        }
    };

    const removeQueryParam = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        router.push(`/ilanlar?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-neutral-950 pt-24 pb-20 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-[0.05]"
                style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="mb-4 flex text-xs text-neutral-400">
                    <ol className="flex items-center space-x-2">
                        <li>Anasayfa</li>
                        <li><ChevronDown className="-rotate-90 w-3 h-3 text-neutral-600" /></li>
                        <li>İlanlar</li>
                        {categoryParam && (
                            <>
                                <li><ChevronDown className="-rotate-90 w-3 h-3 text-neutral-600" /></li>
                                <li className="text-white font-medium">
                                    {categories.find(c => c.id.toString() === categoryParam || c.slug === categoryParam)?.name || categoryParam}
                                </li>
                            </>
                        )}
                        {brandParam && (
                            <>
                                <li><ChevronDown className="-rotate-90 w-3 h-3 text-neutral-600" /></li>
                                <li className="text-white font-medium">
                                    {availableBrands.find(b => b.id.toString() === brandParam)?.name || brandParam}
                                </li>
                            </>
                        )}
                    </ol>
                </nav>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-oswald text-white mb-6">{getPageTitle()}</h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-1">
                            {/* Tabs */}
                            <button
                                onClick={() => handleTabChange("sale")}
                                className={`px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${activeTab === "sale"
                                    ? "bg-orange-600 text-black border-orange-600"
                                    : "bg-transparent text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                                    }`}
                            >
                                <span>SATILIK</span>
                                <span className={cn(
                                    "rounded-full px-1.5 py-0.5 text-[10px] sm:text-xs",
                                    activeTab === "sale" ? "bg-black/20 text-black" : "bg-white/5 text-neutral-500"
                                )}>
                                    {counts.sale}
                                </span>
                            </button>
                            <button
                                onClick={() => handleTabChange("rent")}
                                className={`px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${activeTab === "rent"
                                    ? "bg-orange-600 text-black border-orange-600"
                                    : "bg-transparent text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                                    }`}
                            >
                                <span>KİRALIK</span>
                                <span className={cn(
                                    "rounded-full px-1.5 py-0.5 text-[10px] sm:text-xs",
                                    activeTab === "rent" ? "bg-black/20 text-black" : "bg-white/5 text-neutral-500"
                                )}>
                                    {counts.rent}
                                </span>
                            </button>
                            {!hasMachineFilters && (
                                <button
                                    onClick={() => handleTabChange("part")}
                                    className={`px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold transition-all border flex items-center gap-2 ${activeTab === "part"
                                        ? "bg-orange-600 text-black border-orange-600"
                                        : "bg-transparent text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                                        }`}
                                >
                                    <span>YEDEK PARÇA</span>
                                    <span className={cn(
                                        "rounded-full px-1.5 py-0.5 text-[10px] sm:text-xs",
                                        activeTab === "part" ? "bg-black/20 text-black" : "bg-white/5 text-neutral-500"
                                    )}>
                                        {counts.part}
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Active Filters Area */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 py-2">
                                <span className="text-xs text-neutral-400 mr-2">Filtreler:</span>

                                {queryParam && (
                                    <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                        <span>Arama: {queryParam}</span>
                                        <button onClick={removeQueryParam} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                    </div>
                                )}

                                {filters.category && (
                                    <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                        <span>{categories.find(c => c.id.toString() === filters.category)?.name}</span>
                                        <button onClick={() => removeActiveFilter('category')} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                    </div>
                                )}

                                {filters.brand && (
                                    <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                        <span>{availableBrands.find(b => b.id.toString() === filters.brand)?.name || "Marka"}</span>
                                        <button onClick={() => removeActiveFilter('brand')} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                    </div>
                                )}

                                {filters.city && (
                                    <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                        <span>{filters.city}</span>
                                        <button onClick={() => removeActiveFilter('city')} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                    </div>
                                )}

                                {filters.yearRange[0] && (
                                    <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                        <span>Yıl: {filters.yearRange[0]} - {filters.yearRange[1] || 'Günümüz'}</span>
                                        <button onClick={() => removeActiveFilter('yearRange')} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                    </div>
                                )}

                                <button
                                    onClick={handleClearAll}
                                    className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Temizle
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
                    <div className="text-sm text-neutral-400">
                        {totalCount} İlan listeleniyor
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
                                className="appearance-none rounded-lg border border-white/10 bg-[#0F0F0F] py-2 pl-4 pr-10 text-sm font-medium text-white focus:border-orange-500 focus:outline-none"
                            >
                                <option value="newest">En Yeniler</option>
                                <option value="price_asc">Fiyat Artan</option>
                                <option value="price_desc">Fiyat Azalan</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    <aside className="hidden lg:col-span-1 lg:block">
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={updateFilter}
                            onApply={() => { }}
                            categories={categories}
                            brands={availableBrands}
                            isForklift={isForklift}
                            isCrane={isCrane}
                            isExcavator={isExcavator}
                            isPart={activeTab === 'part'}
                            subCategories={subCategories}
                        />
                    </aside>

                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {[...Array(9)].map((_, i) => (
                                    <ListingCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : listings.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {listings.map((listing, index) => (
                                        <React.Fragment key={listing.id}>
                                            <ListingCard {...listing as any} />
                                            {index === 5 && <InFeedCTA />}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="mt-12 flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <div className="text-sm font-medium text-white">
                                        Sayfa {page} / {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages || totalPages === 0}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <NoResults />
                        )}
                    </div>
                </div >
            </div >
        </div >
    );
}

export default function ListingsClient(props: ListingsClientProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-neutral-950 pt-24" />}>
            <ListingsContent {...props} />
        </Suspense>
    );
}
