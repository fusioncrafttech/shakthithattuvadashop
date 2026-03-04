-- Category Add-ons Migration
-- Creates table for managing add-ons based on product categories

CREATE TABLE IF NOT EXISTS category_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  addon_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, addon_name)
);

-- RLS for category_addons
ALTER TABLE category_addons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active category addons" ON category_addons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage category addons" ON category_addons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_category_addons_category_id ON category_addons(category_id);
CREATE INDEX IF NOT EXISTS idx_category_addons_active ON category_addons(is_active);

-- Insert sample data for the required categories
-- Only insert if categories exist to avoid null constraint errors
-- Using actual slugs from categories.ts

-- Thattuvada Set Add-ons
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM categories WHERE slug = 'thattuvada') THEN
        INSERT INTO category_addons (category_id, addon_name, price, sort_order) VALUES
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Tomato', 5.00, 1),
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Onion', 5.00, 2),
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Garlic', 10.00, 3),
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Chilli', 5.00, 4),
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Podi Set', 15.00, 5),
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Pickle Set', 15.00, 6),
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Cucumber Set', 10.00, 7),
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Mixture Set', 20.00, 8),
            ((SELECT id FROM categories WHERE slug = 'thattuvada' LIMIT 1), 'Bonda Set', 25.00, 9)
        ON CONFLICT (category_id, addon_name) DO NOTHING;
    END IF;
END $$;

-- Pori Varieties Add-ons
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM categories WHERE slug = 'pori') THEN
        INSERT INTO category_addons (category_id, addon_name, price, sort_order) VALUES
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Milagu', 5.00, 1),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Garlic', 10.00, 2),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Tomato', 5.00, 3),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Podi', 8.00, 4),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Biriyani Podi Pori', 15.00, 5),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Combo Pori', 20.00, 6),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Veg Mix', 12.00, 7),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Kara Pori', 8.00, 8),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Onion', 5.00, 9),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Bonda', 15.00, 10),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Pickle', 10.00, 11),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Tomato + Garlic + Onion', 20.00, 12),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Tomato + Garlic', 15.00, 13),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Onion + Garlic', 15.00, 14),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Tomato + Onion', 10.00, 15),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Corn Mix', 12.00, 16),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Garlic + Corn Mix', 18.00, 17),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Combo Corn Mix', 22.00, 18),
            ((SELECT id FROM categories WHERE slug = 'pori' LIMIT 1), 'Onion Corn Mix', 15.00, 19)
        ON CONFLICT (category_id, addon_name) DO NOTHING;
    END IF;
END $$;

-- Norukal Varieties Add-ons
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM categories WHERE slug = 'norukal') THEN
        INSERT INTO category_addons (category_id, addon_name, price, sort_order) VALUES
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Tomato', 5.00, 1),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Onion', 5.00, 2),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Garlic', 10.00, 3),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Bun', 8.00, 4),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Bonda', 15.00, 5),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Corn Mix', 12.00, 6),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Capsicum', 8.00, 7),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Raw Mango', 10.00, 8),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Samosa', 15.00, 9),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Sundal', 12.00, 10),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Cucumber', 8.00, 11),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Pickle', 10.00, 12),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Combo', 25.00, 13),
            ((SELECT id FROM categories WHERE slug = 'norukal' LIMIT 1), 'Peanut', 8.00, 14)
        ON CONFLICT (category_id, addon_name) DO NOTHING;
    END IF;
END $$;
