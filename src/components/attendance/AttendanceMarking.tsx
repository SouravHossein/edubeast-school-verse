import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Clock, Search, UserCheck, UserX, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  present?: boolean;
  late?: boolean;
  remarks?: string;
}

export const AttendanceMarking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Mock data - replace with actual API
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'John Doe', rollNumber: 'R001', class: 'Class X', section: 'A', present: true },
    { id: '2', name: 'Jane Smith', rollNumber: 'R002', class: 'Class X', section: 'A', present: false },
    { id: '3', name: 'Bob Johnson', rollNumber: 'R003', class: 'Class X', section: 'A', present: true, late: true },
    { id: '4', name: 'Alice Brown', rollNumber: 'R004', class: 'Class X', section: 'A', present: true },
  ]);

  const classes = ['Class IX', 'Class X', 'Class XI', 'Class XII'];
  const sections = ['A', 'B', 'C', 'D'];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAttendanceChange = (studentId: string, field: 'present' | 'late', value: boolean) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, [field]: value, ...(field === 'present' && !value ? { late: false } : {}) }
        : student
    ));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, remarks } : student
    ));
  };

  const handleMarkAll = (present: boolean) => {
    setStudents(prev => prev.map(student => ({ ...student, present, late: false })));
  };

  const handleSaveAttendance = () => {
    // Here you would save to your backend
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${format(selectedDate, 'PPP')} has been saved successfully.`,
    });
  };

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.filter(s => !s.present).length;
  const lateCount = students.filter(s => s.late).length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mark Attendance
          </CardTitle>
          <CardDescription>
            Select date, class, and section to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Picker */}
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
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Class Select */}
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section Select */}
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label>Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button onClick={() => handleMarkAll(true)} variant="outline" size="sm">
              <UserCheck className="h-4 w-4 mr-2" />
              Mark All Present
            </Button>
            <Button onClick={() => handleMarkAll(false)} variant="outline" size="sm">
              <UserX className="h-4 w-4 mr-2" />
              Mark All Absent
            </Button>
          </div>

          {/* Summary */}
          <div className="flex gap-4">
            <Badge variant="default">Present: {presentCount}</Badge>
            <Badge variant="destructive">Absent: {absentCount}</Badge>
            <Badge variant="secondary">Late: {lateCount}</Badge>
            <Badge variant="outline">Total: {students.length}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>
            Mark attendance for each student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map(student => (
              <div key={student.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Roll: {student.rollNumber} | {student.class} - {student.section}
                  </div>
                </div>

                {/* Present Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`present-${student.id}`}
                    checked={student.present || false}
                    onCheckedChange={(checked) => 
                      handleAttendanceChange(student.id, 'present', checked as boolean)
                    }
                  />
                  <Label htmlFor={`present-${student.id}`} className="text-sm">Present</Label>
                </div>

                {/* Late Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`late-${student.id}`}
                    checked={student.late || false}
                    disabled={!student.present}
                    onCheckedChange={(checked) => 
                      handleAttendanceChange(student.id, 'late', checked as boolean)
                    }
                  />
                  <Label htmlFor={`late-${student.id}`} className="text-sm">Late</Label>
                </div>

                {/* Remarks */}
                <div className="w-48">
                  <Textarea
                    placeholder="Remarks (optional)"
                    value={student.remarks || ''}
                    onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                    className="h-8 resize-none"
                  />
                </div>

                {/* Status Badge */}
                <Badge variant={student.present ? 'default' : 'destructive'}>
                  {student.present ? (student.late ? 'Late' : 'Present') : 'Absent'}
                </Badge>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveAttendance} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Attendance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};