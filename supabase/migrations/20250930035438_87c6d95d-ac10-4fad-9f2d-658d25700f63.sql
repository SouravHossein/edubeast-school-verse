-- Create activity_logs table for tracking user actions
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for activity logs
CREATE POLICY "Users can view activity logs in their tenant" 
ON public.activity_logs 
FOR SELECT 
USING (tenant_id IN (
  SELECT tenant_id FROM public.profiles 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create activity logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create student_applications table for admission management
CREATE TABLE public.student_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  previous_school TEXT,
  grade_applying_for TEXT NOT NULL,
  application_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for student applications
CREATE POLICY "Admins can manage student applications" 
ON public.student_applications 
FOR ALL 
USING (tenant_id IN (
  SELECT tenant_id FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Public can create applications" 
ON public.student_applications 
FOR INSERT 
WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX idx_activity_logs_tenant_id ON public.activity_logs(tenant_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_module ON public.activity_logs(module);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);

CREATE INDEX idx_student_applications_tenant_id ON public.student_applications(tenant_id);
CREATE INDEX idx_student_applications_status ON public.student_applications(status);
CREATE INDEX idx_student_applications_created_at ON public.student_applications(created_at);

-- Create trigger for updating updated_at on student_applications
CREATE TRIGGER update_student_applications_updated_at
  BEFORE UPDATE ON public.student_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();