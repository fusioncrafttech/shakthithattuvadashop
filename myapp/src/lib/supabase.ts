import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as ReturnType<typeof createClient> | null);

export const isSupabaseConfigured = (): boolean =>
  !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export const STORAGE_BUCKET_PRODUCTS = 'products';
export const STORAGE_BUCKET_CATEGORIES = 'categories';
export const STORAGE_BUCKET_BANNERS = 'banners';
export const STORAGE_BUCKET_GALLERY = 'gallery';
export const STORAGE_BUCKET_AVATARS = 'avatars';
