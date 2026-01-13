import { createClient } from '@/utils/supabase/server';

export async function searchParts(params: any) {
    const supabase = await createClient();

    const rpcParams = {
        search_term: params.query || null,
        in_category_id: params.category || null,
        in_sub_category_id: params.subCategory || null,
        in_brand_id: params.brand || null,
        in_compatible_model_ids: params.modelId ? [params.modelId] : null,
        in_price_min: params.minPrice || null,
        in_price_max: params.maxPrice || null,

        page_limit: 20,
        page_offset: (params.page || 0) * 20
    };

    const { data, error } = await supabase.rpc('search_parts', rpcParams);

    if (error) throw error;
    return data;
}

export async function getPartById(id: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('parts')
        .select(`
            *,
            category:parts_categories (id, name),
            brand:parts_brands (id, name),
            sub_category:parts_sub_categories (id, name)
        `)
        .eq('id', id)
        .single();

    if (error) return null;

    // Manual fetch for user_profiles to avoid FK join issues
    if (data && data.supplier_id) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, name, phone, public_phone, city, district, avatar_url, is_store, store_name, store_cover_image_url')
            .eq('id', data.supplier_id)
            .single();

        if (profile) {
            (data as any).user_profiles = profile;
        }
    }

    return data;
}

export function getBrandName(part: any, brandsMap: any) {
    // 1. UUID kontrolü
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (part.brand && uuidRegex.test(part.brand)) {
        return brandsMap[part.brand]?.name || 'Belirtilmemiş';
    }

    // 2. Custom text veya düz string
    return part.custom_brand_text || part.brand || 'Belirtilmemiş';
}
