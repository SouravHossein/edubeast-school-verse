
import React, { useState } from 'react';
import { useStudents } from '@/hooks/useStudents';
import { StudentListView } from '@/components/students/StudentListView';
import { StudentForm } from '@/components/students/StudentForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Class {
  id: string;
  name: string;
  section?: string;
  grade_level: number;
}

const StudentManagement = () => {
  const { students, loading, createStudent, updateStudent, deleteStudent } = useStudents();
  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, section, grade_level')
        .eq('is_active', true)
        .order('grade_level', { ascending: true });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Error",
        description: "Failed to load classes",
        variant: "destructive",
      });
    } finally {
      setClassesLoading(false);
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, data);
      } else {
        await createStudent(data);
      }
      setShowForm(false);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage student information and records</p>
        </div>
      </div>

      <StudentListView
        students={students}
        loading={loading}
        onAddStudent={handleAddStudent}
        onEditStudent={handleEditStudent}
        onDeleteStudent={handleDeleteStudent}
        classes={classes}
      />

      <StudentForm
        student={editingStudent}
        classes={classes}
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />
    </div>
  );
};

export default StudentManagement;
