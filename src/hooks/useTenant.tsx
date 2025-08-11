
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  id: string;
  slug: string;
  name: string;
  custom_domain?: string;
  status: 'active' | 'suspended' | 'trial';
  plan: 'basic' | 'premium' | 'enterprise';
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  timezone: string;
  language: string;
  currency: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  subscription_start?: string;
  subscription_end?: string;
  last_payment_date?: string;
  created_at: string;
  updated_at: string;
}

interface TenantFeature {
  id: string;
  tenant_id: string;
  feature_key: string;
  is_enabled: boolean;
  config: Record<string, any>;
  created_at: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  features: TenantFeature[];
  loading: boolean;
  updateTenant: (updates: Partial<Tenant>) => Promise<void>;
  isFeatureEnabled: (featureKey: string) => boolean;
  getFeatureConfig: (featureKey: string) => Record<string, any>;
  toggleFeature: (featureKey: string, enabled: boolean) => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [features, setFeatures] = useState<TenantFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    try {
      // Get current user's tenant
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile?.tenant_id) {
        // Load tenant data
        const { data: tenantData } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        // Load tenant features
        const { data: featuresData } = await supabase
          .from('tenant_features')
          .select('*')
          .eq('tenant_id', profile.tenant_id);

        if (tenantData) {
          setTenant(tenantData as Tenant);
        }
        
        if (featuresData) {
          setFeatures(featuresData.map(feature => ({
            ...feature,
            config: typeof feature.config === 'string' 
              ? JSON.parse(feature.config) 
              : (feature.config as Record<string, any>) || {}
          })));
        }
      }
    } catch (error) {
      console.error('Error loading tenant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTenant = async (updates: Partial<Tenant>) => {
    if (!tenant) return;

    try {
      const { error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', tenant.id);

      if (error) throw error;

      setTenant({ ...tenant, ...updates });
      toast({
        title: "Settings updated",
        description: "Your school settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast({
        title: "Update failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isFeatureEnabled = (featureKey: string): boolean => {
    const feature = features.find(f => f.feature_key === featureKey);
    return feature?.is_enabled ?? false;
  };

  const getFeatureConfig = (featureKey: string): Record<string, any> => {
    const feature = features.find(f => f.feature_key === featureKey);
    return feature?.config ?? {};
  };

  const toggleFeature = async (featureKey: string, enabled: boolean) => {
    if (!tenant) return;

    try {
      const { error } = await supabase
        .from('tenant_features')
        .update({ is_enabled: enabled })
        .eq('tenant_id', tenant.id)
        .eq('feature_key', featureKey);

      if (error) throw error;

      setFeatures(features.map(f => 
        f.feature_key === featureKey ? { ...f, is_enabled: enabled } : f
      ));

      toast({
        title: enabled ? "Feature enabled" : "Feature disabled",
        description: `${featureKey} has been ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast({
        title: "Update failed",
        description: "Failed to update feature. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value: TenantContextType = {
    tenant,
    features,
    loading,
    updateTenant,
    isFeatureEnabled,
    getFeatureConfig,
    toggleFeature,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
