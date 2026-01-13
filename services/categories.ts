import { createClient } from '@/utils/supabase/server';

export async function getMachineCategories() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('machine_categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching machine categories:', error);
        return [];
    }

    return data;
}

export async function getFeaturesByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    const supabase = await createClient();
    const { data } = await supabase
        .from('category_features')
        .select('id, name')
        .in('id', ids);

    return data || [];
}

export async function getAttachmentsByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    const supabase = await createClient();
    const { data } = await supabase
        .from('category_attachments')
        .select('id, name')
        .in('id', ids);

    return data || [];
}
