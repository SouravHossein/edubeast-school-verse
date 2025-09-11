-- Create page customization system tables

-- Create enum for page types
CREATE TYPE page_type AS ENUM ('fully_customizable', 'semi_customizable', 'lightly_customizable', 'not_customizable');

-- Create page_templates table for default page configurations
CREATE TABLE public.page_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  page_title TEXT NOT NULL,
  page_type page_type NOT NULL,
  default_sections JSONB DEFAULT '[]', -- Array of section configurations
  allowed_customizations JSONB DEFAULT '{}', -- What can be customized
  is_system_page BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create page_customizations table for tenant-specific customizations
CREATE TABLE public.page_customizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  page_slug TEXT NOT NULL,
  customization_data JSONB NOT NULL DEFAULT '{}', -- All customization settings
  theme_settings JSONB DEFAULT '{}', -- Colors, fonts, etc.
  layout_data JSONB DEFAULT '[]', -- Section arrangement and content
  seo_settings JSONB DEFAULT '{}', -- Meta tags, titles, etc.
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id, page_slug)
);

-- Create page_sections table for reusable section templates
CREATE TABLE public.page_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL, -- 'hero', 'text_block', 'image_gallery', 'contact_form', etc.
  section_name TEXT NOT NULL,
  default_props JSONB DEFAULT '{}', -- Default section properties
  allowed_props JSONB DEFAULT '{}', -- What properties can be customized
  component_path TEXT, -- Path to React component
  is_system_section BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create file_uploads table for customization assets
CREATE TABLE public.file_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'video', 'document'
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default page templates
INSERT INTO page_templates (page_slug, page_title, page_type, default_sections, allowed_customizations, is_system_page) VALUES
('home', 'Home Page', 'fully_customizable', '[
  {"type": "hero", "id": "hero_1", "props": {"title": "Welcome to Our School", "subtitle": "Excellence in Education", "image": "/hero-image.jpg"}},
  {"type": "highlights", "id": "highlights_1", "props": {"title": "Why Choose Us", "items": []}},
  {"type": "cta", "id": "cta_1", "props": {"title": "Ready to Join?", "subtitle": "Apply now for admission"}}
]', '{"layout": true, "content": true, "styling": true, "seo": true}', false),

('about', 'About Us', 'fully_customizable', '[
  {"type": "hero", "id": "about_hero", "props": {"title": "About Our School", "subtitle": "Our Story and Mission"}},
  {"type": "text_block", "id": "mission", "props": {"title": "Our Mission", "content": "Providing quality education..."}},
  {"type": "text_block", "id": "history", "props": {"title": "Our History", "content": "Founded in..."}}
]', '{"layout": true, "content": true, "styling": true, "seo": true}', false),

('contact', 'Contact Us', 'fully_customizable', '[
  {"type": "hero", "id": "contact_hero", "props": {"title": "Contact Us", "subtitle": "Get in touch with us"}},
  {"type": "contact_form", "id": "contact_form", "props": {"title": "Send us a message"}},
  {"type": "contact_info", "id": "contact_info", "props": {"address": "", "phone": "", "email": ""}}
]', '{"layout": true, "content": true, "styling": true, "seo": true}', false),

('dashboard', 'Dashboard', 'lightly_customizable', '[]', '{"theme": true, "widgets": true, "colors": true}', true),

('student-management', 'Student Management', 'lightly_customizable', '[]', '{"theme": true, "table_view": true, "colors": true}', true),

('login', 'Login', 'not_customizable', '[]', '{"logo": true, "colors": true}', true);

-- Insert default section templates
INSERT INTO page_sections (section_type, section_name, default_props, allowed_props, component_path, is_system_section) VALUES
('hero', 'Hero Banner', '{"title": "Default Title", "subtitle": "Default Subtitle", "image": "", "buttons": []}', '{"title": "text", "subtitle": "text", "image": "image", "buttons": "array"}', 'HeroSection', true),
('text_block', 'Text Block', '{"title": "Default Title", "content": "Default content", "alignment": "left"}', '{"title": "text", "content": "rich_text", "alignment": "select"}', 'TextBlockSection', true),
('image_gallery', 'Image Gallery', '{"title": "Gallery", "images": [], "columns": 3}', '{"title": "text", "images": "image_array", "columns": "number"}', 'ImageGallerySection', true),
('contact_form', 'Contact Form', '{"title": "Contact Form", "fields": ["name", "email", "message"]}', '{"title": "text", "fields": "array"}', 'ContactFormSection', true),
('highlights', 'Feature Highlights', '{"title": "Features", "items": []}', '{"title": "text", "items": "array"}', 'HighlightsSection', true),
('cta', 'Call to Action', '{"title": "Take Action", "subtitle": "Description", "button_text": "Get Started"}', '{"title": "text", "subtitle": "text", "button_text": "text", "button_link": "text"}', 'CTASection', true);

-- Enable RLS
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS policies for page_templates
CREATE POLICY "Page templates are viewable by everyone" ON page_templates
  FOR SELECT USING (true);

-- RLS policies for page_customizations
CREATE POLICY "Page customizations viewable by tenant members" ON page_customizations
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    ) OR tenant_id IS NULL
  );

CREATE POLICY "Only tenant admins can manage page customizations" ON page_customizations
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for page_sections
CREATE POLICY "Page sections are viewable by everyone" ON page_sections
  FOR SELECT USING (true);

CREATE POLICY "Only super admins can manage page sections" ON page_sections
  FOR ALL USING (is_super_admin());

-- RLS policies for file_uploads
CREATE POLICY "File uploads viewable by tenant members" ON file_uploads
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can upload files" ON file_uploads
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    ) AND uploaded_by = auth.uid()
  );

CREATE POLICY "Users can manage their uploaded files" ON file_uploads
  FOR ALL USING (uploaded_by = auth.uid());

-- Add triggers for updated_at
CREATE TRIGGER update_page_templates_updated_at
  BEFORE UPDATE ON page_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_customizations_updated_at
  BEFORE UPDATE ON page_customizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get page customization with fallback
CREATE OR REPLACE FUNCTION get_page_customization(
  p_tenant_id UUID,
  p_page_slug TEXT
) RETURNS JSONB AS $$
DECLARE
  customization JSONB;
  template JSONB;
BEGIN
  -- Try to get tenant-specific customization
  SELECT customization_data INTO customization
  FROM page_customizations
  WHERE tenant_id = p_tenant_id AND page_slug = p_page_slug AND is_published = true;
  
  -- If no customization found, get default template
  IF customization IS NULL THEN
    SELECT jsonb_build_object(
      'sections', default_sections,
      'theme', '{}',
      'seo', '{}'
    ) INTO customization
    FROM page_templates
    WHERE page_slug = p_page_slug;
  END IF;
  
  RETURN COALESCE(customization, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;