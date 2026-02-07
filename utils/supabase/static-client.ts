import { createClient } from '@supabase/supabase-js';

// Bu client SADECE public (herkese açık) ve statik (build-time) veri çekimi için kullanılmalıdır.
// Kesinlikle içinde user session veya cookie ile işlem yapılmamalıdır.
// ISR (Incremental Static Regeneration) ve Static Generation için kullanılır.

export const staticClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
