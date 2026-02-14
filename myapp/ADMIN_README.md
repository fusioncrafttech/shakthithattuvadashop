# Shakthi Thattuvadaset Corner – Admin Panel

Premium admin dashboard for **Shakthi Thattuvadaset Corner** (food commerce).

## Access

- **URL:** `/admin` (e.g. `http://localhost:5173/admin`)
- **Access:** Only users with **role = `admin`** can open admin routes. Others are redirected or see “Access denied”.

## Demo mode (no Supabase)

1. In browser console run:  
   `localStorage.setItem('thattuvadaiset_role', 'admin')`
2. Sign in with any email/password (demo auth).
3. Go to `/admin`.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Add env vars (see `.env.example`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Run the SQL in `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor (creates `profiles`, `categories`, `products`, `offer_banners`, `orders`, RLS, trigger).
4. Create Storage buckets: `products`, `categories`, `banners` (public or with policies as needed).
5. Set a user’s `role` to `admin` in the `profiles` table (or via your seed).

## Features

- **Dashboard** – Revenue, today’s orders, product count, low stock, 7-day sales chart, recent orders.
- **Products** – Add / Edit / Delete, image upload (Supabase Storage), stock, category, Featured & Today Special toggles.
- **Categories** – Add / Edit / Delete, image upload.
- **Offer Banners** – Title, subtitle, image, redirect URL, start/end date, active toggle; only active and within date range are shown on the storefront.
- **Orders** – List, filter by date/status, status dropdown, order detail drawer.
- **Users** – List profiles, change role (Admin / User).

## Design

- Primary: **#E53935**, secondary: white, accent: soft yellow.
- Clean cards, soft shadows, 20px+ rounded corners, Framer Motion.
- Desktop: collapsible sidebar + top navbar; mobile: slide drawer + responsive content.
