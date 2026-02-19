"use client";

import React, { useState, useEffect, Suspense, useRef, useMemo, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowUpDown } from "lucide-react";
import FilterSidebar from "@/components/listing/FilterSidebar";
import FilterButton from "@/components/listing/FilterButton";
import ListingCard from "@/components/listing/ListingCard";
import ListingCardSkeleton from "@/components/listing/ListingCardSkeleton";
import InFeedCTA from "@/components/listing/InFeedCTA";
import NoResults from "@/components/listing/NoResults";
import { cn } from "@/lib/utils";
import { useListingFilters, FilterState, initialFilters } from "@/hooks/useListingFilters";

import { getAllCities } from "@/utils/cityDistricts";
import { slugify } from "@/utils/slugify";

const SORT_OPTIONS = [
    { value: 'created_at_desc', label: 'En Yeni' },
    { value: 'created_at_asc', label: 'En Eski' },
    { value: 'price_asc', label: 'Fiyat (Artan)' },
    { value: 'price_desc', label: 'Fiyat (Azalan)' },
    { value: 'year_desc', label: 'Yıl (Yeni-Eski)' },
    { value: 'year_asc', label: 'Yıl (Eski-Yeni)' },
];

interface ListingsClientProps {
    initialCategories: any[];
    initialBrands: any[];
    initialFilterState?: Partial<FilterState>; // Changed from discrete props
    tab?: "sale" | "rent" | "part";
    initialListings?: any[];
    initialTotalCount?: number;
    initialCounts?: { sale: number; rent: number; part: number };
    initialModels?: any[];
    initialFeatures?: any[];
    initialAttachments?: any[];
}

function ListingsContent({
    initialCategories,
    initialBrands,
    initialFilterState,
    tab = "sale",
    initialListings = [],
    initialTotalCount = 0,
    initialCounts = { sale: 0, rent: 0, part: 0 },
    initialModels = [],
    initialFeatures = [],
    initialAttachments = []
}: ListingsClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // 1. URL Params Extraction (Still needed for diffing/updates, but State is seeded)
    // Removed old param extraction for seed, relying on initialFilterState

    // We rely on 'tab' prop for active status, but we can track strictly if needed.
    const activeTab = tab;

    // 2. Helpers
    const getSlug = (item: any) => item?.slug || slugify(item?.name || "");

    // 4. Hook (Manages "Draft" / Interactive State)
    const {
        filters,
        updateFilter,
        resetFilters,
        setFilters,
        categories,
        brands: availableBrands,
        models: availableModels,
        districts,
        categoryFeatures,
        categoryAttachments,
        isForklift,
        isCrane,
        isExcavator,
        isLoader,
        isTireConditionGroup
    } = useListingFilters(
        initialCategories,
        initialBrands,
        activeTab,
        initialFilterState, // Pass full state
        initialModels,
        initialFeatures,
        initialAttachments
    );

    const [allCities] = useState(getAllCities());
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Always use latest filters when applying (avoids stale closure)
    const filtersRef = useRef(filters);
    filtersRef.current = filters;

    // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const ITEMS_PER_PAGE = 20;
    const totalPages = Math.ceil(initialTotalCount / ITEMS_PER_PAGE);

    // --- URL SYNC LOGIC ---

    // --- URL SYNC LOGIC ---

    const serializeFiltersToParams = (filtersToApply: FilterState, fromEmpty = false) => {
        const params = fromEmpty ? new URLSearchParams() : new URLSearchParams(searchParams.toString());

        // Helper to set/delete
        const setOrDelete = (key: string, value: string | null) => {
            if (value) params.set(key, value);
            else params.delete(key);
        };

        const activeCategory = categories.find(c => c.id.toString() === filtersToApply.category);
        setOrDelete("kategori", activeCategory ? getSlug(activeCategory) : null);
        // Clean up old
        params.delete("category");

        const activeBrand = availableBrands.find(b => b.id.toString() === filtersToApply.brand);
        setOrDelete("marka", activeBrand ? getSlug(activeBrand) : null);
        params.delete("brand");

        // Use model name slug in URL for SEO (e.g. model=320d instead of model=uuid)
        const activeModel = availableModels.find((m: any) => m.id?.toString() === filtersToApply.model);
        setOrDelete("model", activeModel ? slugify(activeModel.name) : (filtersToApply.model || null));

        setOrDelete("sehir", filtersToApply.city);
        params.delete("city");

        setOrDelete("ilce", filtersToApply.district);
        params.delete("district");

        if (filtersToApply.yearRange[0]) params.set("yil_min", filtersToApply.yearRange[0].toString());
        else params.delete("yil_min");
        params.delete("year_min");

        if (filtersToApply.yearRange[1]) params.set("yil_max", filtersToApply.yearRange[1].toString());
        else params.delete("yil_max");
        params.delete("year_max");

        if (filtersToApply.hoursRange[0]) params.set("saat_min", filtersToApply.hoursRange[0].toString());
        else params.delete("saat_min");
        params.delete("hours_min");

        if (filtersToApply.hoursRange[1]) params.set("saat_max", filtersToApply.hoursRange[1].toString());
        else params.delete("saat_max");
        params.delete("hours_max");

        // Status & Condition
        setOrDelete("durum", filtersToApply.machineStatus ?? null);
        params.delete("status"); // cleanup

        setOrDelete("kondisyon", filtersToApply.condition ?? null);
        params.delete("condition"); // cleanup

        // Features (Comma Separated Slugs)
        // Map IDs to Names -> Slugs
        params.delete("features");
        params.delete("ozellikler");
        if (filtersToApply.features && filtersToApply.features.length > 0) {
            const slugList = filtersToApply.features.map(id => {
                const feat = categoryFeatures.find((f: any) => f.id.toString() === id);
                return feat ? slugify(feat.name) : null;
            }).filter(Boolean);
            if (slugList.length > 0) params.set("ozellikler", slugList.join(","));
        }

        // Attachments (Comma Separated Slugs)
        params.delete("attachments");
        params.delete("atasman");
        if (filtersToApply.attachments && filtersToApply.attachments.length > 0) {
            const slugList = filtersToApply.attachments.map(id => {
                const att = categoryAttachments.find((a: any) => a.id.toString() === id);
                return att ? slugify(att.name) : null;
            }).filter(Boolean);
            if (slugList.length > 0) params.set("atasman", slugList.join(","));
        }

        // Dynamic
        setOrDelete("alt_tip", filtersToApply.sub_type || null);
        params.delete("sub_type");

        setOrDelete("sinif", filtersToApply.class || null);
        params.delete("class");

        setOrDelete("lastik_durumu", filtersToApply.tireCondition || null);
        params.delete("tireCondition");

        setOrDelete("mast_tipi", filtersToApply.mastType || null);
        params.delete("mastType");

        setOrDelete("vinc_tipi", filtersToApply.craneType || null);
        params.delete("craneType");

        setOrDelete("sasi_tipi", filtersToApply.chassisType || null);
        params.delete("chassisType");

        setOrDelete("kamyon_markasi", filtersToApply.truckBrand || null);
        params.delete("truckBrand");

        setOrDelete("lastik_tipi", filtersToApply.tireType || null);
        params.delete("tireType");

        setOrDelete("tekerlek_sayisi", filtersToApply.wheelCount || null);
        params.delete("wheelCount");

        setOrDelete("yana_kaydirma", filtersToApply.sideShifter !== null && filtersToApply.sideShifter !== undefined ? String(filtersToApply.sideShifter) : null);
        params.delete("sideShifter");

        // Price
        setOrDelete("fiyat_min", filtersToApply.priceRange[0]?.toString() || null);
        params.delete("price_min");

        setOrDelete("fiyat_max", filtersToApply.priceRange[1]?.toString() || null);
        params.delete("price_max");

        // Capacity
        setOrDelete("kapasite_min", filtersToApply.liftingCapacity?.[0]?.toString() || null);
        params.delete("lifting_capacity_min");

        setOrDelete("kapasite_max", filtersToApply.liftingCapacity?.[1]?.toString() || null);
        params.delete("lifting_capacity_max");

        if (filtersToApply.sort && filtersToApply.sort !== 'created_at_desc') params.set("sirala", filtersToApply.sort);
        else params.delete("sirala");
        params.delete("sort"); // cleanup old

        return params;
    };

    const applyFiltersToUrl = (filtersToApply: FilterState) => {
        const params = serializeFiltersToParams(filtersToApply, true);
        params.delete("page"); // Reset page
        const newQuery = params.toString();
        startTransition(() => {
            router.push(newQuery ? `?${newQuery}` : window.location.pathname);
        });
    };

    const handleApply = () => {
        applyFiltersToUrl(filtersRef.current);
    };

    // Auto-apply logic for Category, Brand, and Model
    const prevFiltersRef = React.useRef(filters);

    useEffect(() => {
        const prev = prevFiltersRef.current;
        const current = filters;

        const isCategoryChanged = prev.category !== current.category;
        const isSortChanged = prev.sort !== current.sort;

        // Only Category and Sort trigger immediate apply
        // Brand, Model, and all others wait for "Filtrele" button
        if (isCategoryChanged || isSortChanged) {
            applyFiltersToUrl(current);
        }

        prevFiltersRef.current = current;
    }, [filters]);

    // Sync Draft State FROM URL
    useEffect(() => {
        const q = searchParams.get("arama") || searchParams.get("q");
        if (q !== (filters.query || null)) updateFilter("query", q || null);

        // Dynamic Params
        const sub_type = searchParams.get("alt_tip") || searchParams.get("sub_type");
        if (sub_type && sub_type !== filters.sub_type) updateFilter("sub_type", sub_type);

        const cls = searchParams.get("sinif") || searchParams.get("class");
        if (cls && cls !== filters.class) updateFilter("class", cls);

        const city = searchParams.get("sehir") || searchParams.get("city");
        if (city && city !== filters.city) updateFilter("city", city);
        else if (!city && filters.city) updateFilter("city", null);

        const district = searchParams.get("ilce") || searchParams.get("district");
        if (district && district !== filters.district) updateFilter("district", district);

        const pMin = searchParams.get("fiyat_min") || searchParams.get("price_min");
        const pMax = searchParams.get("fiyat_max") || searchParams.get("price_max");
        if (pMin !== (filters.priceRange[0]?.toString() || null) || pMax !== (filters.priceRange[1]?.toString() || null)) {
            updateFilter("priceRange", [pMin ? Number(pMin) : null, pMax ? Number(pMax) : null]);
        }

        const pModel = searchParams.get("model");
        if (pModel != null) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pModel);
            const modelSlug = slugify(pModel);
            const resolvedModelId = isUuid
                ? pModel
                : availableModels.find((m: any) => getSlug(m.name) === modelSlug)?.id?.toString() ?? pModel;
            if (resolvedModelId !== filters.model) updateFilter("model", resolvedModelId);
        }

        const hMin = searchParams.get("saat_min") || searchParams.get("hours_min");
        const hMax = searchParams.get("saat_max") || searchParams.get("hours_max");
        if (hMin !== (filters.hoursRange[0]?.toString() || null) || hMax !== (filters.hoursRange[1]?.toString() || null)) {
            updateFilter("hoursRange", [hMin ? Number(hMin) : null, hMax ? Number(hMax) : null]);
        }

        const status = searchParams.get("durum") || searchParams.get("status");
        if (status && status !== filters.machineStatus) updateFilter("machineStatus", status);

        const cond = searchParams.get("kondisyon") || searchParams.get("condition");
        if (cond && cond !== filters.condition) updateFilter("condition", cond);

        // Features (Comma separated slugs -> IDs)
        // We need 'categoryFeatures' which is in state/hook.
        // Wait, 'categoryFeatures' is from hook return. Accessing it here:
        const featsParam = searchParams.get("ozellikler") || searchParams.get("features"); // String
        let featIds: string[] = [];
        if (featsParam) {
            const slugs = featsParam.split(","); // Legacy might be multiple params but now comma
            // If legacy multiple params (searchParams.getAll), we handle that?
            // Prompt says "Stop repeating... use comma". URL will be comma.

            featIds = slugs.map(slug => {
                const found = categoryFeatures.find((f: any) => slugify(f.name) === slug || f.slug === slug);
                return found ? found.id.toString() : null;
            }).filter((id): id is string => id !== null);
        } else {
            // Fallback for legacy array param if mixed
            const legacy = searchParams.getAll("features");
            if (legacy.length > 0) featIds = legacy;
        }

        if (JSON.stringify(featIds) !== JSON.stringify(filters.features)) {
            updateFilter("features", featIds);
        }

        // Attachments
        const attsParam = searchParams.get("atasman") || searchParams.get("attachments");
        let attIds: string[] = [];
        if (attsParam) {
            const slugs = attsParam.split(",");
            attIds = slugs.map(slug => {
                const found = categoryAttachments.find((a: any) => slugify(a.name) === slug || a.slug === slug);
                return found ? found.id.toString() : null;
            }).filter((id): id is string => id !== null);
        } else {
            const legacy = searchParams.getAll("attachments");
            if (legacy.length > 0) attIds = legacy;
        }

        if (JSON.stringify(attIds) !== JSON.stringify(filters.attachments)) {
            updateFilter("attachments", attIds);
        }

        const sortParam = searchParams.get("sirala") || searchParams.get("sort");
        if (sortParam && sortParam !== filters.sort) {
            updateFilter("sort", sortParam);
        } else if (!sortParam && filters.sort !== 'created_at_desc') {
            updateFilter("sort", 'created_at_desc');
        }

        // Other new params
        const truck = searchParams.get("kamyon_markasi") || searchParams.get("truckBrand");
        if (truck !== filters.truckBrand) updateFilter("truckBrand", truck);

        const tireType = searchParams.get("lastik_tipi") || searchParams.get("tireType");
        if (tireType !== filters.tireType) updateFilter("tireType", tireType);

        // ... Check other dynamic fields if critical

    }, [searchParams, categoryFeatures, categoryAttachments, availableModels]); // availableModels for slug->id resolution

    // Link Builder for Tabs (preserves other params)
    // Link Builder for Tabs (preserves other params)
    const getTabHref = (targetTab: "sale" | "rent" | "part") => {
        let path = "/ilanlar/satilik";
        if (targetTab === "rent") path = "/ilanlar/kiralik";
        else if (targetTab === "part") path = "/ilanlar/yedek-parca";

        // Logic: 
        // User requested independent tabs. Switching tabs clears ALL filters.
        return path;
    };

    const removeActiveFilter = (key: string) => {
        // Update Draft
        // Map key to filter key
        // Update URL directly?
        // We update Draft, and let 'useEffect' trigger apply?
        // No, 'useEffect' only triggers on Cat/Brand/Model change.
        // For others, we must trigger Apply.

        // Better: Manipulate URL directly for removal.
        const params = new URLSearchParams(searchParams);

        if (key === 'category') {
            params.delete("kategori");
            params.delete("category");
            updateFilter('category', null); // Sync draft
        }
        else if (key === 'brand') {
            params.delete("marka");
            params.delete("brand");
            updateFilter('brand', null);
            params.delete("model"); // model depends on brand
            updateFilter('model', null);
        }
        else if (key === 'model') {
            params.delete("model");
            updateFilter('model', null);
        }
        else if (key === 'yearRange') {
            params.delete("year_min");
            params.delete("year_max");
            updateFilter('yearRange', [null, null]);
        }
        else if (key === 'priceRange') {
            params.delete("price_min");
            params.delete("price_max");
            updateFilter('priceRange', [null, null]);
        }
        else {
            params.delete(key);
            // Try to sync draft
            if (filters[key as keyof FilterState] !== undefined) {
                updateFilter(key as keyof FilterState, null);
            }
        }

        params.delete("page");
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handleClearAll = () => {
        resetFilters();
        prevFiltersRef.current = initialFilters; // Sync ref

        // Clear params
        const params = new URLSearchParams();
        if (searchParams.get("tab")) params.set("tab", searchParams.get("tab")!); // Keep tab
        // Keep sort if desired, or reset? Usually reset clears sort too or keeps default. Default is fine.

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const removeQueryParam = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("q");
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const getPageTitle = () => {
        if (filters.query) return `"${filters.query}" için arama sonuçları`;
        if (filters.category) {
            const cat = categories.find(c => c.id.toString() === filters.category);
            return cat ? `Satılık ${cat.name} İlanları` : `Satılık İş Makineleri`;
        }
        if (filters.brand) {
            const brand = availableBrands.find(b => b.id.toString() === filters.brand);
            return brand ? `Satılık ${brand.name}` : `Satılık İş Makineleri`;
        }
        return "Tüm İş Makineleri";
    };

    const appliedParams = useMemo(() => {
        const p = searchParams;
        return {
            q: p.get("q") || p.get("arama"),
            categorySlug: p.get("kategori") || p.get("category"),
            brandSlug: p.get("marka") || p.get("brand"),
            city: p.get("sehir") || p.get("city"),
            district: p.get("ilce") || p.get("district"),
            modelId: p.get("model"),
            sub_type: p.get("alt_tip") || p.get("sub_type"),
            class: p.get("class") || p.get("sinif"),
            tireCondition: p.get("lastik_durumu") || p.get("tireCondition"),
            priceMin: p.get("fiyat_min") || p.get("price_min"),
            priceMax: p.get("fiyat_max") || p.get("price_max"),
            yearMin: p.get("yil_min") || p.get("year_min"),
            yearMax: p.get("yil_max") || p.get("year_max"),
            hoursMin: p.get("saat_min") || p.get("hours_min"),
            hoursMax: p.get("saat_max") || p.get("hours_max"),
            status: p.get("durum") || p.get("status"),
            condition: p.get("kondisyon") || p.get("condition"),
            features: p.get("ozellikler") || p.getAll("features"), // String or Array
            attachments: p.get("atasman") || p.getAll("attachments"),
        };
    }, [searchParams]);

    const hasActiveFilters = Boolean(
        appliedParams.q || appliedParams.categorySlug || appliedParams.brandSlug ||
        appliedParams.city || appliedParams.district || appliedParams.modelId ||
        appliedParams.sub_type || appliedParams.class || appliedParams.tireCondition ||
        appliedParams.priceMin || appliedParams.priceMax ||
        appliedParams.yearMin || appliedParams.yearMax ||
        appliedParams.hoursMin || appliedParams.hoursMax ||
        appliedParams.status || appliedParams.condition ||
        (appliedParams.features && appliedParams.features.length > 0) ||
        (appliedParams.attachments && appliedParams.attachments.length > 0)
    );

    const getCategoryNameFromSlug = (slug: string | null) => {
        if (!slug) return null;
        const c = categories.find((cat: any) => getSlug(cat) === slug);
        return c?.name || slug;
    };
    const getBrandNameFromSlug = (slug: string | null) => {
        if (!slug) return null;
        const b = availableBrands.find((br: any) => getSlug(br) === slug);
        return b?.name || slug;
    };
    const getModelNameFromId = (id: string | null) => {
        // Try available models first
        const m = availableModels.find((mod: any) => mod.id.toString() === id);
        if (m) return m.name;
        // Return ID if name not found (since we removed extra fetch) or "Model"
        return "Model: " + id;
    };

    const formatPriceChip = (val: number | null) => {
        if (val === null) return "";
        return new Intl.NumberFormat("tr-TR").format(val);
    };

    // Pending UI: build "target" params from draft only (empty base) and compare to current URL
    const currentParamsNoPage = useMemo(() => {
        const p = new URLSearchParams(searchParams);
        p.delete("page");
        return p;
    }, [searchParams]);
    const pendingParams = useMemo(() => {
        const p = serializeFiltersToParams(filters, true);
        p.delete("page");
        return p;
    }, [filters, availableBrands, availableModels, categories, categoryFeatures, categoryAttachments]);
    const hasPendingChanges = useMemo(() => {
        if (currentParamsNoPage.toString() === pendingParams.toString()) return false;
        const cur = currentParamsNoPage.toString();
        const pen = pendingParams.toString();
        return cur !== pen;
    }, [currentParamsNoPage, pendingParams]);
    const pendingCount = useMemo(() => {
        let n = 0;
        const allKeys = new Set([...currentParamsNoPage.keys(), ...pendingParams.keys()]);
        allKeys.forEach((k) => {
            if (currentParamsNoPage.get(k) !== pendingParams.get(k)) n++;
        });
        return n;
    }, [currentParamsNoPage, pendingParams]);

    // Note: We use existing 'counts' logic, but using props `initialCounts`
    const counts = initialCounts;

    return (
        <div className="min-h-screen bg-neutral-950 pt-24 pb-20 relative overflow-x-hidden">
            <div className="absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:items-start">
                    <aside className="hidden lg:col-span-1 lg:flex lg:flex-col lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)]">
                        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={updateFilter}
                                onApply={handleApply}
                                categories={categories}
                                brands={availableBrands}
                                models={availableModels}
                                allCities={allCities}
                                districts={districts}
                                isForklift={isForklift}
                                isCrane={isCrane}
                                isExcavator={isExcavator}
                                isLoader={isLoader}
                                isTireConditionGroup={isTireConditionGroup}
                                isPart={activeTab === 'part'}
                                hasPendingChanges={hasPendingChanges}
                                pendingCount={pendingCount}
                                features={categoryFeatures}
                                attachments={categoryAttachments}
                            />
                        </div>
                        <div className="flex-shrink-0 pt-4 border-t border-white/10">
                            <FilterButton
                                hasPendingChanges={hasPendingChanges}
                                handleApply={handleApply}
                                pendingCount={pendingCount}
                            />
                        </div>
                    </aside>

                    <div className={cn("lg:col-span-3 transition-opacity duration-300 space-y-6", isPending ? "opacity-50" : "opacity-100")}>
                        <nav className="flex text-xs text-neutral-400">
                            <ol className="flex items-center space-x-2">
                                <li>Anasayfa</li>
                                <li><ChevronDown className="-rotate-90 w-3 h-3 text-neutral-600" /></li>
                                <li>İlanlar</li>
                            </ol>
                        </nav>

                        <div>
                            <h1 className="text-3xl font-bold font-oswald text-white mb-6">{getPageTitle()}</h1>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-white/10 pb-1">
                                    <Link href={getTabHref("sale")} className={cn("px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold transition-all border flex items-center gap-2", activeTab === "sale" ? "bg-orange-600 text-black border-orange-600" : "bg-transparent text-neutral-400 border-white/10")}>
                                        <span>SATILIK</span>
                                        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] sm:text-xs", activeTab === "sale" ? "bg-black/20 text-black" : "bg-white/5 text-neutral-500")}>{counts.sale}</span>
                                    </Link>
                                    <Link href={getTabHref("rent")} className={cn("px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold transition-all border flex items-center gap-2", activeTab === "rent" ? "bg-orange-600 text-black border-orange-600" : "bg-transparent text-neutral-400 border-white/10")}>
                                        <span>KİRALIK</span>
                                        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] sm:text-xs", activeTab === "rent" ? "bg-black/20 text-black" : "bg-white/5 text-neutral-500")}>{counts.rent}</span>
                                    </Link>
                                    <Link href={getTabHref("part")} className={cn("px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-bold transition-all border flex items-center gap-2", activeTab === "part" ? "bg-orange-600 text-black border-orange-600" : "bg-transparent text-neutral-400 border-white/10")}>
                                        <span>YEDEK PARÇA</span>
                                        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] sm:text-xs", activeTab === "part" ? "bg-black/20 text-black" : "bg-white/5 text-neutral-500")}>{counts.part}</span>
                                    </Link>

                                    <div className="ml-auto relative">
                                        <button
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <ArrowUpDown className="w-4 h-4" />
                                            <span>{SORT_OPTIONS.find(o => o.value === filters.sort)?.label || 'Sıralama'}</span>
                                        </button>

                                        {isSortOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                                                    {SORT_OPTIONS.map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => {
                                                                updateFilter('sort', opt.value);
                                                                setIsSortOpen(false);
                                                            }}
                                                            className={cn(
                                                                "w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5",
                                                                filters.sort === opt.value ? "text-orange-500 font-medium" : "text-neutral-400"
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {hasActiveFilters && (
                                    <div className="flex flex-wrap items-center gap-2 py-2">
                                        <span className="text-xs text-neutral-400 mr-2">Filtreler:</span>
                                        {appliedParams.q && (
                                            <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                                <span>Arama: {appliedParams.q}</span>
                                                <button onClick={removeQueryParam} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                            </div>
                                        )}
                                        {appliedParams.categorySlug && (
                                            <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                                <span>{getCategoryNameFromSlug(appliedParams.categorySlug)}</span>
                                                <button onClick={() => removeActiveFilter('category')} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                            </div>
                                        )}
                                        {appliedParams.brandSlug && (
                                            <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                                <span>{getBrandNameFromSlug(appliedParams.brandSlug)}</span>
                                                <button onClick={() => removeActiveFilter('brand')} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                            </div>
                                        )}
                                        {appliedParams.modelId && (
                                            <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                                <span>{getModelNameFromId(appliedParams.modelId)}</span>
                                                <button onClick={() => removeActiveFilter('model')} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                            </div>
                                        )}
                                        {appliedParams.city && (
                                            <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                                                <span>{appliedParams.city}</span>
                                                <button onClick={() => removeActiveFilter('city')} className="ml-1 hover:text-white"><X className="h-3 w-3" /></button>
                                            </div>
                                        )}
                                        <button onClick={handleClearAll} className="ml-auto text-xs text-red-400 hover:text-red-300 transition-colors">Temizle</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {initialListings.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {initialListings.map((listing: any, index: number) => (
                                        <React.Fragment key={listing.id}>
                                            <ListingCard {...listing} />
                                            {index === 5 && <InFeedCTA />}
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="mt-12 flex items-center justify-center gap-4">
                                    <button onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page === 1} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft className="h-5 w-5" /></button>
                                    <div className="text-sm font-medium text-white">Sayfa {page} / {totalPages}</div>
                                    <button onClick={() => handlePageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages || totalPages === 0} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight className="h-5 w-5" /></button>
                                </div>
                            </>
                        ) : (
                            <NoResults />
                        )}
                    </div>
                </div>
            </div>
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
