import { supabase } from './supabase';
import type { BulkOrderConfig, BulkOrderEnquiry, BulkOrderFormData } from '../types/bulkOrder';

export const bulkOrderService = {
  // Get bulk order configuration
  async getBulkOrderConfig(): Promise<BulkOrderConfig | null> {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('bulk_order_config')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching bulk order config:', error);
      return null;
    }
  },

  // Update bulk order configuration (admin only)
  async updateBulkOrderConfig(config: Partial<BulkOrderConfig>): Promise<BulkOrderConfig | null> {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('bulk_order_config')
        .update(config)
        .eq('id', config.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating bulk order config:', error);
      return null;
    }
  },

  // Submit bulk order enquiry
  async submitBulkOrderEnquiry(formData: BulkOrderFormData): Promise<BulkOrderEnquiry | null> {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('bulk_order_enquiries')
        .insert([formData])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting bulk order enquiry:', error);
      return null;
    }
  },

  // Get all bulk order enquiries (admin only)
  async getBulkOrderEnquiries(): Promise<BulkOrderEnquiry[]> {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('bulk_order_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bulk order enquiries:', error);
      return [];
    }
  },

  // Update bulk order enquiry status (admin only)
  async updateBulkOrderEnquiryStatus(id: string, status: BulkOrderEnquiry['status']): Promise<BulkOrderEnquiry | null> {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('bulk_order_enquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating bulk order enquiry status:', error);
      return null;
    }
  }
};
