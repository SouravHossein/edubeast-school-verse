
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  user_id: string;
  class_id: string;
  student_id: string;
  admission_number: string;
  roll_number?: string;
  admission_date: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  emergency_contact?: string;
  medical_info?: string;
  transport_info?: Record<string, any>;
  fee_concession: number;
  status: 'active' | 'inactive' | 'transferred';
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
  profiles: {
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
  classes?: {
    name: string;
    code: string;
  };
}

export interface CreateStudentData {
  user_id: string;
  class_id: string;
  student_id: string;
  admission_number: string;
  roll_number?: string;
  admission_date: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  emergency_contact?: string;
  medical_info?: string;
  transport_info?: Record<string, any>;
  fee_concession?: number;
  status?: 'active' | 'inactive' | 'transferred';
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(full_name, email, phone, avatar_url),
          classes(name, code)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the expected interface
      const transformedData = data?.map(item => ({
        ...item,
        profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) as Student[];

      setStudents(transformedData || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: CreateStudentData): Promise<Student | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select(`
          *,
          profiles!inner(full_name, email, phone, avatar_url),
          classes(name, code)
        `)
        .single();

      if (error) throw error;

      const transformedData = {
        ...data,
        profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
      } as Student;

      setStudents(prev => [transformedData, ...prev]);
      
      toast({
        title: "Success",
        description: "Student created successfully.",
      });

      return transformedData;
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: "Failed to create student. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStudent = async (id: string, updates: Partial<CreateStudentData>): Promise<Student | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles!inner(full_name, email, phone, avatar_url),
          classes(name, code)
        `)
        .single();

      if (error) throw error;

      const transformedData = {
        ...data,
        profiles: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
      } as Student;

      setStudents(prev => prev.map(student => 
        student.id === id ? transformedData : student
      ));

      toast({
        title: "Success",
        description: "Student updated successfully.",
      });

      return transformedData;
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteStudent = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      
      toast({
        title: "Success",
        description: "Student deleted successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
  };
};
