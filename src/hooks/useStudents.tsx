
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/useTenant';

export interface Student {
  id: string;
  student_id: string;
  admission_number: string;
  roll_number?: string;
  user_id: string;
  class_id: string;
  admission_date: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  emergency_contact?: string;
  medical_info?: string;
  transport_info?: any;
  fee_concession?: number;
  status: 'active' | 'inactive' | 'transferred';
  tenant_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: {
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
  classes?: {
    name: string;
    section?: string;
    grade_level: number;
  };
}

interface StudentInsertData {
  student_id: string;
  admission_number: string;
  roll_number?: string;
  user_id: string;
  class_id: string;
  admission_date: string;
  parent_name?: string;
  parent_phone?: string;
  parent_email?: string;
  emergency_contact?: string;
  medical_info?: string;
  transport_info?: any;
  fee_concession?: number;
  status?: 'active' | 'inactive' | 'transferred';
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { tenant } = useTenant();

  const fetchStudents = async () => {
    if (!tenant?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(full_name, email, phone, avatar_url),
          classes(name, section, grade_level)
        `)
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedStudents = (data || []).map(student => ({
        ...student,
        status: student.status as 'active' | 'inactive' | 'transferred'
      })) as Student[];
      
      setStudents(typedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: StudentInsertData) => {
    if (!tenant?.id) return null;

    try {
      const insertData = {
        ...studentData,
        tenant_id: tenant.id,
        status: studentData.status || 'active' as const
      };

      const { data, error } = await supabase
        .from('students')
        .insert(insertData)
        .select(`
          *,
          profiles!inner(full_name, email, phone, avatar_url),
          classes(name, section, grade_level)
        `)
        .single();

      if (error) throw error;

      const typedStudent = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'transferred'
      } as Student;

      setStudents(prev => [typedStudent, ...prev]);
      toast({
        title: "Success",
        description: "Student created successfully",
      });
      return typedStudent;
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: "Failed to create student",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStudent = async (id: string, updates: Partial<StudentInsertData>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles!inner(full_name, email, phone, avatar_url),
          classes(name, section, grade_level)
        `)
        .single();

      if (error) throw error;

      const typedStudent = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'transferred'
      } as Student;

      setStudents(prev => 
        prev.map(student => student.id === id ? typedStudent : student)
      );
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      return typedStudent;
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [tenant?.id]);

  return {
    students,
    loading,
    createStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents
  };
};
