-- Function to update multiple categories sort order at once
CREATE OR REPLACE FUNCTION update_category_sort_order(updates JSONB)
RETURNS VOID AS $$
BEGIN
  -- Update each category's sort_order based on the JSON array
  WITH ordered_updates AS (
    SELECT 
      elem->>'id' as category_id,
      (elem->>'sort_order')::INTEGER as new_sort_order
    FROM jsonb_array_elements(updates) as elem
  )
  UPDATE categories 
  SET sort_order = ordered_updates.new_sort_order
  FROM ordered_updates 
  WHERE categories.id = ordered_updates.category_id;
END;
$$ LANGUAGE plpgsql;

-- Add sort_order column to categories table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categories' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE categories ADD COLUMN sort_order INTEGER;
    
    -- Initialize sort_order for existing categories based on created_at
    UPDATE categories 
    SET sort_order = (
      SELECT row_number() OVER (ORDER BY created_at ASC) - 1
      FROM categories c2 
      WHERE c2.id = categories.id
    );
  END IF;
END $$;
