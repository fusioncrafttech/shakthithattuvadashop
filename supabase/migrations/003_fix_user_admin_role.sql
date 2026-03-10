-- Fix user admin role for image uploads
-- Run this in Supabase Dashboard > SQL Editor

-- Update your user to have admin role (replace YOUR_USER_ID with your actual auth.uid())
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'YOUR_USER_ID';

-- If you don't know your user ID, you can check it with:
-- SELECT id, email, role FROM public.profiles;

-- Or insert a new profile if it doesn't exist
INSERT INTO public.profiles (id, email, name, role)
VALUES (
  'YOUR_USER_ID',  -- Replace with your actual auth.uid()
  'your-email@example.com',  -- Replace with your email
  'Admin User',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();
