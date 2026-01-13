import { createClient } from '@/utils/supabase/server';

export async function getPopularBrands() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('machine_brands')
        .select('*')
        .eq('is_popular', true)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching popular brands:', error);
        return [];
    }

    return data;
}
