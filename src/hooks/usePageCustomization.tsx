import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/hooks/useTenant';
import { toast } from 'sonner';

export interface PageSection {
  id: string;
  type: string;
  order: number;
  props: Record<string, any>;
}

export interface PageCustomization {
  id: string;
  tenant_id: string;
  page_slug: string;
  customization_data: {
    sections: PageSection[];
    theme: Record<string, any>;
    seo: Record<string, any>;
  };
  theme_settings: Record<string, any>;
  layout_data: PageSection[];
  seo_settings: Record<string, any>;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PageTemplate {
  id: string;
  page_slug: string;
  page_title: string;
  page_type: 'fully_customizable' | 'semi_customizable' | 'lightly_customizable' | 'not_customizable';
  default_sections: PageSection[];
  allowed_customizations: Record<string, boolean>;
  is_system_page: boolean;
}

export interface SectionTemplate {
  id: string;
  section_type: string;
  section_name: string;
  default_props: Record<string, any>;
  allowed_props: Record<string, any>;
  component_path: string;
  is_system_section: boolean;
}

export function usePageCustomization() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  // Get page templates
  const { data: pageTemplates, isLoading: templatesLoading } = useQuery({
    queryKey: ['page-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_templates')
        .select('*')
        .order('page_slug');
      
      if (error) throw error;
      return data as any[];
    },
  });

  // Get section templates
  const { data: sectionTemplates, isLoading: sectionsLoading } = useQuery({
    queryKey: ['page-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .order('section_name');
      
      if (error) throw error;
      return data as SectionTemplate[];
    },
  });

  // Get page customizations for current tenant
  const { data: customizations, isLoading: customizationsLoading } = useQuery({
    queryKey: ['page-customizations', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];
      
      const { data, error } = await supabase
        .from('page_customizations')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('page_slug');
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!tenant?.id,
  });

  // Get specific page customization
  const getPageCustomization = async (pageSlug: string) => {
    if (!tenant?.id) return null;

    const { data, error } = await supabase
      .rpc('get_page_customization', {
        p_tenant_id: tenant.id,
        p_page_slug: pageSlug
      });

    if (error) throw error;
    return data;
  };

  // Save page customization
  const saveCustomizationMutation = useMutation({
    mutationFn: async ({ 
      pageSlug, 
      customizationData, 
      isPublished = false 
    }: { 
      pageSlug: string; 
      customizationData: any; 
      isPublished?: boolean; 
    }) => {
      if (!tenant?.id || !user?.id) throw new Error('Unauthorized');

      const { data, error } = await supabase
        .from('page_customizations')
        .upsert({
          tenant_id: tenant.id,
          page_slug: pageSlug,
          customization_data: customizationData,
          theme_settings: customizationData.theme || {},
          layout_data: customizationData.sections || [],
          seo_settings: customizationData.seo || {},
          is_published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as any;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['page-customizations'] });
      toast.success(`Page customization ${data.is_published ? 'published' : 'saved'} successfully`);
    },
    onError: (error) => {
      console.error('Error saving customization:', error);
      toast.error('Failed to save customization');
    },
  });

  // Reset to default
  const resetToDefaultMutation = useMutation({
    mutationFn: async (pageSlug: string) => {
      if (!tenant?.id) throw new Error('Unauthorized');

      const { error } = await supabase
        .from('page_customizations')
        .delete()
        .eq('tenant_id', tenant.id)
        .eq('page_slug', pageSlug);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-customizations'] });
      toast.success('Page reset to default successfully');
    },
    onError: (error) => {
      console.error('Error resetting page:', error);
      toast.error('Failed to reset page');
    },
  });

  // File upload
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, altText }: { file: File; altText?: string }) => {
      if (!tenant?.id || !user?.id) throw new Error('Unauthorized');

      // In a real implementation, you would upload to storage
      // For now, we'll just store the file info
      const fileUrl = URL.createObjectURL(file);
      
      const { data, error } = await supabase
        .from('file_uploads')
        .insert({
          tenant_id: tenant.id,
          file_name: file.name,
          file_url: fileUrl,
          file_type: file.type.startsWith('image/') ? 'image' : 'document',
          file_size: file.size,
          mime_type: file.type,
          alt_text: altText,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    },
  });

  return {
    pageTemplates,
    sectionTemplates,
    customizations,
    isLoading: templatesLoading || sectionsLoading || customizationsLoading,
    getPageCustomization,
    saveCustomization: saveCustomizationMutation.mutate,
    resetToDefault: resetToDefaultMutation.mutate,
    uploadFile: uploadFileMutation.mutate,
    isSaving: saveCustomizationMutation.isPending,
    isResetting: resetToDefaultMutation.isPending,
    isUploading: uploadFileMutation.isPending,
  };
}