import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

export interface FilterState {
    category: string | null;
    brand: string | null; // Brand ID (UUID or Integer string)
    model: string | null;
    city: string | null;
    district: string | null;
    priceRange: [number | null, number | null];
    yearRange: [number | null, number | null];
    hoursRange: [number | null, number | null];
    // Dynamic Fields
    sub_type?: string | null;
    class?: string | null;
    mastType?: string | null;
    tireType?: string | null;
    liftingCapacity?: [number | null, number | null];
    liftingHeight?: [number | null, number | null];
    sideShifter?: boolean | null;
    wheelCount?: string | null;
    craneType?: string | null;
    chassisType?: string | null;
    truckBrand?: string | null;
}

const initialFilters: FilterState = {
    category: null,
    brand: null,
    model: null,
    city: null,
    district: null,
    priceRange: [null, null],
    yearRange: [null, null],
    hoursRange: [null, null],
};

export function useListingFilters(
    initialCategories?: any[],
    initialBrands?: any[],
    activeTab: 'sale' | 'rent' | 'part' = 'sale',
    initialFilterOverrides?: Partial<FilterState>
) {
    const [filters, setFilters] = useState<FilterState>({
        ...initialFilters,
        ...initialFilterOverrides
    });

    // Machine Data
    const [machineCategories, setMachineCategories] = useState<any[]>(initialCategories || []);
    const [machineBrands, setMachineBrands] = useState<any[]>(initialBrands || []);

    // Parts Data
    const [partsCategories, setPartsCategories] = useState<any[]>([]);
    const [partsBrands, setPartsBrands] = useState<any[]>([]);
    const [subCategories, setSubCategories] = useState<any[]>([]); // For parts

    // Effective Data (Returned to UI)
    const [categories, setCategories] = useState<any[]>(initialCategories || []);
    const [brands, setBrands] = useState<any[]>(initialBrands || []);
    const [availableBrands, setAvailableBrands] = useState<any[]>(initialBrands || []); // Filtered by category (machines only for now)

    const [cities, setCities] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);

    const supabase = createClient();

    // 1. Load Initial Machine Data (if missing)
    useEffect(() => {
        if (initialCategories && initialCategories.length > 0 && initialBrands && initialBrands.length > 0) {
            return;
        }
        async function loadMachineData() {
            const { data: catData } = await supabase.from("machine_categories").select("*").order("sort_order");
            if (catData) setMachineCategories(catData);

            const { data: brandData } = await supabase.from("machine_brands").select("id, name").order("name");
            if (brandData) setMachineBrands(brandData);
        }
        loadMachineData();
    }, []);

    // 2. Load Parts Data (if activeTab is part)
    useEffect(() => {
        if (activeTab === 'part') {
            async function loadPartsData() {
                // Check if already loaded
                if (partsCategories.length > 0) return;

                const { data: catData } = await supabase.from("parts_categories").select("*").order("sort_order");
                if (catData) setPartsCategories(catData);

                const { data: brandData } = await supabase.from("parts_brands").select("id, name").order("name");
                if (brandData) setPartsBrands(brandData);
            }
            loadPartsData();
        }
    }, [activeTab]);

    // 3. Switch Data Context based on Active Tab
    useEffect(() => {
        if (activeTab === 'part') {
            setCategories(partsCategories);
            setBrands(partsBrands);
            setAvailableBrands(partsBrands); // Parts might not have category->brand link yet, usually generic
        } else {
            setCategories(machineCategories);
            setBrands(machineBrands);
            // Re-apply machine category-brand filter if needed, but for now reset to all machine brands implies logic below will handle it
            // Let the existing dependency [filters.category, brands] handle availableBrands, but we need to ensure 'brands' is set to machineBrands first
        }
    }, [activeTab, partsCategories, partsBrands, machineCategories, machineBrands]);


    // 4. Cascade Logic: Category -> Brand (Machines) OR Category -> SubCategory (Parts)
    useEffect(() => {
        async function handleCascade() {
            if (activeTab === 'part') {
                // Parts Logic: Fetch SubCategories
                if (filters.category) {
                    const { data } = await supabase
                        .from("parts_sub_categories")
                        .select("*")
                        .eq("category_id", filters.category);
                    setSubCategories(data || []);
                } else {
                    setSubCategories([]);
                }
                // Reset available brands to all parts brands (unless we implement category->brand for parts later)
                setAvailableBrands(partsBrands);

            } else {
                // Machines Logic: Filter Brands
                if (!filters.category) {
                    setAvailableBrands(machineBrands);
                    return;
                }

                const { data: linkedBrands } = await supabase
                    .from("category_brand_link")
                    .select("brand_id")
                    .eq("category_id", filters.category);

                if (linkedBrands && linkedBrands.length > 0) {
                    const brandIds = linkedBrands.map(b => b.brand_id);
                    const filtered = machineBrands.filter(b => brandIds.includes(b.id));
                    setAvailableBrands(filtered.length > 0 ? filtered : machineBrands);
                } else {
                    setAvailableBrands(machineBrands);
                }
            }
        }

        handleCascade();
    }, [filters.category, activeTab, machineBrands, partsBrands]);

    // Expert/Dynamic Filters Logic helpers
    const getCategoryName = () => {
        return categories.find(c => c.id.toString() === filters.category)?.name || "";
    };

    const showForkliftFields = () => {
        if (activeTab === 'part') return false;
        const name = getCategoryName().toLowerCase();
        return name.includes("forklift");
    };

    const showExcavatorFields = () => {
        if (activeTab === 'part') return false;
        const name = getCategoryName().toLowerCase();
        return name.includes("ekskavatör") || name.includes("loder");
    };

    const showCraneFields = () => {
        if (activeTab === 'part') return false;
        const name = getCategoryName().toLowerCase();
        return name.includes("vinç");
    };

    // Actions
    const updateFilter = (key: keyof FilterState, value: any) => {
        setFilters(prev => {
            const newState = { ...prev, [key]: value };

            // Cascade Resets
            if (key === 'category') {
                newState.brand = null;
                newState.model = null;
                if (activeTab === 'part') {
                    // Reset sub category
                    // newState.sub_category = null; // Need to add sub_category to FilterState first? It is 'sub_type' or new field? 
                    // User prompt said "sub_category". Existing FilterState has "sub_type". 
                    // I'll stick to "sub_type" as the field name for sub-category to reuse existing logic/types if possible, 
                    // OR add sub_category. Let's act as if sub_type represents sub_category for parts.
                    newState.sub_type = null;
                } else {
                    // Reset dynamic fields for machines
                    newState.sub_type = null;
                    newState.mastType = null;
                    newState.tireType = null;
                    newState.liftingCapacity = [null, null];
                    newState.liftingHeight = [null, null];
                    newState.craneType = null;
                    newState.chassisType = null;
                }
            }

            if (key === 'brand') {
                newState.model = null;
            }

            if (key === 'city') {
                newState.district = null;
            }

            return newState;
        });
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    };

    return {
        filters,
        updateFilter,
        resetFilters,
        categories,
        availableBrands,
        subCategories,
        isForklift: showForkliftFields(),
        isExcavator: showExcavatorFields(),
        isCrane: showCraneFields(),
    };
}
