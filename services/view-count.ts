import { createClient } from '@/utils/supabase/server';

export async function incrementViewCount(table: 'sales_machines' | 'rental_machines' | 'parts', id: string) {
    const supabase = await createClient();


    // We use RPC for atomic increment if available, or a simple update
    // Assuming a simple update for now or check if there's an RPC
    // Ideally: await supabase.rpc('increment_view_count', { table_name: table, row_id: id });

    // Fallback: Fetch current, increment, update (less safe for concurrency but works for simple needs)
    // Better approach without RPC for now: 
    // We can't do "view_count = view_count + 1" easily in standard update without RPC.

    // Let's try to call a dedicated RPC if it exists, or just skip if we don't have the RPC.
    // Based on user info, we are migrating stuff. Let's assume we can try to use an RPC 
    // or just leave a placeholder if we strictly need to avoid errors.

    // Safe approach: RPC. 
    const { error } = await supabase.rpc('increment_view_count', {
        table_name: table,
        record_id: id
    });

    if (error) {
        console.error('Error incrementing view count:', error);
    }
}
