
-- Create books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  genre TEXT NOT NULL,
  publisher TEXT,
  edition TEXT,
  publication_year INTEGER,
  language TEXT DEFAULT 'English',
  pages INTEGER,
  cover_image TEXT,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create book copies table
CREATE TABLE public.book_copies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  copy_number TEXT NOT NULL,
  barcode TEXT,
  rfid_tag TEXT,
  condition TEXT NOT NULL DEFAULT 'good',
  shelf_location TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  acquisition_date DATE DEFAULT CURRENT_DATE,
  price NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(book_id, copy_number)
);

-- Create borrow transactions table
CREATE TABLE public.borrow_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  copy_id UUID NOT NULL REFERENCES book_copies(id),
  borrower_id UUID NOT NULL,
  issued_by UUID NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  returned_by UUID,
  status TEXT NOT NULL DEFAULT 'borrowed',
  fine_amount NUMERIC(10,2) DEFAULT 0,
  fine_paid BOOLEAN DEFAULT false,
  renewal_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create library settings table
CREATE TABLE public.library_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL UNIQUE,
  student_borrow_limit INTEGER DEFAULT 3,
  teacher_borrow_limit INTEGER DEFAULT 10,
  student_borrow_days INTEGER DEFAULT 14,
  teacher_borrow_days INTEGER DEFAULT 30,
  fine_per_day NUMERIC(5,2) DEFAULT 2.00,
  max_renewals INTEGER DEFAULT 1,
  damage_fine NUMERIC(10,2) DEFAULT 100.00,
  loss_fine NUMERIC(10,2) DEFAULT 500.00,
  overdue_reminder_days INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create library reservations table
CREATE TABLE public.library_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  book_id UUID NOT NULL REFERENCES books(id),
  user_id UUID NOT NULL,
  reservation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_books_tenant_id ON books(tenant_id);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_book_copies_barcode ON book_copies(barcode);
CREATE INDEX idx_book_copies_status ON book_copies(status);
CREATE INDEX idx_borrow_transactions_tenant_id ON borrow_transactions(tenant_id);
CREATE INDEX idx_borrow_transactions_borrower ON borrow_transactions(borrower_id);
CREATE INDEX idx_borrow_transactions_status ON borrow_transactions(status);
CREATE INDEX idx_borrow_transactions_due_date ON borrow_transactions(due_date);
CREATE INDEX idx_library_reservations_tenant_id ON library_reservations(tenant_id);
CREATE INDEX idx_library_reservations_user_id ON library_reservations(user_id);

-- Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_reservations ENABLE ROW LEVEL SECURITY;

-- RLS policies for books
CREATE POLICY "Books viewable by tenant members" 
ON books FOR SELECT 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Admins and teachers can manage books" 
ON books FOR ALL 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- RLS policies for book_copies
CREATE POLICY "Book copies viewable by tenant members" 
ON book_copies FOR SELECT 
USING (
  book_id IN (
    SELECT books.id FROM books
    WHERE books.tenant_id IN (
      SELECT profiles.tenant_id 
      FROM profiles 
      WHERE profiles.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins and teachers can manage book copies" 
ON book_copies FOR ALL 
USING (
  book_id IN (
    SELECT books.id FROM books
    WHERE books.tenant_id IN (
      SELECT profiles.tenant_id 
      FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role IN ('admin', 'teacher')
    )
  )
);

-- RLS policies for borrow_transactions
CREATE POLICY "Borrow transactions viewable by tenant members" 
ON borrow_transactions FOR SELECT 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  ) OR borrower_id = auth.uid()
);

CREATE POLICY "Admins and teachers can manage borrow transactions" 
ON borrow_transactions FOR ALL 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- RLS policies for library_settings
CREATE POLICY "Library settings viewable by tenant members" 
ON library_settings FOR SELECT 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage library settings" 
ON library_settings FOR ALL 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- RLS policies for library_reservations
CREATE POLICY "Library reservations viewable by tenant members" 
ON library_reservations FOR SELECT 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  ) OR user_id = auth.uid()
);

CREATE POLICY "Users can create reservations" 
ON library_reservations FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and teachers can manage reservations" 
ON library_reservations FOR ALL 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- Add triggers to auto-set tenant_id
CREATE OR REPLACE FUNCTION set_library_tenant_id()
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

CREATE TRIGGER trigger_set_books_tenant_id
  BEFORE INSERT ON books
  FOR EACH ROW
  EXECUTE FUNCTION set_library_tenant_id();

CREATE TRIGGER trigger_set_borrow_transactions_tenant_id
  BEFORE INSERT ON borrow_transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_library_tenant_id();

CREATE TRIGGER trigger_set_library_reservations_tenant_id
  BEFORE INSERT ON library_reservations
  FOR EACH ROW
  EXECUTE FUNCTION set_library_tenant_id();

-- Add updated_at triggers
CREATE TRIGGER trigger_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_book_copies_updated_at
  BEFORE UPDATE ON book_copies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_borrow_transactions_updated_at
  BEFORE UPDATE ON borrow_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_library_settings_updated_at
  BEFORE UPDATE ON library_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create default library settings for existing tenants
INSERT INTO library_settings (tenant_id)
SELECT id FROM tenants
WHERE id NOT IN (SELECT tenant_id FROM library_settings WHERE tenant_id IS NOT NULL);

-- Function to calculate overdue fines
CREATE OR REPLACE FUNCTION calculate_overdue_fine(
  due_date_param DATE,
  return_date_param DATE DEFAULT NULL,
  tenant_id_param UUID DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
  days_overdue INTEGER;
  fine_per_day NUMERIC;
  total_fine NUMERIC;
BEGIN
  -- Get fine per day from settings
  SELECT library_settings.fine_per_day INTO fine_per_day
  FROM library_settings 
  WHERE library_settings.tenant_id = tenant_id_param;
  
  IF fine_per_day IS NULL THEN
    fine_per_day := 2.00; -- Default fine
  END IF;
  
  -- Calculate days overdue
  IF return_date_param IS NULL THEN
    days_overdue := GREATEST(0, CURRENT_DATE - due_date_param);
  ELSE
    days_overdue := GREATEST(0, return_date_param - due_date_param);
  END IF;
  
  total_fine := days_overdue * fine_per_day;
  
  RETURN total_fine;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
