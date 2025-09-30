import { useState, useEffect } from 'react';
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
  profiles?: {
    full_name: string;
    email: string;
  };
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
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const transformedData = data?.map(item => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) as ActivityLog[];

      setActivities(transformedData || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (activityData: CreateActivityData): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert([{
          user_id: user.id,
          tenant_id: user.tenantId,
          ...activityData,
          ip_address: null, // Will be filled by server if needed
          user_agent: navigator.userAgent
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  };

  const getRecentActivities = async (userId?: string, module?: string) => {
    try {
      let query = supabase
        .from('activity_logs')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (module) {
        query = query.eq('module', module);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(item => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) as ActivityLog[] || [];
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  return {
    activities,
    loading,
    logActivity,
    getRecentActivities,
    refetch: fetchActivities,
  };
};