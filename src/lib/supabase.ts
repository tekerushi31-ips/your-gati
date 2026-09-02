import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Supabase environment variables from Vite
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  ''
).trim();

// Format URL safely (supports full URL or raw project reference ID)
const supabaseUrl = rawUrl
  ? (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
    ? rawUrl
    : `https://${rawUrl}.supabase.co`
  : '';

// Safe configuration detection
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

// Reusable Supabase client instance (null-safe fallback)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

/**
 * TASK 5 — Development-only Supabase Connection Test
 * Performs a lightweight query on the existing "challenges" table.
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; data?: any }> {
  if (!isSupabaseConfigured || !supabase) {
    const msg = 'Supabase connection failed: Environment variables VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are missing or empty.';
    console.info('ℹ️ Supabase Connection Check:', msg);
    return { success: false, message: msg };
  }

  try {
    // Lightweight query on the existing "challenges" table from schema
    const { data, error } = await supabase.from('challenges').select('id').limit(1);

    if (error) {
      const errorMsg = `Supabase connection failed: ${error.message}`;
      console.warn('⚠️ Supabase Connection Result:', errorMsg);
      return { success: false, message: errorMsg };
    }

    const successMsg = 'Supabase connection successful.';
    console.log('✅ Supabase Connection Result:', successMsg, `Query returned ${data?.length || 0} records.`);
    return { success: true, message: successMsg, data };
  } catch (err: any) {
    const catchMsg = `Supabase connection failed: ${err?.message || String(err)}`;
    console.error('❌ Supabase Connection Exception:', catchMsg);
    return { success: false, message: catchMsg };
  }
}

// Automatically execute connection test if configured
if (isSupabaseConfigured) {
  testSupabaseConnection();
} else {
  console.info('ℹ️ YOUR GATI: Running in local prototype mode. (Add VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY to .env.local to enable live Supabase DB).');
}
