import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  check_in_time?: string;
  check_out_time?: string;
  marked_by: string;
  remarks?: string;
  tenant_id: string;
  created_at?: string;
  updated_at?: string;
  students?: {
    id: string;
    student_id: string;
    profiles?: {
      full_name: string;
      avatar_url?: string;
    };
  };
  classes?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreateAttendanceData {
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  check_in_time?: string;
  check_out_time?: string;
  remarks?: string;
}

export interface BulkAttendanceData {
  class_id: string;
  date: string;
  records: {
    student_id: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    check_in_time?: string;
    remarks?: string;
  }[];
}

export const useAttendance = () => {
  const queryClient = useQueryClient();
  
  // Fetch attendance records
  const { 
    data: attendanceRecords = [], 
    isLoading: loading,
    refetch
  } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students!inner(
            id,
            student_id,
            profiles!inner(
              full_name,
              avatar_url
            )
          ),
          classes!inner(
            id,
            name,
            code
          )
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching attendance:', error);
        throw error;
      }
      
      return data.map(record => ({
        ...record,
        students: {
          ...record.students,
          profiles: Array.isArray(record.students.profiles) 
            ? record.students.profiles[0] 
            : record.students.profiles
        }
      })) as AttendanceRecord[];
    },
  });

  // Mark single attendance
  const markAttendanceMutation = useMutation({
    mutationFn: async (attendanceData: CreateAttendanceData) => {
      const { data, error } = await supabase
        .from('attendance')
        .insert([{
          ...attendanceData,
          marked_by: (await supabase.auth.getUser()).data.user?.id || '',
        }])
        .select(`
          *,
          students!inner(
            id,
            student_id,
            profiles!inner(
              full_name,
              avatar_url
            )
          ),
          classes!inner(
            id,
            name,
            code
          )
        `)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        students: {
          ...data.students,
          profiles: Array.isArray(data.students.profiles) 
            ? data.students.profiles[0] 
            : data.students.profiles
        }
      } as AttendanceRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance marked successfully');
    },
    onError: (error) => {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    },
  });

  // Bulk mark attendance
  const bulkMarkAttendanceMutation = useMutation({
    mutationFn: async (bulkData: BulkAttendanceData) => {
      const currentUser = await supabase.auth.getUser();
      const userId = currentUser.data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const attendanceRecords = bulkData.records.map(record => ({
        ...record,
        class_id: bulkData.class_id,
        date: bulkData.date,
        marked_by: userId,
      }));

      const { data, error } = await supabase
        .from('attendance')
        .insert(attendanceRecords)
        .select(`
          *,
          students!inner(
            id,
            student_id,
            profiles!inner(
              full_name,
              avatar_url
            )
          ),
          classes!inner(
            id,
            name,
            code
          )
        `);
      
      if (error) throw error;
      return data.map(record => ({
        ...record,
        students: {
          ...record.students,
          profiles: Array.isArray(record.students.profiles) 
            ? record.students.profiles[0] 
            : record.students.profiles
        }
      })) as AttendanceRecord[];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success(`Bulk attendance marked for ${data.length} students`);
    },
    onError: (error) => {
      console.error('Error marking bulk attendance:', error);
      toast.error('Failed to mark bulk attendance');
    },
  });

  // Update attendance
  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AttendanceRecord> }) => {
      const { data, error } = await supabase
        .from('attendance')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          students!inner(
            id,
            student_id,
            profiles!inner(
              full_name,
              avatar_url
            )
          ),
          classes!inner(
            id,
            name,
            code
          )
        `)
        .single();
      
      if (error) throw error;
      return {
        ...data,
        students: {
          ...data.students,
          profiles: Array.isArray(data.students.profiles) 
            ? data.students.profiles[0] 
            : data.students.profiles
        }
      } as AttendanceRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance updated successfully');
    },
    onError: (error) => {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance');
    },
  });

  // Delete attendance
  const deleteAttendanceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting attendance:', error);
      toast.error('Failed to delete attendance');
    },
  });

  // Refetch function with optional filters
  const refetchAttendance = async (classId?: string, date?: string) => {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        students!inner(
          id,
          student_id,
          profiles!inner(
            full_name,
            avatar_url
          )
        ),
        classes!inner(
          id,
          name,
          code
        )
      `)
      .order('date', { ascending: false });

    if (classId) {
      query = query.eq('class_id', classId);
    }
    
    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error refetching attendance:', error);
      throw error;
    }
    
    return data.map(record => ({
      ...record,
      students: {
        ...record.students,
        profiles: Array.isArray(record.students.profiles) 
          ? record.students.profiles[0] 
          : record.students.profiles
      }
    })) as AttendanceRecord[];
  };

  return {
    attendanceRecords,
    loading,
    markAttendance: markAttendanceMutation.mutateAsync,
    bulkMarkAttendance: bulkMarkAttendanceMutation.mutateAsync,
    updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => 
      updateAttendanceMutation.mutateAsync({ id, updates }),
    deleteAttendance: deleteAttendanceMutation.mutateAsync,
    refetch: refetchAttendance,
  };
};
