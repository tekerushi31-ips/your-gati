import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

// Initialize Supabase Client using public publishable key
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

/**
 * Simple Database Connection Test
 * Performs a ping query against Supabase database.
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; data?: any }> {
  if (!isSupabaseConfigured || !supabase) {
    const msg = 'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY) are not configured yet.';
    console.info('ℹ️ Supabase Connection Test:', msg);
    return { success: false, message: msg };
  }

  try {
    // Perform simple ping query on challenges table or rpc
    const { data, error } = await supabase.from('challenges').select('id').limit(1);

    if (error) {
      const errorMsg = `Supabase Connection Error: ${error.message}`;
      console.warn('⚠️ Supabase Connection Test Result:', errorMsg);
      return { success: false, message: errorMsg };
    }

    const successMsg = 'Successfully connected to Supabase database!';
    console.log('✅ Supabase Connection Test Result:', successMsg, 'Records found:', data?.length || 0);
    return { success: true, message: successMsg, data };
  } catch (err: any) {
    const catchMsg = `Unexpected connection error: ${err?.message || String(err)}`;
    console.error('❌ Supabase Connection Test Exception:', catchMsg);
    return { success: false, message: catchMsg };
  }
}

// Automatically log connection status on module import
if (isSupabaseConfigured) {
  testSupabaseConnection();
} else {
  console.info('ℹ️ YOUR GATI: Running in Local Prototype mode (Add VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY to .env.local for live Supabase DB).');
}
