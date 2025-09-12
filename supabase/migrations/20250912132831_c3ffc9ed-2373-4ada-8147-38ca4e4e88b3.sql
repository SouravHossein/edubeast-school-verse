-- Fix previous migration - remove the failing INSERT and recreate message templates table

-- Drop the message templates table if it exists to start fresh
DROP TABLE IF EXISTS message_templates CASCADE;

-- Recreate message templates table
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

-- Enable RLS for message templates
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

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

-- Add trigger for updated_at
CREATE TRIGGER update_message_templates_updated_at
  BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();