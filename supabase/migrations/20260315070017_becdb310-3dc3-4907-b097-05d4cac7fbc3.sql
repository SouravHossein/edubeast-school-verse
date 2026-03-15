
-- =============================================
-- EduBeast Core Schema Migration
-- =============================================

-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student', 'parent');

-- 2. Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'student',
  tenant_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tenants table (schools)
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  custom_domain TEXT,
  status TEXT NOT NULL DEFAULT 'trial',
  plan TEXT NOT NULL DEFAULT 'basic',
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#3b82f6',
  secondary_color TEXT NOT NULL DEFAULT '#10b981',
  accent_color TEXT NOT NULL DEFAULT '#f59e0b',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  theme TEXT NOT NULL DEFAULT 'modern',
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  language TEXT NOT NULL DEFAULT 'en',
  currency TEXT NOT NULL DEFAULT 'USD',
  country TEXT DEFAULT 'US',
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  seo_settings JSONB DEFAULT '{}',
  brand_settings JSONB DEFAULT '{}',
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  last_payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add FK from profiles to tenants
ALTER TABLE public.profiles ADD CONSTRAINT profiles_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE SET NULL;

-- 4. Tenant features
CREATE TABLE public.tenant_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, feature_key)
);

-- 5. User roles table (for RLS helper)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- 6. Classes
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  section TEXT,
  grade_level TEXT,
  academic_year TEXT,
  capacity INTEGER DEFAULT 40,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Students
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  student_id TEXT NOT NULL,
  admission_number TEXT NOT NULL,
  roll_number TEXT,
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  emergency_contact TEXT,
  medical_info TEXT,
  transport_info JSONB DEFAULT '{}',
  fee_concession NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Teachers
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  employee_id TEXT NOT NULL,
  department TEXT,
  designation TEXT,
  qualification TEXT,
  experience_years INTEGER DEFAULT 0,
  subjects TEXT[],
  joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
  salary NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Parents
CREATE TABLE public.parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  relation TEXT DEFAULT 'parent',
  occupation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Activity logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Examinations (for dashboard queries)
CREATE TABLE public.examinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  exam_type TEXT NOT NULL DEFAULT 'regular',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- RLS Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;

-- Security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Security definer function to get user tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view tenant profiles" ON public.profiles FOR SELECT USING (
  tenant_id = public.get_user_tenant(auth.uid()) AND public.get_user_role(auth.uid()) = 'admin'
);
CREATE POLICY "Service role can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- Tenants policies
CREATE POLICY "Anyone can create tenant" ON public.tenants FOR INSERT WITH CHECK (true);
CREATE POLICY "Tenant members can view" ON public.tenants FOR SELECT USING (
  id = public.get_user_tenant(auth.uid())
);
CREATE POLICY "Admins can update tenant" ON public.tenants FOR UPDATE USING (
  id = public.get_user_tenant(auth.uid()) AND public.get_user_role(auth.uid()) = 'admin'
);

-- Tenant features policies
CREATE POLICY "Tenant members can view features" ON public.tenant_features FOR SELECT USING (
  tenant_id = public.get_user_tenant(auth.uid())
);
CREATE POLICY "Anyone can insert features" ON public.tenant_features FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update features" ON public.tenant_features FOR UPDATE USING (
  tenant_id = public.get_user_tenant(auth.uid()) AND public.get_user_role(auth.uid()) = 'admin'
);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert user roles" ON public.user_roles FOR INSERT WITH CHECK (true);

-- Classes policies
CREATE POLICY "Tenant members can view classes" ON public.classes FOR SELECT USING (
  tenant_id = public.get_user_tenant(auth.uid())
);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL USING (
  tenant_id = public.get_user_tenant(auth.uid()) AND public.get_user_role(auth.uid()) = 'admin'
);

-- Students policies
CREATE POLICY "Tenant members can view students" ON public.students FOR SELECT USING (
  tenant_id = public.get_user_tenant(auth.uid())
);
CREATE POLICY "Admins can manage students" ON public.students FOR ALL USING (
  tenant_id = public.get_user_tenant(auth.uid()) AND public.get_user_role(auth.uid()) = 'admin'
);

-- Teachers policies
CREATE POLICY "Tenant members can view teachers" ON public.teachers FOR SELECT USING (
  tenant_id = public.get_user_tenant(auth.uid())
);
CREATE POLICY "Admins can manage teachers" ON public.teachers FOR ALL USING (
  tenant_id = public.get_user_tenant(auth.uid()) AND public.get_user_role(auth.uid()) = 'admin'
);

-- Parents policies
CREATE POLICY "Tenant members can view parents" ON public.parents FOR SELECT USING (
  tenant_id = public.get_user_tenant(auth.uid())
);
CREATE POLICY "Admins can manage parents" ON public.parents FOR ALL USING (
  tenant_id = public.get_user_tenant(auth.uid()) AND public.get_user_role(auth.uid()) = 'admin'
);

-- Activity logs policies
CREATE POLICY "Tenant members can view logs" ON public.activity_logs FOR SELECT USING (
  tenant_id = public.get_user_tenant(auth.uid())
);
CREATE POLICY "Authenticated users can insert logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Examinations policies
CREATE POLICY "Tenant members can view exams" ON public.examinations FOR SELECT USING (
  tenant_id = public.get_user_tenant(auth.uid())
);
CREATE POLICY "Admins can manage exams" ON public.examinations FOR ALL USING (
  tenant_id = public.get_user_tenant(auth.uid()) AND public.get_user_role(auth.uid()) = 'admin'
);

-- =============================================
-- Triggers
-- =============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'admin')
  );
  
  -- Also insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'admin')
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON public.parents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_examinations_updated_at BEFORE UPDATE ON public.examinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX idx_students_tenant_id ON public.students(tenant_id);
CREATE INDEX idx_students_class_id ON public.students(class_id);
CREATE INDEX idx_teachers_tenant_id ON public.teachers(tenant_id);
CREATE INDEX idx_parents_tenant_id ON public.parents(tenant_id);
CREATE INDEX idx_classes_tenant_id ON public.classes(tenant_id);
CREATE INDEX idx_activity_logs_tenant_id ON public.activity_logs(tenant_id);
CREATE INDEX idx_tenant_features_tenant_id ON public.tenant_features(tenant_id);
CREATE INDEX idx_examinations_tenant_id ON public.examinations(tenant_id);
