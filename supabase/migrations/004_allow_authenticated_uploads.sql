-- Allow authenticated users to upload to storage buckets
-- Run this in Supabase Dashboard > SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Admin insert products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete products bucket" ON storage.objects;

-- Create new policies that allow any authenticated user to upload/update/delete
CREATE POLICY "Authenticated insert products bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Authenticated update products bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Authenticated delete products bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');

-- Similar policies for categories bucket
DROP POLICY IF EXISTS "Admin insert categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update categories bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete categories bucket" ON storage.objects;

CREATE POLICY "Authenticated insert categories bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'categories');

CREATE POLICY "Authenticated update categories bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'categories')
WITH CHECK (bucket_id = 'categories');

CREATE POLICY "Authenticated delete categories bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'categories');

-- Similar policies for banners bucket
DROP POLICY IF EXISTS "Admin insert banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin update banners bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete banners bucket" ON storage.objects;

CREATE POLICY "Authenticated insert banners bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banners');

CREATE POLICY "Authenticated update banners bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'banners')
WITH CHECK (bucket_id = 'banners');

CREATE POLICY "Authenticated delete banners bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'banners');
