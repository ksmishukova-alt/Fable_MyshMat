import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Серверный клиент Supabase. Используется в API-роутах и серверных компонентах.
 * Если переменные окружения не заданы — возвращает null, и слой данных
 * автоматически падает на моки (см. lib/data.ts).
 */

let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // service role — только на сервере; для MVP допустимо, на проде вынести в API
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    cached = null;
    return cached;
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return getSupabase() !== null;
}
