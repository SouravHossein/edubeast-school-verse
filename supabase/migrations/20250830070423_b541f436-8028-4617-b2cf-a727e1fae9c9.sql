
-- Create enum types for asset management
CREATE TYPE asset_condition AS ENUM ('new', 'good', 'fair', 'damaged', 'under_repair', 'disposed');
CREATE TYPE asset_category AS ENUM ('uniforms', 'lab_equipment', 'electronics', 'furniture', 'stationery', 'sports_gear', 'miscellaneous');
CREATE TYPE item_type AS ENUM ('consumable', 'non_consumable');
CREATE TYPE transaction_type AS ENUM ('issue', 'return', 'transfer', 'maintenance', 'disposal');

-- Create inventory_categories table
CREATE TABLE public.inventory_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category_type asset_category NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE public.inventory_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  category_id UUID REFERENCES inventory_categories(id),
  asset_id TEXT NOT NULL, -- Barcode/RFID unique identifier
  name TEXT NOT NULL,
  description TEXT,
  brand_model TEXT,
  serial_number TEXT,
  item_type item_type NOT NULL DEFAULT 'non_consumable',
  condition asset_condition DEFAULT 'new',
  purchase_date DATE,
  vendor TEXT,
  purchase_cost DECIMAL(10,2),
  warranty_expiry DATE,
  location_assigned TEXT, -- Room/Lab/Storage location
  quantity_in_stock INTEGER DEFAULT 0, -- For consumables
  minimum_stock_level INTEGER DEFAULT 0, -- Alert threshold
  image_url TEXT,
  documents JSONB DEFAULT '[]', -- Array of document URLs
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, asset_id)
);

-- Create inventory_assignments table (for non-consumables)
CREATE TABLE public.inventory_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  assigned_to_type TEXT NOT NULL, -- 'student', 'teacher', 'department', 'room'
  assigned_to_id UUID, -- User ID or department ID
  assigned_to_name TEXT, -- For display purposes
  assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_return_date DATE,
  actual_return_date DATE,
  condition_at_issue asset_condition DEFAULT 'good',
  condition_at_return asset_condition,
  assigned_by UUID NOT NULL, -- Who issued the item
  returned_by UUID, -- Who processed the return
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inventory_transactions table
CREATE TABLE public.inventory_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES inventory_assignments(id),
  transaction_type transaction_type NOT NULL,
  quantity INTEGER DEFAULT 1,
  from_user_id UUID,
  to_user_id UUID,
  from_location TEXT,
  to_location TEXT,
  condition_before asset_condition,
  condition_after asset_condition,
  cost DECIMAL(10,2),
  notes TEXT,
  processed_by UUID NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create maintenance_schedules table
CREATE TABLE public.maintenance_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL, -- 'routine', 'repair', 'calibration'
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  service_provider TEXT,
  cost DECIMAL(10,2),
  next_service_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  created_by UUID NOT NULL,
  completed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create inventory_alerts table
CREATE TABLE public.inventory_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES inventory_assignments(id),
  alert_type TEXT NOT NULL, -- 'low_stock', 'overdue_return', 'warranty_expiry', 'maintenance_due'
  alert_message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for inventory_categories
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory categories viewable by tenant members" ON inventory_categories
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage inventory categories" ON inventory_categories
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add RLS policies for inventory_items
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory items viewable by tenant members" ON inventory_items
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and teachers can manage inventory items" ON inventory_items
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Add RLS policies for inventory_assignments
ALTER TABLE inventory_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their assignments" ON inventory_assignments
  FOR SELECT USING (
    (assigned_to_id = auth.uid()) OR 
    (tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    ))
  );

CREATE POLICY "Admins and teachers can manage assignments" ON inventory_assignments
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Add RLS policies for inventory_transactions
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transactions viewable by tenant members" ON inventory_transactions
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and teachers can manage transactions" ON inventory_transactions
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Add RLS policies for maintenance_schedules
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Maintenance schedules viewable by tenant members" ON maintenance_schedules
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and teachers can manage maintenance" ON maintenance_schedules
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Add RLS policies for inventory_alerts
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Alerts viewable by tenant members" ON inventory_alerts
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins and teachers can manage alerts" ON inventory_alerts
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Add triggers for updated_at columns
CREATE TRIGGER update_inventory_categories_updated_at
  BEFORE UPDATE ON inventory_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_assignments_updated_at
  BEFORE UPDATE ON inventory_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_schedules_updated_at
  BEFORE UPDATE ON maintenance_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add tenant_id auto-population triggers
CREATE OR REPLACE FUNCTION set_inventory_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    SELECT tenant_id INTO NEW.tenant_id 
    FROM profiles 
    WHERE user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_inventory_categories_tenant_id
  BEFORE INSERT ON inventory_categories
  FOR EACH ROW EXECUTE FUNCTION set_inventory_tenant_id();

CREATE TRIGGER set_inventory_items_tenant_id
  BEFORE INSERT ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION set_inventory_tenant_id();

CREATE TRIGGER set_inventory_assignments_tenant_id
  BEFORE INSERT ON inventory_assignments
  FOR EACH ROW EXECUTE FUNCTION set_inventory_tenant_id();

CREATE TRIGGER set_inventory_transactions_tenant_id
  BEFORE INSERT ON inventory_transactions
  FOR EACH ROW EXECUTE FUNCTION set_inventory_tenant_id();

CREATE TRIGGER set_maintenance_schedules_tenant_id
  BEFORE INSERT ON maintenance_schedules
  FOR EACH ROW EXECUTE FUNCTION set_inventory_tenant_id();

CREATE TRIGGER set_inventory_alerts_tenant_id
  BEFORE INSERT ON inventory_alerts
  FOR EACH ROW EXECUTE FUNCTION set_inventory_tenant_id();

-- Create function to check low stock and generate alerts
CREATE OR REPLACE FUNCTION check_low_stock_alerts()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if stock level is at or below minimum
  IF NEW.quantity_in_stock <= NEW.minimum_stock_level AND NEW.item_type = 'consumable' THEN
    INSERT INTO inventory_alerts (
      tenant_id, item_id, alert_type, alert_message, priority
    ) VALUES (
      NEW.tenant_id,
      NEW.id,
      'low_stock',
      format('Low stock alert: %s has %s units remaining (minimum: %s)', 
        NEW.name, NEW.quantity_in_stock, NEW.minimum_stock_level),
      CASE 
        WHEN NEW.quantity_in_stock = 0 THEN 'critical'
        WHEN NEW.quantity_in_stock <= (NEW.minimum_stock_level * 0.5) THEN 'high'
        ELSE 'medium'
      END
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_low_stock_trigger
  AFTER UPDATE OF quantity_in_stock ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION check_low_stock_alerts();

-- Create function to generate overdue return alerts
CREATE OR REPLACE FUNCTION check_overdue_returns()
RETURNS void AS $$
BEGIN
  INSERT INTO inventory_alerts (
    tenant_id, item_id, assignment_id, alert_type, alert_message, priority
  )
  SELECT 
    a.tenant_id,
    a.item_id,
    a.id,
    'overdue_return',
    format('Overdue return: %s assigned to %s was due on %s', 
      i.name, a.assigned_to_name, a.expected_return_date),
    CASE 
      WHEN CURRENT_DATE - a.expected_return_date > 30 THEN 'critical'
      WHEN CURRENT_DATE - a.expected_return_date > 7 THEN 'high'
      ELSE 'medium'
    END
  FROM inventory_assignments a
  JOIN inventory_items i ON a.item_id = i.id
  WHERE a.is_active = true 
    AND a.expected_return_date < CURRENT_DATE
    AND a.actual_return_date IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM inventory_alerts 
      WHERE assignment_id = a.id 
        AND alert_type = 'overdue_return' 
        AND is_acknowledged = false
    );
END;
$$ LANGUAGE plpgsql;
