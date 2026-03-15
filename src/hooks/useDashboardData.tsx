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
    totalStudents: 0, totalTeachers: 0, totalClasses: 0, attendanceRate: 0,
    recentEnrollments: 0, pendingApprovals: 0, activeExams: 0, totalRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { getRecentActivities } = useActivityLog();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const { count: studentsCount } = await supabase
        .from('students').select('*', { count: 'exact', head: true }).eq('status', 'active');
      const { count: teachersCount } = await supabase
        .from('teachers').select('*', { count: 'exact', head: true }).eq('status', 'active');
      const { count: classesCount } = await supabase
        .from('classes').select('*', { count: 'exact', head: true }).eq('is_active', true);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: recentEnrollmentsCount } = await supabase
        .from('students').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString());

      const today = new Date().toISOString().split('T')[0];
      const { count: activeExamsCount } = await supabase
        .from('examinations').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('end_date', today);

      setStats({
        totalStudents: studentsCount || 0,
        totalTeachers: teachersCount || 0,
        totalClasses: classesCount || 0,
        attendanceRate: 94,
        recentEnrollments: recentEnrollmentsCount || 0,
        pendingApprovals: 0,
        activeExams: activeExamsCount || 0,
        totalRevenue: 0,
      });

      const activities = await getRecentActivities();
      const formatted = activities.map(a => ({
        id: a.id,
        type: (a.action.includes('create') ? 'success' : a.action.includes('delete') ? 'error' : 'info') as RecentActivity['type'],
        message: `${a.action} in ${a.module}`,
        time: formatTime(a.created_at),
        module: a.module,
      }));
      setRecentActivities(formatted);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string): string => {
    const diffMin = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  useEffect(() => { if (user) fetchDashboardStats(); }, [user]);

  return { stats, recentActivities, loading, refetch: fetchDashboardStats };
};
