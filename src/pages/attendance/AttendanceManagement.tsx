
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceMarkingForm } from '@/components/attendance/AttendanceMarkingForm';
import { AttendanceReports } from '@/components/attendance/AttendanceReports';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Class {
  id: string;
  name: string;
  section?: string;
  grade_level: number;
}

const AttendanceManagement = () => {
  const { students } = useStudents();
  const { bulkMarkAttendance } = useAttendance();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
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
    }
  };

  const handleSaveAttendance = async (date: string, classId: string, attendanceData: any[]) => {
    setLoading(true);
    try {
      const records = attendanceData.map(record => ({
        student_id: record.student_id,
        class_id: classId,
        date,
        status: record.status,
        check_in_time: record.check_in_time,
        remarks: record.remarks
      }));

      await bulkMarkAttendance(records);
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage student attendance</p>
        </div>
      </div>

      <Tabs defaultValue="marking" className="space-y-6">
        <TabsList>
          <TabsTrigger value="marking">Mark Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="marking">
          <AttendanceMarkingForm
            students={students}
            classes={classes}
            onSave={handleSaveAttendance}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="reports">
          <AttendanceReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceManagement;
