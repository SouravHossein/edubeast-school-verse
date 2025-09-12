-- Create integrations and automation system tables

-- Create enum for integration types
CREATE TYPE integration_type AS ENUM ('zoom', 'google_meet', 'google_drive', 'whatsapp', 'email', 'sms');

-- Create enum for automation trigger types  
CREATE TYPE trigger_type AS ENUM ('class_scheduled', 'exam_created', 'student_enrolled', 'fee_due', 'attendance_marked', 'notice_published', 'assignment_uploaded');

-- Create enum for automation action types
CREATE TYPE action_type AS ENUM ('create_meeting', 'upload_file', 'send_message', 'send_email', 'add_calendar_event', 'push_notification');

-- Create integrations table
CREATE TABLE public.integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  service_name integration_type NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config_json JSONB NOT NULL DEFAULT '{}', -- Encrypted OAuth tokens, API keys, settings
  webhook_url TEXT, -- For receiving webhooks from services
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, service_name)
);

-- Create automation rules table
CREATE TABLE public.automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  rule_name TEXT NOT NULL,
  trigger_type trigger_type NOT NULL,
  trigger_conditions JSONB DEFAULT '{}', -- Conditions for when rule should fire
  actions JSONB NOT NULL DEFAULT '[]', -- Array of actions to execute
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  execution_count INTEGER DEFAULT 0,
  last_executed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create automation execution logs table
CREATE TABLE public.automation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  rule_id UUID REFERENCES automation_rules(id) ON DELETE CASCADE,
  trigger_event JSONB NOT NULL, -- The event data that triggered the rule
  executed_actions JSONB NOT NULL DEFAULT '[]', -- Actions that were executed
  status TEXT NOT NULL DEFAULT 'pending', -- pending, success, partial_success, failed
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create integration webhooks table for incoming webhook data
CREATE TABLE public.integration_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  webhook_data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create message templates table for WhatsApp/SMS/Email
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- whatsapp, sms, email
  subject TEXT, -- For email templates
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Available variables like {student_name}, {class_name}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for integrations
CREATE POLICY "Integrations viewable by tenant members" ON integrations
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only tenant admins can manage integrations" ON integrations
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for automation rules
CREATE POLICY "Automation rules viewable by tenant members" ON automation_rules
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only tenant admins can manage automation rules" ON automation_rules
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for automation logs
CREATE POLICY "Automation logs viewable by tenant admins" ON automation_logs
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for integration webhooks
CREATE POLICY "Integration webhooks viewable by tenant admins" ON integration_webhooks
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for message templates
CREATE POLICY "Message templates viewable by tenant members" ON message_templates
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Only tenant admins can manage message templates" ON message_templates
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at
  BEFORE UPDATE ON automation_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default message templates
INSERT INTO message_templates (tenant_id, template_name, template_type, content, variables) VALUES
((SELECT id FROM tenants LIMIT 1), 'Class Reminder', 'whatsapp', 'Hi {student_name}, your {subject} class is scheduled for {date} at {time}. Please join on time.', '["student_name", "subject", "date", "time"]'),
((SELECT id FROM tenants LIMIT 1), 'Fee Due Alert', 'whatsapp', 'Dear Parent, fee payment for {student_name} is due on {due_date}. Amount: {amount}. Please pay at your earliest convenience.', '["student_name", "due_date", "amount"]'),
((SELECT id FROM tenants LIMIT 1), 'Exam Schedule', 'email', 'Your {exam_name} examination is scheduled for {exam_date} from {start_time} to {end_time}. Best of luck!', '["exam_name", "exam_date", "start_time", "end_time"]'),
((SELECT id FROM tenants LIMIT 1), 'Attendance Alert', 'whatsapp', 'Dear Parent, {student_name} was absent from school today ({date}). Please contact the school if this was unexcused.', '["student_name", "date"]');

-- Create function to trigger automation rules
CREATE OR REPLACE FUNCTION trigger_automation_rules(
  p_tenant_id UUID,
  p_trigger_type trigger_type,
  p_trigger_data JSONB
) RETURNS void AS $$
DECLARE
  rule_record RECORD;
BEGIN
  -- Find all active rules for this trigger type and tenant
  FOR rule_record IN 
    SELECT id, actions, trigger_conditions
    FROM automation_rules 
    WHERE tenant_id = p_tenant_id 
      AND trigger_type = p_trigger_type 
      AND is_active = true
  LOOP
    -- TODO: Add condition evaluation logic here
    -- For now, we'll execute all rules
    
    -- Log the execution (actual execution would be handled by background jobs)
    INSERT INTO automation_logs (
      tenant_id, rule_id, trigger_event, executed_actions, status
    ) VALUES (
      p_tenant_id, rule_record.id, p_trigger_data, rule_record.actions, 'pending'
    );
    
    -- Update execution count
    UPDATE automation_rules 
    SET execution_count = execution_count + 1,
        last_executed = now()
    WHERE id = rule_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;