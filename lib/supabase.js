const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase = null;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project'));

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    console.log('✅ Connected to live Supabase project:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Could not initialize live Supabase client, using fallback engine:', err.message);
  }
} else {
  console.log('ℹ️ Running in resilient fallback mode (Supabase URL/Key not configured yet). Using embedded Bangladesh Esports records.');
}

module.exports = {
  supabase,
  isSupabaseConfigured
};
