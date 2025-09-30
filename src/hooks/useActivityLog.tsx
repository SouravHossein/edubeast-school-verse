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
      
      // Use raw SQL query to avoid type issues with new table
      const { data, error } = await supabase
        .rpc('get_activity_logs', { log_limit: limit });

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      setActivities(data || []);
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
      // Use a simpler approach to log activities for now
      const activityEntry = {
        user_id: user.id,
        tenant_id: (user as any).tenantId || 'default-tenant',
        module: activityData.module,
        action: activityData.action,
        resource_type: activityData.resource_type || null,
        resource_id: activityData.resource_id || null,
        metadata: activityData.metadata || {},
        user_agent: navigator.userAgent,
      };

      console.log('Logging activity:', activityEntry);
      
      // For now, just return true and log to console
      // This will be updated when the types are properly generated
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  };

  const getRecentActivities = async (userId?: string, module?: string): Promise<ActivityLog[]> => {
    try {
      // Mock data for now until types are properly generated
      const mockActivities: ActivityLog[] = [
        {
          id: '1',
          user_id: user?.id || '',
          tenant_id: 'default',
          module: 'students',
          action: 'create',
          resource_type: 'student',
          created_at: new Date().toISOString(),
          profiles: {
            full_name: user?.fullName || 'Unknown User',
            email: user?.email || 'unknown@example.com'
          }
        },
        {
          id: '2',
          user_id: user?.id || '',
          tenant_id: 'default',
          module: 'dashboard',
          action: 'view',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          profiles: {
            full_name: user?.fullName || 'Unknown User',
            email: user?.email || 'unknown@example.com'
          }
        }
      ];

      return mockActivities;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      // For now, don't fetch activities until types are properly generated
      // fetchActivities();
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