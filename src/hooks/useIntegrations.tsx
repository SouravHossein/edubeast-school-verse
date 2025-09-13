import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from './useTenant';
import { toast } from 'sonner';

export interface Integration {
  id: string;
  tenant_id: string;
  service_name: string;
  config_json: any;
  enabled: boolean;
  health_status: 'healthy' | 'warning' | 'error' | 'unknown';
  last_health_check?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationLog {
  id: string;
  tenant_id?: string;
  integration_id?: string;
  actor_user_id?: string;
  action: string;
  payload: any;
  status: 'success' | 'error' | 'pending' | 'retry';
  error_message?: string;
  execution_time_ms?: number;
  created_at: string;
}

export const useIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { tenant } = useTenant();

  // Fetch integrations
  const fetchIntegrations = async () => {
    if (!tenant?.id) return;

    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations((data || []) as Integration[]);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast.error('Failed to fetch integrations');
    }
  };

  // Fetch integration logs
  const fetchLogs = async (integrationId?: string, limit = 50) => {
    if (!tenant?.id) return;

    try {
      let query = supabase
        .from('integration_logs')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (integrationId) {
        query = query.eq('integration_id', integrationId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs((data || []) as IntegrationLog[]);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch integration logs');
    }
  };

  // Create or update integration
  const upsertIntegration = async (serviceName: string, config: any) => {
    if (!tenant?.id) return null;

    try {
      const { data, error } = await supabase
        .from('integrations')
        .upsert({
          tenant_id: tenant.id,
          service_name: serviceName,
          config_json: config,
          enabled: true,
          health_status: 'unknown'
        }, {
          onConflict: 'tenant_id,service_name'
        })
        .select()
        .single();

      if (error) throw error;

      await fetchIntegrations();
      toast.success(`${serviceName} integration configured successfully`);
      return data;
    } catch (error) {
      console.error('Error upserting integration:', error);
      toast.error(`Failed to configure ${serviceName} integration`);
      return null;
    }
  };

  // Enable/disable integration
  const toggleIntegration = async (integrationId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ enabled })
        .eq('id', integrationId);

      if (error) throw error;

      await fetchIntegrations();
      toast.success(`Integration ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling integration:', error);
      toast.error('Failed to update integration');
    }
  };

  // Delete integration
  const deleteIntegration = async (integrationId: string) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId);

      if (error) throw error;

      await fetchIntegrations();
      toast.success('Integration deleted successfully');
    } catch (error) {
      console.error('Error deleting integration:', error);
      toast.error('Failed to delete integration');
    }
  };

  // Test integration connection
  const testIntegration = async (integration: Integration) => {
    try {
      // Call health check endpoint
      const { data, error } = await supabase.functions.invoke('integrations-oauth', {
        body: {
          action: 'health_check',
          tenant_id: integration.tenant_id,
          service: integration.service_name
        }
      });

      if (error) throw error;

      const healthStatus = data.success ? 'healthy' : 'error';

      // Update health status
      await supabase
        .from('integrations')
        .update({
          health_status: healthStatus,
          last_health_check: new Date().toISOString()
        })
        .eq('id', integration.id);

      await fetchIntegrations();
      toast.success(`Integration test ${data.success ? 'passed' : 'failed'}`);
      return data.success;
    } catch (error) {
      console.error('Error testing integration:', error);
      toast.error('Failed to test integration');
      return false;
    }
  };

  // OAuth initiation
  const initiateOAuth = async (serviceName: string, config: any) => {
    if (!tenant?.id) return null;

    try {
      // First, save the integration config
      await upsertIntegration(serviceName, config);

      // Then initiate OAuth
      const { data, error } = await supabase.functions.invoke('integrations-oauth', {
        body: {
          action: 'initiate',
          service: serviceName,
          tenant_id: tenant.id
        }
      });

      if (error) throw error;

      if (data.authUrl) {
        // Redirect to OAuth provider
        window.open(data.authUrl, '_blank', 'width=600,height=600');
        toast.info('Opening OAuth window...');
      }

      return data;
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      toast.error('Failed to start OAuth process');
      return null;
    }
  };

  // Refresh OAuth tokens
  const refreshTokens = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return false;

    try {
      const { data, error } = await supabase.functions.invoke('integrations-oauth', {
        body: {
          action: 'refresh',
          service: integration.service_name,
          tenant_id: integration.tenant_id
        }
      });

      if (error) throw error;

      if (data.success) {
        await fetchIntegrations();
        toast.success('Tokens refreshed successfully');
      }

      return data.success;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      toast.error('Failed to refresh tokens');
      return false;
    }
  };

  // Service-specific actions
  const createZoomMeeting = async (meetingData: any) => {
    if (!tenant?.id) return null;

    try {
      const { data, error } = await supabase.functions.invoke('zoom-integration', {
        body: {
          tenantId: tenant.id,
          action: 'create_meeting',
          ...meetingData
        }
      });

      if (error) throw error;

      if (data.success) {
        await fetchLogs();
        toast.success('Zoom meeting created successfully');
      }

      return data;
    } catch (error) {
      console.error('Error creating Zoom meeting:', error);
      toast.error('Failed to create Zoom meeting');
      return null;
    }
  };

  const createGoogleMeet = async (eventData: any) => {
    if (!tenant?.id) return null;

    try {
      const { data, error } = await supabase.functions.invoke('google-integrations', {
        body: {
          tenantId: tenant.id,
          service: 'google_meet',
          action: 'create_meeting',
          ...eventData
        }
      });

      if (error) throw error;

      if (data.success) {
        await fetchLogs();
        toast.success('Google Meet created successfully');
      }

      return data;
    } catch (error) {
      console.error('Error creating Google Meet:', error);
      toast.error('Failed to create Google Meet');
      return null;
    }
  };

  const uploadToGoogleDrive = async (file: File, folderId?: string) => {
    if (!tenant?.id) return null;

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folder_id', folderId);

      const { data, error } = await supabase.functions.invoke('google-integrations', {
        body: {
          tenantId: tenant.id,
          service: 'google_drive',
          action: 'upload_file',
          formData
        }
      });

      if (error) throw error;

      if (data.success) {
        await fetchLogs();
        toast.success('File uploaded to Google Drive successfully');
      }

      return data;
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      toast.error('Failed to upload file to Google Drive');
      return null;
    }
  };

  const sendWhatsAppMessage = async (messageData: any) => {
    if (!tenant?.id) return null;

    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-integration', {
        body: {
          tenantId: tenant.id,
          action: 'send_message',
          ...messageData
        }
      });

      if (error) throw error;

      if (data.success) {
        await fetchLogs();
        toast.success('WhatsApp message sent successfully');
      }

      return data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast.error('Failed to send WhatsApp message');
      return null;
    }
  };

  // Get integration by service name
  const getIntegration = (serviceName: string): Integration | undefined => {
    return integrations.find(i => i.service_name === serviceName);
  };

  // Check if service is connected and healthy
  const isServiceConnected = (serviceName: string): boolean => {
    const integration = getIntegration(serviceName);
    return integration?.enabled && integration.health_status === 'healthy';
  };

  useEffect(() => {
    if (tenant?.id) {
      setLoading(true);
      Promise.all([
        fetchIntegrations(),
        fetchLogs()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [tenant?.id]);

  return {
    // State
    integrations,
    logs,
    loading,
    
    // Actions
    fetchIntegrations,
    fetchLogs,
    upsertIntegration,
    toggleIntegration,
    deleteIntegration,
    testIntegration,
    initiateOAuth,
    refreshTokens,
    
    // Service-specific actions
    createZoomMeeting,
    createGoogleMeet,
    uploadToGoogleDrive,
    sendWhatsAppMessage,
    
    // Helpers
    getIntegration,
    isServiceConnected
  };
};