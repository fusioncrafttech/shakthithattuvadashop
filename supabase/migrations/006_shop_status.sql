-- Shop Status Management
CREATE TABLE IF NOT EXISTS shop_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_open BOOLEAN NOT NULL DEFAULT true,
  message TEXT,
  auto_close_thursday BOOLEAN NOT NULL DEFAULT true,
  manual_override BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- RLS
ALTER TABLE shop_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read shop status" ON shop_status FOR SELECT USING (true);
CREATE POLICY "Admin manage shop status" ON shop_status FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to get current shop status (handles Thursday logic)
CREATE OR REPLACE FUNCTION get_current_shop_status()
RETURNS TABLE (
  is_open BOOLEAN,
  message TEXT,
  is_auto_closed BOOLEAN
) AS $$
DECLARE
  current_status RECORD;
  is_thursday BOOLEAN;
BEGIN
  -- Check if today is Thursday
  is_thursday := EXTRACT(DOW FROM CURRENT_DATE) = 4; -- Sunday=0, Thursday=4
  
  -- Get current status
  SELECT * INTO current_status FROM shop_status ORDER BY updated_at DESC LIMIT 1;
  
  -- If no status exists, create default
  IF NOT FOUND THEN
    INSERT INTO shop_status (is_open, message, auto_close_thursday, manual_override)
    VALUES (true, '🟢 Shop Open – Fresh Thattu Vada Available Today', true, false);
    SELECT * INTO current_status FROM shop_status ORDER BY updated_at DESC LIMIT 1;
  END IF;
  
  -- Determine if shop should be auto-closed on Thursday
  IF is_thursday AND current_status.auto_close_thursday AND NOT current_status.manual_override THEN
    RETURN QUERY SELECT false, '🔴 Shop Closed Today – Orders will resume tomorrow', true;
  ELSE
    RETURN QUERY SELECT current_status.is_open, current_status.message, false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shop_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_shop_status_updated_at_trigger ON shop_status;
CREATE TRIGGER update_shop_status_updated_at_trigger
  BEFORE UPDATE ON shop_status
  FOR EACH ROW EXECUTE FUNCTION update_shop_status_updated_at();

-- Insert default shop status
INSERT INTO shop_status (is_open, message, auto_close_thursday, manual_override)
VALUES (true, '🟢 Shop Open – Fresh Thattu Vada Available Today', true, false)
ON CONFLICT DO NOTHING;
