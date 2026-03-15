import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ActivityLog {
  id: string;
  user_id: string;
  tenant_id: string;
  module: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  profiles?: { full_name: string; email: string };
}

export interface CreateActivityData {
  module: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: Record<string, any>;
}

export const useActivityLog = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchActivities = async (limit = 50) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      setActivities((data as unknown as ActivityLog[]) || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (activityData: CreateActivityData): Promise<boolean> => {
    if (!user) return false;
    try {
      const { error } = await supabase.from('activity_logs').insert({
        user_id: user.id,
        tenant_id: user.tenantId || '',
        module: activityData.module,
        action: activityData.action,
        resource_type: activityData.resource_type || null,
        resource_id: activityData.resource_id || null,
        metadata: activityData.metadata || {},
        user_agent: navigator.userAgent,
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  };

  const getRecentActivities = async (): Promise<ActivityLog[]> => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data as unknown as ActivityLog[]) || [];
    } catch {
      return [];
    }
  };

  return { activities, loading, logActivity, getRecentActivities, refetch: fetchActivities };
};
