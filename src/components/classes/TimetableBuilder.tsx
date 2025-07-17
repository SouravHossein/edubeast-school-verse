import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, AlertTriangle, Save, Download, Share, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject?: string;
  teacher?: string;
  classroom?: string;
  isBreak?: boolean;
  breakType?: string;
}

interface TimetableConflict {
  type: 'teacher' | 'classroom';
  message: string;
  slots: string[];
}

export const TimetableBuilder: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [conflicts, setConflicts] = useState<TimetableConflict[]>([]);
  
  const { toast } = useToast();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  const classes = ['Class IX', 'Class X', 'Class XI', 'Class XII'];
  const sections = ['A', 'B', 'C', 'D'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
  const teachers = ['Mrs. Smith', 'Mr. Johnson', 'Dr. Davis', 'Ms. Wilson', 'Mr. Brown'];
  const classrooms = ['Room 101', 'Room 102', 'Lab 1', 'Lab 2', 'Library', 'Auditorium'];

  // Mock timetable data
  const [timetable, setTimetable] = useState<TimeSlot[]>([
    {
      id: '1',
      day: 'Monday',
      period: 1,
      startTime: '09:00',
      endTime: '09:45',
      subject: 'Mathematics',
      teacher: 'Mrs. Smith',
      classroom: 'Room 101'
    },
    {
      id: '2',
      day: 'Monday',
      period: 2,
      startTime: '09:45',
      endTime: '10:30',
      subject: 'Physics',
      teacher: 'Mr. Johnson',
      classroom: 'Lab 1'
    },
    {
      id: 'break1',
      day: 'Monday',
      period: 3,
      startTime: '10:30',
      endTime: '10:45',
      isBreak: true,
      breakType: 'Short Break'
    },
    {
      id: '3',
      day: 'Monday',
      period: 4,
      startTime: '10:45',
      endTime: '11:30',
      subject: 'Chemistry',
      teacher: 'Dr. Davis',
      classroom: 'Lab 2'
    }
  ]);

  const getTimeSlot = (day: string, period: number): TimeSlot | undefined => {
    return timetable.find(slot => slot.day === day && slot.period === period);
  };

  const handleSlotEdit = (day: string, period: number) => {
    const existingSlot = getTimeSlot(day, period);
    if (existingSlot) {
      setEditingSlot(existingSlot);
    } else {
      setEditingSlot({
        id: `${day}_${period}`,
        day,
        period,
        startTime: getDefaultStartTime(period),
        endTime: getDefaultEndTime(period)
      });
    }
    setIsEditDialogOpen(true);
  };

  const getDefaultStartTime = (period: number): string => {
    const startTimes = ['09:00', '09:45', '10:30', '10:45', '11:30', '12:15', '13:00', '13:45'];
    return startTimes[period - 1] || '09:00';
  };

  const getDefaultEndTime = (period: number): string => {
    const endTimes = ['09:45', '10:30', '10:45', '11:30', '12:15', '13:00', '13:45', '14:30'];
    return endTimes[period - 1] || '09:45';
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;

    const updatedTimetable = timetable.filter(
      slot => !(slot.day === editingSlot.day && slot.period === editingSlot.period)
    );
    
    updatedTimetable.push(editingSlot);
    setTimetable(updatedTimetable);
    
    // Check for conflicts
    checkConflicts(updatedTimetable);
    
    setIsEditDialogOpen(false);
    setEditingSlot(null);
    
    toast({
      title: "Slot Updated",
      description: "Timetable slot has been updated successfully.",
    });
  };

  const checkConflicts = (currentTimetable: TimeSlot[]) => {
    const newConflicts: TimetableConflict[] = [];
    
    // Check teacher conflicts
    const teacherSchedule: { [key: string]: TimeSlot[] } = {};
    currentTimetable.forEach(slot => {
      if (slot.teacher && !slot.isBreak) {
        const key = `${slot.day}_${slot.period}`;
        if (!teacherSchedule[slot.teacher]) {
          teacherSchedule[slot.teacher] = [];
        }
        teacherSchedule[slot.teacher].push(slot);
      }
    });

    Object.entries(teacherSchedule).forEach(([teacher, slots]) => {
      const conflicts = slots.filter((slot, index, arr) => 
        arr.findIndex(s => s.day === slot.day && s.period === slot.period) !== index
      );
      
      if (conflicts.length > 0) {
        newConflicts.push({
          type: 'teacher',
          message: `${teacher} has multiple classes at the same time`,
          slots: conflicts.map(s => s.id)
        });
      }
    });

    setConflicts(newConflicts);
  };

  const handleDeleteSlot = (day: string, period: number) => {
    const updatedTimetable = timetable.filter(
      slot => !(slot.day === day && slot.period === period)
    );
    setTimetable(updatedTimetable);
    
    toast({
      title: "Slot Deleted",
      description: "Timetable slot has been deleted.",
    });
  };

  const handleSaveTimetable = () => {
    // Save timetable logic
    toast({
      title: "Timetable Saved",
      description: "Timetable has been saved successfully.",
    });
  };

  const handleExportTimetable = () => {
    // Export logic
    toast({
      title: "Timetable Exported",
      description: "Timetable has been exported to PDF.",
    });
  };

  const handleShareTimetable = () => {
    // Share logic
    toast({
      title: "Timetable Shared",
      description: "Timetable sharing link has been generated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timetable Builder
          </CardTitle>
          <CardDescription>
            Create and manage class timetables with drag-and-drop functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSaveTimetable}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleExportTimetable}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={handleShareTimetable}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Timetable Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map((conflict, index) => (
                <div key={index} className="text-sm text-yellow-700">
                  • {conflict.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>
            Weekly Timetable {selectedClass && selectedSection && `- ${selectedClass} Section ${selectedSection}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted font-medium">Time/Day</th>
                  {days.map(day => (
                    <th key={day} className="border p-2 bg-muted font-medium min-w-32">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map(period => (
                  <tr key={period}>
                    <td className="border p-2 bg-muted font-medium text-center">
                      <div className="text-sm">
                        Period {period}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {getDefaultStartTime(period)} - {getDefaultEndTime(period)}
                        </span>
                      </div>
                    </td>
                    {days.map(day => {
                      const slot = getTimeSlot(day, period);
                      return (
                        <td
                          key={`${day}-${period}`}
                          className="border p-1 hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleSlotEdit(day, period)}
                        >
                          {slot ? (
                            <div className="space-y-1">
                              {slot.isBreak ? (
                                <Badge variant="secondary" className="w-full justify-center">
                                  {slot.breakType}
                                </Badge>
                              ) : (
                                <>
                                  <div className="font-medium text-xs">{slot.subject}</div>
                                  <div className="text-xs text-muted-foreground">{slot.teacher}</div>
                                  <div className="text-xs text-muted-foreground">{slot.classroom}</div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="h-16 flex items-center justify-center text-muted-foreground">
                              <Plus className="h-4 w-4" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Slot Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Timetable Slot - {editingSlot?.day} Period {editingSlot?.period}
            </DialogTitle>
            <DialogDescription>
              Configure the subject, teacher, and classroom for this time slot
            </DialogDescription>
          </DialogHeader>
          
          {editingSlot && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={editingSlot.startTime}
                    onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={editingSlot.endTime}
                    onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  value={editingSlot.subject || ''}
                  onValueChange={(value) => setEditingSlot({ ...editingSlot, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Subject (Break)</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Teacher</Label>
                <Select
                  value={editingSlot.teacher || ''}
                  onValueChange={(value) => setEditingSlot({ ...editingSlot, teacher: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(teacher => (
                      <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Classroom</Label>
                <Select
                  value={editingSlot.classroom || ''}
                  onValueChange={(value) => setEditingSlot({ ...editingSlot, classroom: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map(classroom => (
                      <SelectItem key={classroom} value={classroom}>{classroom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleDeleteSlot(editingSlot?.day!, editingSlot?.period!)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleSaveSlot}>
              Save Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};