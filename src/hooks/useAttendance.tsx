
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/useTenant';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  check_in_time?: string;
  check_out_time?: string;
  remarks?: string;
  marked_by: string;
  tenant_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  students?: {
    student_id: string;
    roll_number?: string;
    profiles?: {
      full_name: string;
    };
  };
  classes?: {
    name: string;
    section?: string;
  };
}

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { tenant } = useTenant();

  const fetchAttendance = async (date?: string, classId?: string) => {
    if (!tenant?.id) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('attendance')
        .select(`
          *,
          students!inner(
            student_id,
            roll_number,
            profiles!inner(full_name)
          ),
          classes(name, section)
        `)
        .eq('tenant_id', tenant.id);

      if (date) {
        query = query.eq('date', date);
      }
      if (classId) {
        query = query.eq('class_id', classId);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (attendanceData: {
    student_id: string;
    class_id: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    check_in_time?: string;
    remarks?: string;
  }) => {
    if (!tenant?.id) return null;

    try {
      const { data, error } = await supabase
        .from('attendance')
        .upsert({
          ...attendanceData,
          tenant_id: tenant.id,
          marked_by: (await supabase.auth.getUser()).data.user?.id
        }, {
          onConflict: 'student_id,date',
          ignoreDuplicates: false
        })
        .select(`
          *,
          students!inner(
            student_id,
            roll_number,
            profiles!inner(full_name)
          ),
          classes(name, section)
        `)
        .single();

      if (error) throw error;

      setAttendance(prev => {
        const existing = prev.findIndex(a => 
          a.student_id === data.student_id && a.date === data.date
        );
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = data;
          return updated;
        }
        return [data, ...prev];
      });

      return data;
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
      return null;
    }
  };

  const bulkMarkAttendance = async (records: Array<{
    student_id: string;
    class_id: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    check_in_time?: string;
    remarks?: string;
  }>) => {
    if (!tenant?.id) return false;

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      const attendanceRecords = records.map(record => ({
        ...record,
        tenant_id: tenant.id,
        marked_by: userId
      }));

      const { error } = await supabase
        .from('attendance')
        .upsert(attendanceRecords, {
          onConflict: 'student_id,date',
          ignoreDuplicates: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Attendance marked for ${records.length} students`,
      });
      
      // Refresh data
      await fetchAttendance();
      return true;
    } catch (error) {
      console.error('Error bulk marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance for some students",
        variant: "destructive",
      });
      return false;
    }
  };

  const getAttendanceStats = async (startDate: string, endDate: string, classId?: string) => {
    if (!tenant?.id) return null;

    try {
      let query = supabase
        .from('attendance')
        .select('status, student_id')
        .eq('tenant_id', tenant.id)
        .gte('date', startDate)
        .lte('date', endDate);

      if (classId) {
        query = query.eq('class_id', classId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const stats = data?.reduce((acc, record) => {
        acc[record.status] = (acc[record.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        present: stats.present || 0,
        absent: stats.absent || 0,
        late: stats.late || 0,
        total: data?.length || 0
      };
    } catch (error) {
      console.error('Error getting attendance stats:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [tenant?.id]);

  return {
    attendance,
    loading,
    markAttendance,
    bulkMarkAttendance,
    getAttendanceStats,
    refetch: fetchAttendance
  };
};
