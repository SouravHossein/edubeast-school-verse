
-- Create multi-tenant foundation tables
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE, -- for subdomain/custom domain
  name TEXT NOT NULL,
  custom_domain TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
  plan TEXT NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'premium', 'enterprise')),
  
  -- Branding & Theming
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#10b981',
  accent_color TEXT DEFAULT '#f59e0b',
  font_family TEXT DEFAULT 'Inter',
  
  -- Contact & Settings
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  timezone TEXT DEFAULT 'Asia/Dhaka',
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'BDT',
  
  -- SEO & Content
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  
  -- Billing
  subscription_start DATE,
  subscription_end DATE,
  last_payment_date DATE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tenant domains table for custom domain mapping
CREATE TABLE public.tenant_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  is_primary BOOLEAN DEFAULT false,
  ssl_status TEXT DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed')),
  verification_token TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tenant features table for feature toggles per tenant
CREATE TABLE public.tenant_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, feature_key)
);

-- Create tenant pages for custom content management
CREATE TABLE public.tenant_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  page_type TEXT DEFAULT 'custom' CHECK (page_type IN ('home', 'about', 'contact', 'custom')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, slug)
);

-- Add tenant_id to existing tables for multi-tenancy
ALTER TABLE public.profiles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.schools ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.students ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.teachers ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.classes ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.subjects ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.attendance ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.examinations ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.fee_structures ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.announcements ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.gallery_items ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.blog_posts ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- Enable RLS on new tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
CREATE POLICY "Tenants viewable by authenticated users"
  ON public.tenants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only super admins can manage tenants"
  ON public.tenants
  FOR ALL
  TO authenticated
  USING (is_super_admin());

-- RLS Policies for tenant_domains
CREATE POLICY "Tenant domains viewable by tenant members"
  ON public.tenant_domains
  FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only tenant admins can manage domains"
  ON public.tenant_domains
  FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for tenant_features
CREATE POLICY "Tenant features viewable by tenant members"
  ON public.tenant_features
  FOR SELECT
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only tenant admins can manage features"
  ON public.tenant_features
  FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for tenant_pages
CREATE POLICY "Published pages viewable by everyone"
  ON public.tenant_pages
  FOR SELECT
  USING (is_published = true OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND tenant_id = tenant_pages.tenant_id
  ));

CREATE POLICY "Only tenant admins can manage pages"
  ON public.tenant_pages
  FOR ALL
  TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Helper functions for tenant management
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_tenant_admin(tenant_uuid UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
    AND (tenant_uuid IS NULL OR tenant_id = tenant_uuid)
  );
$$;

-- Update existing RLS policies to include tenant isolation
-- This ensures all data is properly isolated by tenant

-- Example for profiles table
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view profiles in their tenant"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    tenant_id = get_current_tenant_id() OR 
    is_super_admin()
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at 
  BEFORE UPDATE ON public.tenants 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_pages_updated_at 
  BEFORE UPDATE ON public.tenant_pages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default features for new tenants
CREATE OR REPLACE FUNCTION create_default_tenant_features()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default features for new tenant
  INSERT INTO public.tenant_features (tenant_id, feature_key, is_enabled) VALUES
    (NEW.id, 'attendanceManagement', true),
    (NEW.id, 'onlineExams', true),
    (NEW.id, 'libraryManagement', false),
    (NEW.id, 'transportManagement', false),
    (NEW.id, 'hostelManagement', false),
    (NEW.id, 'feeManagement', true),
    (NEW.id, 'parentPortal', true),
    (NEW.id, 'studentPortal', true),
    (NEW.id, 'teacherPortal', true),
    (NEW.id, 'messagingSystem', true),
    (NEW.id, 'eventManagement', true),
    (NEW.id, 'reportCards', true),
    (NEW.id, 'disciplineTracking', false),
    (NEW.id, 'healthRecords', false);
  
  -- Create default pages
  INSERT INTO public.tenant_pages (tenant_id, slug, title, content, page_type, is_published) VALUES
    (NEW.id, 'home', 'Welcome to ' || NEW.name, 'Welcome to our school management system.', 'home', true),
    (NEW.id, 'about', 'About Us', 'Learn more about our school.', 'about', false),
    (NEW.id, 'contact', 'Contact Us', 'Get in touch with us.', 'contact', true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_tenant_defaults
  AFTER INSERT ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION create_default_tenant_features();
