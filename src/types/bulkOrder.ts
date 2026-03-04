export interface BulkOrderConfig {
  id: string;
  title: string;
  subtitle: string;
  minimum_order: number;
  small_thattu_vada_quantity: number;
  small_thattu_vada_weight: string;
  big_muruku_quantity: number;
  big_thattu_vada_quantity: number;
  box_price: number;
  total_price: number;
  contact_number: string;
  whatsapp_number: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BulkOrderEnquiry {
  id: string;
  name: string;
  mobile_number: string;
  order_quantity: string;
  delivery_date?: string;
  message?: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BulkOrderFormData {
  name: string;
  mobile_number: string;
  order_quantity: string;
  delivery_date: string;
  message: string;
}
