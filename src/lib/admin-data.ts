import type { Product, Category, OfferBanner, Order, Profile, GalleryItem } from '../types';
import { supabase } from './supabase';
import {
  STORAGE_BUCKET_PRODUCTS,
  STORAGE_BUCKET_CATEGORIES,
  STORAGE_BUCKET_BANNERS,
  STORAGE_BUCKET_GALLERY,
} from './supabase';
import { products as mockProductsData } from '../data/products';
import { categories as mockCategoriesData } from '../data/categories';
import { offerBanners as mockBannersData } from '../data/offers';

export { STORAGE_BUCKET_PRODUCTS, STORAGE_BUCKET_CATEGORIES, STORAGE_BUCKET_BANNERS, STORAGE_BUCKET_GALLERY };

let mockProductsStore = [...mockProductsData];
let mockCategoriesStore = [...mockCategoriesData];
let mockBannersStore = [...mockBannersData];
const mockGalleryStore: GalleryItem[] = [];
const mockOrdersStore: Order[] = [];
const mockProfilesStore: Profile[] = [];

function mapProductRow(r: Record<string, unknown>): Product {
  return {
    id: r.id as string,
    name: r.name as string,
    description: (r.description as string) ?? '',
    price: Number(r.price),
    image: (r.image as string) ?? '',
    categoryId: (r.category_id as string) ?? '',
    stock: r.stock != null ? Number(r.stock) : undefined,
    isPopular: r.is_popular as boolean | undefined,
    isTodaySpecial: r.is_today_special as boolean | undefined,
    is_featured: r.is_featured as boolean | undefined,
    created_at: r.created_at as string | undefined,
  };
}

function mapCategoryRow(r: Record<string, unknown>): Category {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: (r.slug as string) ?? '',
    image: (r.image as string) ?? '',
    created_at: r.created_at as string | undefined,
  };
}

function mapBannerRow(r: Record<string, unknown>): OfferBanner {
  return {
    id: r.id as string,
    title: r.title as string,
    subtitle: (r.subtitle as string) ?? '',
    image: (r.image as string) ?? '',
    cta: r.cta as string | undefined,
    redirect_url: (r.redirect_url as string | null) ?? null,
    start_date: (r.start_date as string | null) ?? null,
    end_date: (r.end_date as string | null) ?? null,
    is_active: (r.is_active as boolean) ?? true,
    created_at: r.created_at as string | undefined,
  };
}

function mapOrderRow(r: Record<string, unknown>): Order {
  return {
    id: r.id as string,
    user_id: r.user_id as string,
    user_email: r.user_email as string | undefined,
    user_name: r.user_name as string | undefined,
    status: r.status as Order['status'],
    total: Number(r.total),
    items: (r.items as Order['items']) ?? [],
    delivery_name: r.delivery_name as string | undefined,
    delivery_mobile: r.delivery_mobile as string | undefined,
    delivery_address: r.delivery_address as string | undefined,
    created_at: r.created_at as string,
    updated_at: r.updated_at as string | undefined,
  };
}

function mapProfileRow(r: Record<string, unknown>): Profile {
  return {
    id: r.id as string,
    email: r.email as string,
    name: r.name as string,
    role: r.role as Profile['role'],
    created_at: r.created_at as string | undefined,
    updated_at: r.updated_at as string | undefined,
  };
}

export async function uploadImage(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function fetchProducts(): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => mapProductRow(r as Record<string, unknown>));
  }
  return [...mockProductsStore];
}

function productToPayload(p: Partial<Product>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (p.name != null) payload.name = p.name;
  if (p.description != null) payload.description = p.description;
  if (p.price != null) payload.price = p.price;
  if (p.image != null) payload.image = p.image;
  if (p.categoryId != null && String(p.categoryId).trim() !== '') payload.category_id = p.categoryId;
  if (p.stock != null) payload.stock = p.stock;
  if (p.isPopular != null) payload.is_popular = p.isPopular;
  if (p.isTodaySpecial != null) payload.is_today_special = p.isTodaySpecial;
  if (p.is_featured != null) payload.is_featured = p.is_featured;
  return payload;
}

export async function createProduct(p: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const categoryId = p.categoryId != null ? String(p.categoryId).trim() : '';
  if (!categoryId) throw new Error('Please select a category.');
  if (!supabase) throw new Error('Database not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  const payload = productToPayload(p);
  if (!payload.category_id) throw new Error('Please select a category.');
  const { data, error } = await supabase.from('products').insert(payload).select('*').single();
  if (error) throw new Error(error.message || String(error));
  return mapProductRow((data ?? {}) as Record<string, unknown>);
}

export async function updateProduct(id: string, p: Partial<Product>): Promise<Product> {
  if (supabase) {
    const payload = productToPayload(p);
    if (Object.keys(payload).length === 0) return (await fetchProducts()).find((x) => x.id === id)!;
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return mapProductRow((data ?? {}) as Record<string, unknown>);
  }
  const idx = mockProductsStore.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Product not found');
  mockProductsStore[idx] = { ...mockProductsStore[idx], ...p };
  return mockProductsStore[idx];
}

export async function deleteProduct(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  mockProductsStore = mockProductsStore.filter((x) => x.id !== id);
}

export async function fetchCategories(): Promise<Category[]> {
  if (supabase) {
    const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => mapCategoryRow(r as Record<string, unknown>));
  }
  return [...mockCategoriesStore];
}

export async function createCategory(c: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: c.name, slug: c.slug, image: c.image })
      .select('*')
      .single();
    if (error) throw error;
    return mapCategoryRow((data ?? {}) as Record<string, unknown>);
  }
  const newC: Category = { ...c, id: 'cat-' + Date.now() };
  mockCategoriesStore = [newC, ...mockCategoriesStore];
  return newC;
}

export async function updateCategory(id: string, c: Partial<Category>): Promise<Category> {
  if (supabase) {
    const payload: Record<string, unknown> = {};
    if (c.name != null) payload.name = c.name;
    if (c.slug != null) payload.slug = c.slug;
    if (c.image != null) payload.image = c.image;
    const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return mapCategoryRow((data ?? {}) as Record<string, unknown>);
  }
  const idx = mockCategoriesStore.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Category not found');
  mockCategoriesStore[idx] = { ...mockCategoriesStore[idx], ...c };
  return mockCategoriesStore[idx];
}

export async function deleteCategory(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  mockCategoriesStore = mockCategoriesStore.filter((x) => x.id !== id);
}

export async function fetchBanners(): Promise<OfferBanner[]> {
  if (supabase) {
    const { data, error } = await supabase.from('offer_banners').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => mapBannerRow(r as Record<string, unknown>));
  }
  return [...mockBannersStore];
}

export async function createBanner(b: Omit<OfferBanner, 'id' | 'created_at'>): Promise<OfferBanner> {
  if (supabase) {
    const { data, error } = await supabase
      .from('offer_banners')
      .insert({
        title: b.title,
        subtitle: b.subtitle,
        image: b.image,
        cta: b.cta ?? null,
        redirect_url: b.redirect_url ?? null,
        start_date: b.start_date ?? null,
        end_date: b.end_date ?? null,
        is_active: b.is_active ?? true,
      })
      .select('*')
      .single();
    if (error) throw error;
    return mapBannerRow((data ?? {}) as Record<string, unknown>);
  }
  const newB: OfferBanner = { ...b, id: 'banner-' + Date.now() };
  mockBannersStore = [newB, ...mockBannersStore];
  return newB;
}

export async function updateBanner(id: string, b: Partial<OfferBanner>): Promise<OfferBanner> {
  if (supabase) {
    const payload: Record<string, unknown> = {};
    if (b.title != null) payload.title = b.title;
    if (b.subtitle != null) payload.subtitle = b.subtitle;
    if (b.image != null) payload.image = b.image;
    if (b.cta != null) payload.cta = b.cta;
    if (b.redirect_url !== undefined) payload.redirect_url = b.redirect_url;
    if (b.start_date !== undefined) payload.start_date = b.start_date;
    if (b.end_date !== undefined) payload.end_date = b.end_date;
    if (b.is_active !== undefined) payload.is_active = b.is_active;
    const { data, error } = await supabase.from('offer_banners').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return mapBannerRow((data ?? {}) as Record<string, unknown>);
  }
  const idx = mockBannersStore.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Banner not found');
  mockBannersStore[idx] = { ...mockBannersStore[idx], ...b };
  return mockBannersStore[idx];
}

export async function deleteBanner(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('offer_banners').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  mockBannersStore = mockBannersStore.filter((x) => x.id !== id);
}

function mapGalleryRow(r: Record<string, unknown>): GalleryItem {
  return {
    id: r.id as string,
    type: (r.type as GalleryItem['type']) ?? 'image',
    url: (r.url as string) ?? '',
    caption: (r.caption as string) ?? undefined,
    sort_order: r.sort_order != null ? Number(r.sort_order) : undefined,
    created_at: r.created_at as string | undefined,
  };
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  if (supabase) {
    const { data, error } = await supabase.from('gallery').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => mapGalleryRow(r as Record<string, unknown>));
  }
  return [...mockGalleryStore];
}

export async function createGalleryItem(g: Omit<GalleryItem, 'id' | 'created_at'>): Promise<GalleryItem> {
  if (supabase) {
    const { data, error } = await supabase
      .from('gallery')
      .insert({ type: g.type, url: g.url, caption: g.caption ?? '', sort_order: g.sort_order ?? 0 })
      .select('*')
      .single();
    if (error) throw error;
    return mapGalleryRow((data ?? {}) as Record<string, unknown>);
  }
  const newG: GalleryItem = { ...g, id: 'gal-' + Date.now() };
  mockGalleryStore.push(newG);
  return newG;
}

export async function updateGalleryItem(id: string, g: Partial<GalleryItem>): Promise<GalleryItem> {
  if (supabase) {
    const payload: Record<string, unknown> = {};
    if (g.type != null) payload.type = g.type;
    if (g.url != null) payload.url = g.url;
    if (g.caption != null) payload.caption = g.caption;
    if (g.sort_order != null) payload.sort_order = g.sort_order;
    if (Object.keys(payload).length === 0) return (await fetchGallery()).find((x) => x.id === id)!;
    const { data, error } = await supabase.from('gallery').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return mapGalleryRow((data ?? {}) as Record<string, unknown>);
  }
  const idx = mockGalleryStore.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Gallery item not found');
  mockGalleryStore[idx] = { ...mockGalleryStore[idx], ...g };
  return mockGalleryStore[idx];
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (supabase) {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const i = mockGalleryStore.findIndex((x) => x.id === id);
  if (i !== -1) mockGalleryStore.splice(i, 1);
}

export interface FetchOrdersParams {
  from?: string;
  to?: string;
  status?: string;
}

export async function fetchOrders(params: FetchOrdersParams = {}): Promise<Order[]> {
  if (supabase) {
    let q = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (params.from) q = q.gte('created_at', params.from);
    if (params.to) q = q.lte('created_at', params.to);
    if (params.status) q = q.eq('status', params.status);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map((r) => mapOrderRow(r as Record<string, unknown>));
  }
  return [...mockOrdersStore];
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  if (supabase) {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select('*').single();
    if (error) throw error;
    return mapOrderRow((data ?? {}) as Record<string, unknown>);
  }
  const idx = mockOrdersStore.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Order not found');
  mockOrdersStore[idx] = { ...mockOrdersStore[idx], status };
  return mockOrdersStore[idx];
}

export async function fetchProfiles(): Promise<Profile[]> {
  if (supabase) {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => mapProfileRow(r as Record<string, unknown>));
  }
  return [...mockProfilesStore];
}

export async function updateProfileRole(id: string, role: Profile['role']): Promise<Profile> {
  if (supabase) {
    const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id).select('*').single();
    if (error) throw error;
    return mapProfileRow((data ?? {}) as Record<string, unknown>);
  }
  const idx = mockProfilesStore.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Profile not found');
  mockProfilesStore[idx] = { ...mockProfilesStore[idx], role };
  return mockProfilesStore[idx];
}

export interface DashboardStats {
  totalRevenue: number;
  todayOrders: number;
  totalProducts: number;
  lowStockCount: number;
  salesByDay: { date: string; day: string; total: number }[];
  recentOrders: Order[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [products, orders] = await Promise.all([fetchProducts(), fetchOrders()]);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayOrders = orders.filter((o) => o.created_at >= todayStart).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 10).length;
  const salesByDay: { date: string; day: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    const dayEnd = new Date(d.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const dayTotal = orders
      .filter((o) => o.created_at >= dayStart && o.created_at < dayEnd)
      .reduce((s, o) => s + o.total, 0);
    const dateStr = dayStart.slice(0, 10);
    salesByDay.push({
      date: dateStr,
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      total: dayTotal,
    });
  }
  const recentOrders = orders.slice(0, 10);
  return {
    totalRevenue,
    todayOrders,
    totalProducts: products.length,
    lowStockCount,
    salesByDay,
    recentOrders,
  };
}
