export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stock?: number;
  isPopular?: boolean;
  isTodaySpecial?: boolean;
  is_featured?: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OfferBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  cta?: string;
  redirect_url?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_email?: string;
  user_name?: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  delivery_name?: string;
  delivery_mobile?: string;
  delivery_address?: string;
  created_at: string;
  updated_at?: string;
}

export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export type GalleryItemType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  type: GalleryItemType;
  url: string;
  caption?: string;
  sort_order?: number;
  created_at?: string;
}
