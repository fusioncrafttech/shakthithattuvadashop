export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  isPopular?: boolean;
  isTodaySpecial?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
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
}
