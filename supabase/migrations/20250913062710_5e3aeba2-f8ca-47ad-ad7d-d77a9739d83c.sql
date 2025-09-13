-- Enhanced integrations module with proper schema and security

-- Create integrations table with encrypted config storage
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  service_name TEXT NOT NULL CHECK (service_name IN ('zoom', 'google_meet', 'google_drive', 'google_chat', 'google_forms', 'google_classroom', 'whatsapp')),
  config_json JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN DEFAULT true,
  last_health_check TIMESTAMP WITH TIME ZONE,
  health_status TEXT DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'warning', 'error', 'unknown')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, service_name)
);

-- Create integration_logs table for comprehensive audit trail
CREATE TABLE public.integration_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  integration_id UUID REFERENCES public.integrations(id) ON DELETE CASCADE,
  actor_user_id UUID,
  action TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending', 'retry')),
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integration_webhooks table for webhook management
CREATE TABLE public.integration_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  service_name TEXT NOT NULL,
  webhook_id TEXT,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  signature TEXT,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integration_tokens table for secure token management
CREATE TABLE public.integration_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL REFERENCES public.integrations(id) ON DELETE CASCADE,
  token_type TEXT NOT NULL CHECK (token_type IN ('access', 'refresh')),
  encrypted_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  scopes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create integration_quotas table for rate limiting
CREATE TABLE public.integration_quotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  service_name TEXT NOT NULL,
  quota_type TEXT NOT NULL, -- e.g., 'messages_per_minute', 'api_calls_per_hour'
  current_usage INTEGER DEFAULT 0,
  max_limit INTEGER NOT NULL,
  reset_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, service_name, quota_type)
);

-- Enable RLS
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_quotas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integrations
CREATE POLICY "Tenant admins can manage integrations" 
ON public.integrations 
FOR ALL 
USING (tenant_id IN (
  SELECT profiles.tenant_id 
  FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

CREATE POLICY "Teachers can view integrations" 
ON public.integrations 
FOR SELECT 
USING (tenant_id IN (
  SELECT profiles.tenant_id 
  FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('admin', 'teacher')
));

-- RLS Policies for integration_logs
CREATE POLICY "Tenant members can view integration logs" 
ON public.integration_logs 
FOR SELECT 
USING (tenant_id IN (
  SELECT profiles.tenant_id 
  FROM profiles 
  WHERE profiles.user_id = auth.uid()
));

CREATE POLICY "System can insert integration logs" 
ON public.integration_logs 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for integration_webhooks
CREATE POLICY "System can manage webhooks" 
ON public.integration_webhooks 
FOR ALL 
USING (true);

-- RLS Policies for integration_tokens
CREATE POLICY "System can manage tokens" 
ON public.integration_tokens 
FOR ALL 
USING (true);

-- RLS Policies for integration_quotas
CREATE POLICY "Tenant admins can view quotas" 
ON public.integration_quotas 
FOR SELECT 
USING (tenant_id IN (
  SELECT profiles.tenant_id 
  FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create indexes for performance
CREATE INDEX idx_integrations_tenant_service ON public.integrations(tenant_id, service_name);
CREATE INDEX idx_integration_logs_tenant_created ON public.integration_logs(tenant_id, created_at DESC);
CREATE INDEX idx_integration_logs_integration ON public.integration_logs(integration_id, created_at DESC);
CREATE INDEX idx_integration_webhooks_processed ON public.integration_webhooks(processed, created_at);
CREATE INDEX idx_integration_tokens_integration ON public.integration_tokens(integration_id, token_type);
CREATE INDEX idx_integration_quotas_reset ON public.integration_quotas(reset_at);

-- Create triggers for updated_at
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON public.integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integration_tokens_updated_at
  BEFORE UPDATE ON public.integration_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_integration_quotas_updated_at
  BEFORE UPDATE ON public.integration_quotas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log integration actions
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

-- Function to check and update quotas
CREATE OR REPLACE FUNCTION public.check_integration_quota(
  p_tenant_id UUID,
  p_service_name TEXT,
  p_quota_type TEXT,
  p_increment INTEGER DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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