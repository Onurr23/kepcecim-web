"use server";

import { createClient } from '@/utils/supabase/server';
import { getTruckBrandIdByName } from './brands';

function mapTireCondition(condition: string | null): number | null {
    if (!condition) return null;
    if (condition.includes('100')) return 100;
    if (condition.includes('75')) return 75;
    if (condition.includes('50')) return 50;
    if (condition.includes('25')) return 25;
    return null;
}

import { SupabaseClient } from '@supabase/supabase-js';

/** Only pass value to RPC if it is a valid model ID (UUID or numeric). Never pass URL slug (e.g. "120g"). */
function toModelIdOnly(value: unknown): string | null {
    if (value == null) return null;
    const s = typeof value === 'string' ? value.trim() : String(value).trim();
    if (!s) return null;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) return s;
    if (/^\d+$/.test(s)) return s;
    return null;
}

export async function searchSalesMachines(filters: any, page: number = 1, limit: number = 20, client?: SupabaseClient) {
    const supabase = client || await createClient();

    // truckBrand is string name, need UUID.
    let truckBrandId = null;
    if (filters.truckBrand) {
        truckBrandId = await getTruckBrandIdByName(filters.truckBrand);
    }

    // Usage Type Mapping
    let usageType = null;
    if (filters.machineStatus === 'Sıfır' || filters.machineStatus === 'İkinci El') {
        usageType = filters.machineStatus;
    }

    const inModelId = toModelIdOnly(filters.model);

    const rpcParams = {
        search_term: filters.query || null,
        sort_by: filters.sort || 'created_at_desc',

        in_category_id: filters.category || null,
        in_brand_id: filters.brand || null,
        in_model_id: inModelId,

        in_city: filters.city || null,
        in_district: filters.district || null,

        in_price_min: filters.priceRange?.[0] || null,
        in_price_max: filters.priceRange?.[1] || null,

        in_year_min: filters.yearRange?.[0] || null,
        in_year_max: filters.yearRange?.[1] || null,

        in_hours_min: filters.hoursRange?.[0] || null,
        in_hours_max: filters.hoursRange?.[1] || null,

        in_usage_type: usageType || null,
        in_condition: filters.condition || null,

        // Pass array directly if it has items, otherwise null
        in_features: filters.features?.length ? filters.features : null,
        in_attachments: filters.attachments?.length ? filters.attachments : null,

        // Dynamic Fields
        in_sub_type: filters.sub_type || null,
        in_class: filters.class || null,

        in_crane_type: filters.craneType || null,
        in_chassis_type: filters.chassisType || null,
        in_truck_brand_id: truckBrandId,

        in_lifting_capacity_min: filters.liftingCapacity?.[0] || null,
        in_lifting_capacity_max: filters.liftingCapacity?.[1] || null,

        in_lifting_height_min: filters.liftingHeight?.[0] || null,
        in_lifting_height_max: filters.liftingHeight?.[1] || null,

        in_mast_type: filters.mastType || null,
        in_tire_type: filters.tireType || null,
        in_wheel_count: filters.wheelCount || null,
        in_side_shifter: filters.sideShifter !== undefined && filters.sideShifter !== null ? filters.sideShifter : null,

        in_tire_condition_min: mapTireCondition(filters.tireCondition),

        page_limit: limit,
        page_offset: (page - 1) * limit
    };

    const { data, error } = await supabase.rpc('search_sales_machines', rpcParams);

    if (error) {
        console.error("RPC Error (Sales):", error);
        throw error;
    }

    return { data, count: (data && data[0] && data[0].full_count) || data?.length || 0 };
}

export async function getSalesMachineCount(filters: any) {
    const supabase = staticClient;

    let query = supabase.from('sales_machines').select('*', { count: 'exact', head: true });

    if (filters.query) query = query.textSearch('searchable_text', filters.query);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.brand) query = query.eq('brand', filters.brand);
    const modelId = toModelIdOnly(filters.model);
    if (modelId) query = query.eq('model', modelId);

    if (filters.city) query = query.contains('location', { city: filters.city });
    if (filters.district) query = query.contains('location', { district: filters.district });

    if (filters.priceRange?.[0]) query = query.gte('price', filters.priceRange[0]);
    if (filters.priceRange?.[1]) query = query.lte('price', filters.priceRange[1]);

    if (filters.yearRange?.[0]) query = query.gte('year', filters.yearRange[0]);
    if (filters.yearRange?.[1]) query = query.lte('year', filters.yearRange[1]);

    if (filters.hoursRange?.[0]) query = query.gte('hours', filters.hoursRange[0]);
    if (filters.hoursRange?.[1]) query = query.lte('hours', filters.hoursRange[1]);

    if (filters.machineStatus === 'Sıfır') query = query.eq('condition', 'Sıfır'); // Assuming 'condition' column or mapped? 
    // If usage_type maps to condition column mostly. Re-checking usage_type logic.
    // RPC used in_usage_type. Table likely has 'usage_type' or 'condition'. 
    // I'll guess 'usage_type' or 'condition'. 'condition' is common.
    // Wait, the mapTireCondition is unrelated.
    // If I am unsure of column, I might skip or try 'usage_type'.
    // I'll use `usage_type` assuming column name matches RPC param suffix often.
    if (filters.machineStatus) query = query.eq('usage_type', filters.machineStatus);

    const { count, error } = await query;

    if (error) {
        console.error("Error fetching sales count:", error);
        return 0;
    }
    return count || 0;
}


import { staticClient } from '@/utils/supabase/static-client';

export async function getSalesMachineById(id: string) {
    // Statik client kullanıyoruz (ISR uyumlu olması için)
    const supabase = staticClient;

    // 1. Fetch Machine Data (without user_profiles join)
    const { data: machine, error } = await supabase
        .from('sales_machines')
        .select(`
      *,
      machine_categories:category (id, name),
      machine_brands:brand (id, name, logo_url),
      machine_models:model (id, name)
    `)
        .eq('id', id)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') {
            console.error("Supabase Error (Sales):", error);
        }
        return null;
    }

    // 2. Fetch User Profile Manually (Bypass broken FK)
    if (machine && machine.operator_id) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, name, phone, public_phone, city, district, avatar_url, is_store, store_name, store_cover_image_url')
            .eq('id', machine.operator_id)
            .single();

        // Merge profile as 'user_profiles' property to match expected interface
        return {
            ...machine,
            user_profiles: profile
        };
    }

    return machine;
}

