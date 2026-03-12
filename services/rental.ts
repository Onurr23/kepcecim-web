"use server";

import { createClient } from '@/utils/supabase/server';
import { getTruckBrandIdByName } from './brands';

function mapSubTypeCondition(condition: string | null): number | null {
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

export async function searchRentalMachines(filters: any, page: number = 1, limit: number = 20, client?: SupabaseClient) {
    const supabase = client || await createClient();

    // truckBrand is string name, need UUID.
    let truckBrandId = null;
    if (filters.truckBrand) {
        truckBrandId = await getTruckBrandIdByName(filters.truckBrand);
    }

    // Usage Type is not usually for Rental? Rentals are usually used. 
    // But if RPC support it, maybe? RPC has no `in_usage_type` in my view of `services/rental.ts` earlier?
    // Let's check the previous `view_file` of rental.ts.
    // Line 39-41 in rental.ts view: `in_usage_type` was NOT there in my `view_file` output?
    // Wait, let me check `services/rental.ts` view again.
    // I see: 
    // 37: in_hours_min...
    // 40: // Rental Specific
    // 41: in_is_available: true
    // NO `in_usage_type` in `searchRentalMachines` parameters in existing file.
    // So I will NOT add usage_type here.

    const inModelId = toModelIdOnly(filters.model);

    const rpcParams = {
        search_term: filters.query || null,
        sort_by: filters.sort || 'created_at_desc',

        in_category_id: filters.category || null,
        in_brand_id: filters.brand || null,
        in_model_id: inModelId,

        in_city: filters.city || null,
        in_district: filters.district || null,

        // Rental Price = Daily Rate in RPC context
        in_price_min: filters.priceRange?.[0] || null,
        in_price_max: filters.priceRange?.[1] || null,

        in_year_min: filters.yearRange?.[0] || null,
        in_year_max: filters.yearRange?.[1] || null,

        in_hours_min: filters.hoursRange?.[0] || null,
        in_hours_max: filters.hoursRange?.[1] || null,

        // Rental Specific (mobil spec: availability 'true'|'false' → boolean; yoksa gönderilmez)
        in_is_available:
            filters.availability === 'true' ? true
                : filters.availability === 'false' ? false
                    : null,

        in_features: filters.features?.length ? filters.features : null,
        in_attachments: filters.attachments?.length ? filters.attachments : null,

        // Dynamic params (Rentals have them too)
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

        in_sub_type_condition_min: mapSubTypeCondition(filters.subTypeCondition),

        page_limit: limit,
        page_offset: (page - 1) * limit
    };

    const { data, error } = await supabase.rpc('search_rental_machines', rpcParams);

    if (error) {
        console.error("RPC Error (Rental):", error);
        throw error;
    }

    return { data, count: (data && data[0] && data[0].full_count) || data?.length || 0 };
}

export async function getRentalMachineCount(filters: any) {
    const supabase = staticClient;

    let query = supabase.from('rental_machines').select('*', { count: 'exact', head: true });

    // Tab başlıklarındaki toplamlar için sadece arama terimini dikkate alıyoruz.
    if (filters.query) {
        query = query.textSearch('searchable_text', filters.query);
    }

    const { count, error } = await query;

    if (error) {
        console.warn("Error fetching rental count:", error);
        return 0;
    }
    return count || 0;
}


import { staticClient } from '@/utils/supabase/static-client';

export async function getRentalMachineById(id: string) {
    const supabase = staticClient;

    const { data, error } = await supabase
        .from('rental_machines')
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
            console.error("Supabase Error (Rental):", error);
        }
        return null;
    }

    // Manual fetch for user_profiles to avoid FK join issues
    if (data && data.operator_id) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, name, phone, public_phone, city, district, avatar_url, is_store, store_name, store_cover_image_url')
            .eq('id', data.operator_id)
            .single();

        if (profile) {
            (data as any).user_profiles = profile;
        }
    }

    return data;
}

