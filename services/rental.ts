import { createClient } from '@/utils/supabase/server';

export async function searchRentalMachines(searchParams: any) {
    const supabase = await createClient();

    const rpcParams = {
        search_term: searchParams.query || null,
        sort_by: searchParams.sort || 'created_at_desc',
        in_category_id: searchParams.category || null,
        in_brand_id: searchParams.brand || null,
        in_price_min: searchParams.minPrice || null,
        in_price_max: searchParams.maxPrice || null,
        in_year_min: searchParams.minYear || null,
        in_year_max: searchParams.maxYear || null,
        in_city: searchParams.city || null,

        // Rental specific
        in_is_available: searchParams.isAvailable ?? null,
        in_hours_min: searchParams.minHours || null,
        in_hours_max: searchParams.maxHours || null,
        in_operator_id: searchParams.operatorId || null,

        page_limit: 20,
        page_offset: (searchParams.page || 0) * 20
    };

    const { data, error } = await supabase.rpc('search_rental_machines', rpcParams);

    if (error) throw error;
    return data;
}

export async function getRentalMachineById(id: string) {
    const supabase = await createClient();

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
