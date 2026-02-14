-- Storage RLS: allow public read and admin upload/update/delete for products, categories, banners buckets.
-- Run this in Supabase Dashboard > SQL Editor. Create buckets (products, categories, banners) in Storage first if needed.

-- Helper: admin check used by storage policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- Products bucket (drop existing so we can re-run safely)
DROP POLICY IF EXISTS "Public read products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete products bucket" ON storage.objects;

CREATE POLICY "Public read products bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Admin insert products bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Admin update products bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products' AND public.is_admin())
WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "Admin delete products bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products' AND public.is_admin());

-- Categories bucket
DROP POLICY IF EXISTS "Public read categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete categories bucket" ON storage.objects;

CREATE POLICY "Public read categories bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'categories');

CREATE POLICY "Admin insert categories bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'categories' AND public.is_admin());

CREATE POLICY "Admin update categories bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'categories' AND public.is_admin())
WITH CHECK (bucket_id = 'categories' AND public.is_admin());

CREATE POLICY "Admin delete categories bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'categories' AND public.is_admin());

-- Banners bucket
DROP POLICY IF EXISTS "Public read banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete banners bucket" ON storage.objects;

CREATE POLICY "Public read banners bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Admin insert banners bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banners' AND public.is_admin());

CREATE POLICY "Admin update banners bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'banners' AND public.is_admin())
WITH CHECK (bucket_id = 'banners' AND public.is_admin());

CREATE POLICY "Admin delete banners bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'banners' AND public.is_admin());
