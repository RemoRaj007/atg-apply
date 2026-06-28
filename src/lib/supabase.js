import { createClient } from '@supabase/supabase-js'

// Fallback placeholder values let the demo role-switcher work without a .env.local.
// Real auth and DB queries will fail gracefully (network error) until real keys are set.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
