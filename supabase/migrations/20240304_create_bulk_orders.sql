-- Bulk Orders Configuration Table
CREATE TABLE IF NOT EXISTS bulk_order_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Bulk Orders – Shakthi Thattuvada Set Corner',
  subtitle TEXT NOT NULL DEFAULT 'Wholesale snack orders for shops and events.',
  minimum_order DECIMAL(10,2) NOT NULL DEFAULT 2630.00,
  small_thattu_vada_quantity INTEGER NOT NULL DEFAULT 10,
  small_thattu_vada_weight TEXT NOT NULL DEFAULT '1.5kg total',
  big_muruku_quantity INTEGER NOT NULL DEFAULT 10,
  big_thattu_vada_quantity INTEGER NOT NULL DEFAULT 10,
  box_price DECIMAL(10,2) NOT NULL DEFAULT 40.00,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 2630.00,
  contact_number TEXT NOT NULL DEFAULT '+919876543210',
  whatsapp_number TEXT NOT NULL DEFAULT '+919876543210',
  email TEXT NOT NULL DEFAULT 'orders@shakthithattuvada.com',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bulk Order Enquiries Table
CREATE TABLE IF NOT EXISTS bulk_order_enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  order_quantity TEXT NOT NULL,
  delivery_date DATE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bulk_order_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_order_enquiries ENABLE ROW LEVEL SECURITY;

-- Policies for bulk_order_config (read-only for public, admin can write)
CREATE POLICY "Anyone can view bulk order config" ON bulk_order_config FOR SELECT USING (true);
CREATE POLICY "Only authenticated admins can manage bulk order config" ON bulk_order_config FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Policies for bulk_order_enquiries (anyone can insert, admins can read/update)
CREATE POLICY "Anyone can insert bulk order enquiries" ON bulk_order_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated admins can view bulk order enquiries" ON bulk_order_enquiries FOR SELECT USING (
  auth.jwt() ->> 'role' = 'admin'
);
CREATE POLICY "Only authenticated admins can update bulk order enquiries" ON bulk_order_enquiries FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'admin'
);

-- Insert default bulk order configuration
INSERT INTO bulk_order_config (
  title,
  subtitle,
  minimum_order,
  small_thattu_vada_quantity,
  small_thattu_vada_weight,
  big_muruku_quantity,
  big_thattu_vada_quantity,
  box_price,
  total_price,
  contact_number,
  whatsapp_number,
  email
) VALUES (
  'Bulk Orders – Shakthi Thattuvada Set Corner',
  'Wholesale snack orders for shops and events.',
  2630.00,
  10,
  '1.5kg total',
  10,
  10,
  40.00,
  2630.00,
  '+919876543210',
  '+919876543210',
  'orders@shakthithattuvada.com'
) ON CONFLICT DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bulk_order_enquiries_status ON bulk_order_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_bulk_order_enquiries_created_at ON bulk_order_enquiries(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_bulk_order_config_updated_at BEFORE UPDATE ON bulk_order_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bulk_order_enquiries_updated_at BEFORE UPDATE ON bulk_order_enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
