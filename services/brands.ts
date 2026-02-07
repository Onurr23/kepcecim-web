
import { staticClient } from '@/utils/supabase/static-client';

export async function getPopularBrands() {
    const supabase = staticClient;

    const { data, error } = await supabase
        .from('machine_brands')
        .select('id, name, logo_url')
        .eq('is_popular', true)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching popular brands:', error);
        return [];
    }

    return data;
}

export async function getAllBrands() {
    const supabase = staticClient;
    const { data } = await supabase.from('machine_brands').select('id, name, logo_url').order('name');
    return data || [];
}

export async function getBrandsByCategory(categoryId: string) {
    const supabase = staticClient;

    // 1. Get Brand IDs from link table
    const { data: links, error: linkError } = await supabase
        .from('category_brand_link')
        .select('brand_id')
        .eq('category_id', categoryId);

    if (linkError || !links || links.length === 0) {
        return [];
    }

    const brandIds = links.map(l => l.brand_id);

    // 2. Fetch Brand Details
    const { data, error } = await supabase
        .from('machine_brands')
        .select('id, name, logo_url')
        .in('id', brandIds)
        .order('name');

    if (error) {
        console.error('Error fetching brands by category:', error);
        return [];
    }

    return data || [];
}

export async function getModelsByBrand(brandId: string, categoryId?: string | null) {
    const supabase = staticClient;
    let query = supabase
        .from('machine_models')
        .select('id, name')
        .eq('brand_id', brandId);

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data } = await query.order('name');
    return data || [];
}

export async function getTruckBrandIdByName(name: string): Promise<string | null> {
    const supabase = staticClient;
    const { data } = await supabase
        .from('truck_brands')
        .select('id')
        .ilike('name', name)
        .single();

    return data?.id || null;
}
