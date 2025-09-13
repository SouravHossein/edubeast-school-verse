-- Fix security issues and add missing RLS policies

-- Add missing RLS policies for tables that need them
CREATE POLICY "Tenant admins can manage exam schedules" 
ON public.exam_schedules 
FOR ALL 
USING (examination_id IN (
  SELECT e.id FROM public.examinations e
  WHERE e.tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
));

CREATE POLICY "Teachers and students can view exam schedules" 
ON public.exam_schedules 
FOR SELECT 
USING (examination_id IN (
  SELECT e.id FROM public.examinations e
  WHERE e.tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
));

CREATE POLICY "Teachers can manage timetables" 
ON public.timetables 
FOR ALL 
USING (class_id IN (
  SELECT c.id FROM public.classes c
  WHERE c.tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
));

CREATE POLICY "Users can view timetables" 
ON public.timetables 
FOR SELECT 
USING (class_id IN (
  SELECT c.id FROM public.classes c
  WHERE c.tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
));

CREATE POLICY "Admins can manage fee payments" 
ON public.fee_payments 
FOR ALL 
USING (student_id IN (
  SELECT s.id FROM public.students s
  WHERE s.tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
));

-- Fix functions with proper search_path
CREATE OR REPLACE FUNCTION public.log_integration_action(
  p_tenant_id UUID,
  p_integration_id UUID,
  p_action TEXT,
  p_payload JSONB DEFAULT '{}',
  p_status TEXT DEFAULT 'success',
  p_error_message TEXT DEFAULT NULL,
  p_execution_time_ms INTEGER DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.integration_logs (
    tenant_id, integration_id, actor_user_id, action, payload, 
    status, error_message, execution_time_ms
  ) VALUES (
    p_tenant_id, p_integration_id, auth.uid(), p_action, p_payload,
    p_status, p_error_message, p_execution_time_ms
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_integration_quota(
  p_tenant_id UUID,
  p_service_name TEXT,
  p_quota_type TEXT,
  p_increment INTEGER DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_quota RECORD;
  quota_available BOOLEAN := false;
BEGIN
  -- Get current quota
  SELECT * INTO current_quota
  FROM public.integration_quotas
  WHERE tenant_id = p_tenant_id 
  AND service_name = p_service_name 
  AND quota_type = p_quota_type;
  
  -- Reset if past reset time
  IF current_quota.reset_at <= now() THEN
    UPDATE public.integration_quotas
    SET current_usage = 0,
        reset_at = CASE 
          WHEN p_quota_type LIKE '%_per_minute' THEN now() + interval '1 minute'
          WHEN p_quota_type LIKE '%_per_hour' THEN now() + interval '1 hour'
          WHEN p_quota_type LIKE '%_per_day' THEN now() + interval '1 day'
          ELSE now() + interval '1 hour'
        END
    WHERE id = current_quota.id;
    
    current_quota.current_usage := 0;
  END IF;
  
  -- Check if quota allows increment
  IF current_quota.current_usage + p_increment <= current_quota.max_limit THEN
    UPDATE public.integration_quotas
    SET current_usage = current_usage + p_increment
    WHERE id = current_quota.id;
    
    quota_available := true;
  END IF;
  
  RETURN quota_available;
END;
$$;