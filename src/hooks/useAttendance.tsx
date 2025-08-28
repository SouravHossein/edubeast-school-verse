
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  created_at?: string;
  updated_at?: string;
  students: {
    student_id: string;
    profiles: {
      full_name: string;
    };
  };
  classes: {
    name: string;
    code: string;
  };
}

export interface CreateAttendanceData {
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  check_in_time?: string;
  check_out_time?: string;
  remarks?: string;
  marked_by: string;
}

export const useAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAttendance = async (classId?: string, date?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('attendance')
        .select(`
          *,
          students!inner(
            student_id,
            profiles!inner(full_name)
          ),
          classes!inner(name, code)
        `)
        .order('date', { ascending: false });

      if (classId) {
        query = query.eq('class_id', classId);
      }

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to match the expected interface
      const transformedData = data?.map(item => ({
        ...item,
        students: Array.isArray(item.students) ? item.students[0] : item.students,
        classes: Array.isArray(item.classes) ? item.classes[0] : item.classes
      })) as AttendanceRecord[];

      setAttendanceRecords(transformedData || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Error",
        description: "Failed to fetch attendance records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (attendanceData: CreateAttendanceData): Promise<AttendanceRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert([attendanceData])
        .select(`
          *,
          students!inner(
            student_id,
            profiles!inner(full_name)
          ),
          classes!inner(name, code)
        `)
        .single();

      if (error) throw error;

      const transformedData = {
        ...data,
        students: Array.isArray(data.students) ? data.students[0] : data.students,
        classes: Array.isArray(data.classes) ? data.classes[0] : data.classes
      } as AttendanceRecord;

      setAttendanceRecords(prev => [transformedData, ...prev]);
      
      toast({
        title: "Success",
        description: "Attendance marked successfully.",
      });

      return transformedData;
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAttendance = async (id: string, updates: Partial<CreateAttendanceData>): Promise<AttendanceRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          students!inner(
            student_id,
            profiles!inner(full_name)
          ),
          classes!inner(name, code)
        `)
        .single();

      if (error) throw error;

      const transformedData = {
        ...data,
        students: Array.isArray(data.students) ? data.students[0] : data.students,
        classes: Array.isArray(data.classes) ? data.classes[0] : data.classes
      } as AttendanceRecord;

      setAttendanceRecords(prev => prev.map(record => 
        record.id === id ? transformedData : record
      ));

      toast({
        title: "Success",
        description: "Attendance updated successfully.",
      });

      return transformedData;
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAttendance = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAttendanceRecords(prev => prev.filter(record => record.id !== id));
      
      toast({
        title: "Success",
        description: "Attendance record deleted successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast({
        title: "Error",
        description: "Failed to delete attendance record. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return {
    attendanceRecords,
    loading,
    markAttendance,
    updateAttendance,
    deleteAttendance,
    refetch: fetchAttendance,
  };
};
