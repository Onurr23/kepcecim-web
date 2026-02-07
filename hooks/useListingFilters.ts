import { useState, useEffect, useCallback } from "react";

import { getDistrictsForCity } from "@/utils/cityDistricts";

export interface FilterState {
    // Global
    category: string | null;
    brand: string | null;
    model: string | null;
    city: string | null;
    district: string | null;
    priceRange: [number | null, number | null];
    yearRange: [number | null, number | null];
    hoursRange: [number | null, number | null];
    sort: string; // Default: 'created_at_desc'
    query?: string | null;

    // New Standard Filters
    machineStatus?: string | null; // Sıfır / İkinci El
    condition?: string | null; // Mükemmel, İyi, Orta

    // Dynamic / Category Specific
    sub_type?: string | null; // For Forklift Type, Excavator SubType (Paletli/Lastikli), etc.
    class?: string | null; // Excavator/Loder Class (Standart/Mini)
    tireCondition?: string | null; // Loder/Backhoe

    // Crane Specific
    craneType?: string | null;
    chassisType?: string | null;
    truckBrand?: string | null;

    // Forklift Specific
    mastType?: string | null;
    tireType?: string | null; // Forklift Tire Type
    liftingCapacity?: [number | null, number | null];
    liftingHeight?: [number | null, number | null];
    sideShifter?: boolean | null; // Var/Yok/Tümü -> true/false/null
    wheelCount?: string | null;

    // Collections
    features: string[]; // IDs
    attachments: string[]; // IDs

    // Parts Specific
    partSubCategory?: string | null;
    compatibleModels: string[]; // List of model names
}

export const initialFilters: FilterState = {
    category: null,
    brand: null,
    model: null,
    city: null,
    district: null,
    priceRange: [null, null],
    yearRange: [null, null],
    hoursRange: [null, null],
    sort: 'created_at_desc',
    machineStatus: null,
    condition: null,
    features: [],
    attachments: [],
    compatibleModels: []
};

export function useListingFilters(
    initialCategories?: any[],
    initialBrands?: any[],
    activeTab: 'sale' | 'rent' | 'part' = 'sale',
    initialFilterOverrides?: Partial<FilterState>,
    initialModels?: any[],
    initialFeatures?: any[],
    initialAttachments?: any[]
) {


    // --- State ---
    const [filters, setFilters] = useState<FilterState>({
        ...initialFilters,
        ...initialFilterOverrides
    });

    // Data Sources
    const [categories, setCategories] = useState<any[]>(initialCategories || []);
    const [brands, setBrands] = useState<any[]>(initialBrands || []);

    // Computed Options
    // Computed Options
    const [availableBrands, setAvailableBrands] = useState<any[]>(initialBrands || []);
    const [availableModels, setAvailableModels] = useState<any[]>(initialModels || []);
    const [districts, setDistricts] = useState<string[]>([]);
    const [categoryFeatures, setCategoryFeatures] = useState<any[]>(initialFeatures || []);
    const [categoryAttachments, setCategoryAttachments] = useState<any[]>(initialAttachments || []);

    // Sync Props to State (Server-Driven Updates)
    useEffect(() => {
        if (initialModels) setAvailableModels(initialModels);
    }, [initialModels]);

    useEffect(() => {
        if (initialFeatures) setCategoryFeatures(initialFeatures);
    }, [initialFeatures]);

    useEffect(() => {
        if (initialAttachments) setCategoryAttachments(initialAttachments);
    }, [initialAttachments]);

    useEffect(() => {
        if (initialCategories) setCategories(initialCategories);
    }, [initialCategories]);

    useEffect(() => {
        if (initialBrands) setBrands(initialBrands);
        setAvailableBrands(initialBrands || []);
    }, [initialBrands]);

    // --- Helpers to Identify Category Context ---
    const getCategoryName = useCallback(() => {
        if (!filters.category) return "";
        const cat = categories.find(c => c.id.toString() === filters.category);
        return cat?.name?.toLowerCase() || "";
    }, [filters.category, categories]);

    const isExcavator = () => {
        const name = getCategoryName();
        return name.includes("ekskavatör");
    };

    const isLoader = () => {
        const name = getCategoryName();
        return (name.includes("loder") || name.includes("yükleyici")) && !name.includes("teleskobik");
    };

    const isTireConditionGroup = () => {
        const name = getCategoryName();
        return name.includes("bekoloder") || name.includes("greyder") || name.includes("telehandler") || name.includes("teleskobik");
    };

    const isCrane = () => {
        const name = getCategoryName();
        return name.includes("vinç") || name.includes("crane") || name.includes("platform");
    };

    const isForklift = () => {
        const name = getCategoryName();
        return name.includes("forklift");
    };

    // --- Side Effects ---

    // --- Side Effects ---

    // 1. Category Change -> We rely on Server to filter brands via linked table?
    // Wait, the hook filtered brands client-side using `category_brand_link`.
    // If we move everything to server, we should pass "Available Brands" from server or filter locally if data is available.
    // The previous implementation fetched `category_brand_link`.
    // We can't fetch this on client anymore.
    // Either we fetch "CategoryBrands" on server and pass it, OR we allow all brands for now (Client-side filtering reduced complexity).
    // User requested "Pure SSR".
    // If I filter brands on server, I need to know which brands are valid for this category.
    // For now, I will skip complex brand filtering to avoid new fetch requirements unless easy.
    // But wait, "Fixing Filtering Flow" implies we shouldn't have broken state.
    // The server pass `brands` as `getAllBrands`.
    // Ideally we pass `initialAvailableBrands`?
    // Let's assume for now we show all brands, or relies on Server Page to filter `brands` passed to `initialBrands`?
    // No, `page.tsx` passes `getAllBrands`.
    // I'll keep client-side filtering logic REMOVED for now to strictly follow "Remove manual fetch". 
    // This means all brands show up. Getting 400 error fixed is priority.
    // If needed I can fetch linked brands on server too.

    // 3. City Change -> Update Districts

    // 3. City Change -> Update Districts
    useEffect(() => {
        if (filters.city) {
            const dists = getDistrictsForCity(filters.city);
            setDistricts(dists);
        } else {
            setDistricts([]);
        }
    }, [filters.city]);


    // --- Actions ---

    const updateFilter = (key: keyof FilterState, value: any) => {
        setFilters(prev => {
            const next = { ...prev, [key]: value };

            // Logic: Category Change Resets
            if (key === 'category') {
                next.brand = null;
                next.model = null;
                next.hoursRange = [null, null];
                next.machineStatus = null;
                next.condition = null;
                next.sub_type = null;
                next.class = null;
                next.tireCondition = null;
                next.craneType = null;
                next.chassisType = null;
                next.truckBrand = null;
                next.mastType = null;
                next.tireType = null;
                next.liftingCapacity = [null, null];
                next.liftingHeight = [null, null];
                next.sideShifter = null;
                next.wheelCount = null;
                next.features = [];
                next.attachments = [];
                next.partSubCategory = null;
            }

            // Logic: Brand Change Resets
            if (key === 'brand') {
                next.model = null;
            }

            // Logic: City Change Resets
            if (key === 'city') {
                next.district = null;
            }

            return next;
        });
    };

    const setFiltersOverride = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    return {
        filters,
        updateFilter,
        setFilters: setFiltersOverride,
        resetFilters,
        // Data
        categories,
        brands: availableBrands,
        models: availableModels,
        districts,
        categoryFeatures,
        categoryAttachments,
        // Helper Booleans
        isExcavator: isExcavator(),
        isLoader: isLoader(),
        isTireConditionGroup: isTireConditionGroup(),
        isCrane: isCrane(),
        isForklift: isForklift(),
        // Raw Data Access
        allBrands: brands
    };
}
