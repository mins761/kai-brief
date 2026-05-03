import { createClient } from '@supabase/supabase-js';

const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const configuredSupabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!configuredSupabaseUrl || !configuredSupabaseAnonKey) {
  console.warn('Supabase environment variables are missing.');
}

const supabaseUrl = configuredSupabaseUrl || 'https://example.supabase.co';
const supabaseAnonKey = configuredSupabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});
