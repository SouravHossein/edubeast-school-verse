
-- Add domain management table
CREATE TABLE IF NOT EXISTS public.school_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  is_primary BOOLEAN DEFAULT false,
  verification_token TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  dns_instructions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add school publication status and lifecycle fields to tenants
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'modern',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS brand_settings JSONB DEFAULT '{}';

-- Enable RLS for school_domains
ALTER TABLE public.school_domains ENABLE ROW LEVEL SECURITY;

-- RLS policies for school_domains
CREATE POLICY "School admins can manage their domains" 
ON public.school_domains 
FOR ALL 
USING (
  school_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Domains viewable by school members" 
ON public.school_domains 
FOR SELECT 
USING (
  school_id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Update tenants RLS to allow creating during onboarding
DROP POLICY IF EXISTS "Only super admins can manage tenants" ON public.tenants;

CREATE POLICY "Authenticated users can create tenants" 
ON public.tenants 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Tenant admins can manage their tenant" 
ON public.tenants 
FOR ALL 
USING (
  id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) OR is_super_admin()
);

CREATE POLICY "Published tenants viewable by everyone" 
ON public.tenants 
FOR SELECT 
USING (is_published = true OR auth.uid() IS NOT NULL);

-- Add updated_at trigger for school_domains
CREATE OR REPLACE TRIGGER update_school_domains_updated_at
  BEFORE UPDATE ON public.school_domains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
