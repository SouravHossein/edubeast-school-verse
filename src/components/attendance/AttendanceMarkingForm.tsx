
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, UserCheck, UserX, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Student } from '@/hooks/useStudents';

interface AttendanceData {
  student_id: string;
  status: 'present' | 'absent' | 'late';
  check_in_time?: string;
  remarks?: string;
}

interface AttendanceMarkingFormProps {
  students: Student[];
  classes: Array<{ id: string; name: string; section?: string }>;
  onSave: (date: string, classId: string, attendance: AttendanceData[]) => Promise<void>;
  loading?: boolean;
}

export const AttendanceMarkingForm: React.FC<AttendanceMarkingFormProps> = ({
  students,
  classes,
  onSave,
  loading = false
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendance, setAttendance] = useState<Record<string, AttendanceData>>({});

  const filteredStudents = students.filter(student => {
    const matchesClass = !selectedClass || student.class_id === selectedClass;
    const matchesSearch = 
      student.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesClass && matchesSearch;
  });

  const updateAttendance = (studentId: string, field: keyof AttendanceData, value: any) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        student_id: studentId,
        [field]: value,
        // Reset late status if marking absent
        ...(field === 'status' && value === 'absent' ? { check_in_time: undefined } : {})
      }
    }));
  };

  const markAllAs = (status: 'present' | 'absent') => {
    const newAttendance: Record<string, AttendanceData> = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = {
        student_id: student.id,
        status,
        ...(status === 'present' ? { check_in_time: '09:00' } : {})
      };
    });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    const attendanceArray = Object.values(attendance).filter(record => 
      filteredStudents.some(student => student.id === record.student_id)
    );

    if (attendanceArray.length === 0) {
      alert('Please mark attendance for at least one student');
      return;
    }

    await onSave(
      format(selectedDate, 'yyyy-MM-dd'),
      selectedClass,
      attendanceArray
    );
  };

  const getStatusCounts = () => {
    const counts = { present: 0, absent: 0, late: 0, total: filteredStudents.length };
    Object.values(attendance).forEach(record => {
      if (filteredStudents.some(student => student.id === record.student_id)) {
        counts[record.status]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Date and Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mark Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} {cls.section && `- ${cls.section}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quick Actions</Label>
              <div className="flex gap-2">
                <Button onClick={() => markAllAs('present')} variant="outline" size="sm">
                  <UserCheck className="h-4 w-4 mr-1" />
                  All Present
                </Button>
                <Button onClick={() => markAllAs('absent')} variant="outline" size="sm">
                  <UserX className="h-4 w-4 mr-1" />
                  All Absent
                </Button>
              </div>
            </div>
          </div>

          {selectedClass && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-4">
                <Badge variant="default">Present: {statusCounts.present}</Badge>
                <Badge variant="destructive">Absent: {statusCounts.absent}</Badge>
                <Badge variant="secondary">Late: {statusCounts.late}</Badge>
                <Badge variant="outline">Total: {statusCounts.total}</Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Student List */}
      {selectedClass && filteredStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map(student => {
                const studentAttendance = attendance[student.id] || { 
                  student_id: student.id, 
                  status: 'present' as const 
                };

                return (
                  <div key={student.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{student.profiles?.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {student.student_id} | Roll: {student.roll_number || 'N/A'}
                      </div>
                    </div>

                    {/* Status Selection */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`present-${student.id}`}
                          checked={studentAttendance.status === 'present'}
                          onCheckedChange={(checked) => 
                            checked && updateAttendance(student.id, 'status', 'present')
                          }
                        />
                        <Label htmlFor={`present-${student.id}`} className="text-sm">Present</Label>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`late-${student.id}`}
                          checked={studentAttendance.status === 'late'}
                          onCheckedChange={(checked) => 
                            checked && updateAttendance(student.id, 'status', 'late')
                          }
                        />
                        <Label htmlFor={`late-${student.id}`} className="text-sm">Late</Label>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id={`absent-${student.id}`}
                          checked={studentAttendance.status === 'absent'}
                          onCheckedChange={(checked) => 
                            checked && updateAttendance(student.id, 'status', 'absent')
                          }
                        />
                        <Label htmlFor={`absent-${student.id}`} className="text-sm">Absent</Label>
                      </div>
                    </div>

                    {/* Check-in Time */}
                    {(studentAttendance.status === 'present' || studentAttendance.status === 'late') && (
                      <div className="w-24">
                        <Input
                          type="time"
                          value={studentAttendance.check_in_time || '09:00'}
                          onChange={(e) => updateAttendance(student.id, 'check_in_time', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {/* Remarks */}
                    <div className="w-48">
                      <Textarea
                        placeholder="Remarks (optional)"
                        value={studentAttendance.remarks || ''}
                        onChange={(e) => updateAttendance(student.id, 'remarks', e.target.value)}
                        className="h-8 resize-none text-sm"
                      />
                    </div>

                    {/* Status Badge */}
                    <Badge 
                      variant={
                        studentAttendance.status === 'present' ? 'default' : 
                        studentAttendance.status === 'late' ? 'secondary' : 'destructive'
                      }
                    >
                      {studentAttendance.status}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
