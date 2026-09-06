import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase-types";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined);

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  (typeof process !== "undefined" ? process.env.SUPABASE_PUBLISHABLE_KEY : undefined);

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL e chave são obrigatórios. Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
