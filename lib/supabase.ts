import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client-side (anon key, respects RLS)
export const supabase = createClient(url, anonKey)

// Server-side (service role when available, anon key as dev fallback)
const adminKey = serviceKey && serviceKey !== 'PASTE_SERVICE_ROLE_KEY_HERE' ? serviceKey : anonKey
export const supabaseAdmin = createClient(url, adminKey)
