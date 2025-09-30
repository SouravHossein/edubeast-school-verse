import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLog } from './useActivityLog';

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  recentEnrollments: number;
  pendingApprovals: number;
  activeExams: number;
  totalRevenue: number;
}

export interface RecentActivity {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  time: string;
  module: string;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 0,
    recentEnrollments: 0,
    pendingApprovals: 0,
    activeExams: 0,
    totalRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { getRecentActivities } = useActivityLog();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch students count
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch teachers count
      const { count: teachersCount } = await supabase
        .from('teachers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch classes count
      const { count: classesCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch recent enrollments (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: recentEnrollmentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Fetch pending approvals
      const { count: pendingApprovalsCount } = await supabase
        .from('student_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch active exams
      const today = new Date().toISOString().split('T')[0];
      const { count: activeExamsCount } = await supabase
        .from('examinations')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('end_date', today);

      // Calculate attendance rate (mock for now - would need attendance records)
      const attendanceRate = 94; // Placeholder

      // Calculate total revenue (mock for now - would need payment records)
      const totalRevenue = 25000; // Placeholder

      setStats({
        totalStudents: studentsCount || 0,
        totalTeachers: teachersCount || 0,
        totalClasses: classesCount || 0,
        attendanceRate,
        recentEnrollments: recentEnrollmentsCount || 0,
        pendingApprovals: pendingApprovalsCount || 0,
        activeExams: activeExamsCount || 0,
        totalRevenue,
      });

      // Fetch recent activities
      const activities = await getRecentActivities();
      const formattedActivities = activities.map(activity => ({
        id: activity.id,
        type: getActivityType(activity.action),
        message: formatActivityMessage(activity),
        time: formatTime(activity.created_at),
        module: activity.module,
      }));

      setRecentActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityType = (action: string): 'success' | 'warning' | 'info' | 'error' => {
    if (action.includes('create') || action.includes('approve')) return 'success';
    if (action.includes('delete') || action.includes('reject')) return 'error';
    if (action.includes('update') || action.includes('modify')) return 'warning';
    return 'info';
  };

  const formatActivityMessage = (activity: any): string => {
    const { module, action, resource_type, profiles } = activity;
    const userName = profiles?.full_name || 'Someone';
    
    switch (action) {
      case 'create':
        return `${userName} created a new ${resource_type || module}`;
      case 'update':
        return `${userName} updated ${resource_type || module}`;
      case 'delete':
        return `${userName} deleted ${resource_type || module}`;
      case 'approve':
        return `${userName} approved ${resource_type || module}`;
      case 'login':
        return `${userName} logged into the system`;
      default:
        return `${userName} performed ${action} in ${module}`;
    }
  };

  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  return {
    stats,
    recentActivities,
    loading,
    refetch: fetchDashboardStats,
  };
};