import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const db = supabase as any;

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
  students?: { id: string; student_id: string; profiles?: { full_name: string; avatar_url?: string } };
  classes?: { id: string; name: string; code: string };
}

export interface CreateAttendanceData {
  student_id: string; class_id: string; date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  check_in_time?: string; check_out_time?: string; remarks?: string;
}

export interface BulkAttendanceData {
  class_id: string; date: string;
  records: { student_id: string; status: 'present' | 'absent' | 'late' | 'excused'; check_in_time?: string; remarks?: string }[];
}

export const useAttendance = () => {
  const queryClient = useQueryClient();

  const { data: attendanceRecords = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['attendance'],
    queryFn: async () => {
      const { data, error } = await db
        .from('attendance')
        .select('*, students!inner(id, student_id, profiles!inner(full_name, avatar_url)), classes!inner(id, name, code)')
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map((r: any) => ({
        ...r,
        students: { ...r.students, profiles: Array.isArray(r.students?.profiles) ? r.students.profiles[0] : r.students?.profiles },
      })) as AttendanceRecord[];
    },
  });

  const markAttendanceMutation = useMutation({
    mutationFn: async (attendanceData: CreateAttendanceData) => {
      const { data, error } = await db
        .from('attendance')
        .insert([{ ...attendanceData, marked_by: (await supabase.auth.getUser()).data.user?.id || '' }])
        .select().single();
      if (error) throw error;
      return data as AttendanceRecord;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['attendance'] }); toast.success('Attendance marked'); },
    onError: () => toast.error('Failed to mark attendance'),
  });

  const bulkMarkAttendanceMutation = useMutation({
    mutationFn: async (bulkData: BulkAttendanceData) => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Not authenticated');
      const records = bulkData.records.map(r => ({ ...r, class_id: bulkData.class_id, date: bulkData.date, marked_by: userId }));
      const { data, error } = await db.from('attendance').insert(records).select();
      if (error) throw error;
      return (data || []) as AttendanceRecord[];
    },
    onSuccess: (data: AttendanceRecord[]) => { queryClient.invalidateQueries({ queryKey: ['attendance'] }); toast.success(`Marked for ${data.length} students`); },
    onError: () => toast.error('Failed to mark bulk attendance'),
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AttendanceRecord> }) => {
      const { data, error } = await db.from('attendance').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data as AttendanceRecord;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['attendance'] }); toast.success('Updated'); },
    onError: () => toast.error('Failed to update'),
  });

  const deleteAttendanceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('attendance').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['attendance'] }); toast.success('Deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const refetchAttendance = async (classId?: string, date?: string) => {
    let query = db.from('attendance').select('*, students!inner(id, student_id, profiles!inner(full_name, avatar_url)), classes!inner(id, name, code)').order('date', { ascending: false });
    if (classId) query = query.eq('class_id', classId);
    if (date) query = query.eq('date', date);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((r: any) => ({
      ...r,
      students: { ...r.students, profiles: Array.isArray(r.students?.profiles) ? r.students.profiles[0] : r.students?.profiles },
    })) as AttendanceRecord[];
  };

  return {
    attendanceRecords, loading,
    markAttendance: markAttendanceMutation.mutateAsync,
    bulkMarkAttendance: bulkMarkAttendanceMutation.mutateAsync,
    updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => updateAttendanceMutation.mutateAsync({ id, updates }),
    deleteAttendance: deleteAttendanceMutation.mutateAsync,
    refetch: refetchAttendance,
  };
};
