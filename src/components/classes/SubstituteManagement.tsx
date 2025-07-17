import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserCheck, Plus, Edit, Trash2, CalendarIcon, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SubstituteAssignment {
  id: string;
  date: string;
  period: number;
  originalTeacher: string;
  substituteTeacher: string;
  subject: string;
  class: string;
  section: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  availability: boolean;
}

export const SubstituteManagement: React.FC = () => {
  const [assignments, setAssignments] = useState<SubstituteAssignment[]>([
    {
      id: '1',
      date: '2024-01-16',
      period: 3,
      originalTeacher: 'Mrs. Smith',
      substituteTeacher: 'Mr. Johnson',
      subject: 'Mathematics',
      class: 'Class X',
      section: 'A',
      reason: 'Sick leave',
      status: 'scheduled'
    },
    {
      id: '2',
      date: '2024-01-15',
      period: 5,
      originalTeacher: 'Dr. Davis',
      substituteTeacher: 'Ms. Wilson',
      subject: 'Chemistry',
      class: 'Class XI',
      section: 'B',
      reason: 'Conference attendance',
      status: 'completed'
    }
  ]);

  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'Mrs. Smith', subjects: ['Mathematics', 'Physics'], availability: false },
    { id: '2', name: 'Mr. Johnson', subjects: ['Physics', 'Mathematics'], availability: true },
    { id: '3', name: 'Dr. Davis', subjects: ['Chemistry', 'Biology'], availability: false },
    { id: '4', name: 'Ms. Wilson', subjects: ['Chemistry', 'Mathematics'], availability: true },
    { id: '5', name: 'Mr. Brown', subjects: ['English', 'History'], availability: true },
    { id: '6', name: 'Mrs. Taylor', subjects: ['Biology', 'Geography'], availability: true }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<SubstituteAssignment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    period: '',
    originalTeacher: '',
    substituteTeacher: '',
    subject: '',
    class: '',
    section: '',
    reason: '',
    notes: ''
  });

  const { toast } = useToast();

  const classes = ['Class IX', 'Class X', 'Class XI', 'Class XII'];
  const sections = ['A', 'B', 'C', 'D'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);
  const reasons = ['Sick leave', 'Personal leave', 'Conference attendance', 'Training', 'Emergency', 'Other'];

  const availableTeachers = teachers.filter(t => t.availability);
  const unavailableTeachers = teachers.filter(t => !t.availability);

  const getQualifiedSubstitutes = (subject: string) => {
    return availableTeachers.filter(teacher => 
      teacher.subjects.includes(subject) || teacher.subjects.includes('General')
    );
  };

  const handleCreateAssignment = () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date for the substitute assignment.",
        variant: "destructive"
      });
      return;
    }

    const newAssignment: SubstituteAssignment = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split('T')[0],
      period: Number(formData.period),
      originalTeacher: formData.originalTeacher,
      substituteTeacher: formData.substituteTeacher,
      subject: formData.subject,
      class: formData.class,
      section: formData.section,
      reason: formData.reason,
      status: 'scheduled',
      notes: formData.notes
    };

    if (editingAssignment) {
      setAssignments(assignments.map(a => 
        a.id === editingAssignment.id ? { ...newAssignment, id: editingAssignment.id } : a
      ));
      toast({
        title: "Assignment Updated",
        description: "Substitute assignment has been updated successfully.",
      });
    } else {
      setAssignments([...assignments, newAssignment]);
      toast({
        title: "Assignment Created",
        description: "Substitute assignment has been created successfully.",
      });
    }

    setIsDialogOpen(false);
    setEditingAssignment(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      period: '', originalTeacher: '', substituteTeacher: '',
      subject: '', class: '', section: '', reason: '', notes: ''
    });
    setSelectedDate(undefined);
  };

  const handleEditAssignment = (assignment: SubstituteAssignment) => {
    setEditingAssignment(assignment);
    setFormData({
      period: assignment.period.toString(),
      originalTeacher: assignment.originalTeacher,
      substituteTeacher: assignment.substituteTeacher,
      subject: assignment.subject,
      class: assignment.class,
      section: assignment.section,
      reason: assignment.reason,
      notes: assignment.notes || ''
    });
    setSelectedDate(new Date(assignment.date));
    setIsDialogOpen(true);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast({
      title: "Assignment Deleted",
      description: "Substitute assignment has been deleted successfully.",
    });
  };

  const handleStatusChange = (id: string, status: SubstituteAssignment['status']) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, status } : a
    ));
    toast({
      title: "Status Updated",
      description: `Assignment status changed to ${status}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="default">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const upcomingAssignments = assignments.filter(a => 
    new Date(a.date) >= new Date() && a.status === 'scheduled'
  );

  const todayAssignments = assignments.filter(a => 
    a.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Substitute Management
              </CardTitle>
              <CardDescription>
                Manage substitute teacher assignments and scheduling
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Substitute
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingAssignment ? 'Edit Substitute Assignment' : 'Schedule Substitute Teacher'}
                  </DialogTitle>
                  <DialogDescription>
                    Assign a substitute teacher for a specific class period
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                            onSelect={setSelectedDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Period</Label>
                      <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          {periods.map(period => (
                            <SelectItem key={period} value={period.toString()}>
                              Period {period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
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

                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
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
                  </div>

                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Original Teacher</Label>
                    <Select value={formData.originalTeacher} onValueChange={(value) => setFormData({ ...formData, originalTeacher: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select original teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map(teacher => (
                          <SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Substitute Teacher</Label>
                    <Select value={formData.substituteTeacher} onValueChange={(value) => setFormData({ ...formData, substituteTeacher: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select substitute teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.subject ? (
                          getQualifiedSubstitutes(formData.subject).map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.name}>
                              {teacher.name} (Qualified)
                            </SelectItem>
                          ))
                        ) : (
                          availableTeachers.map(teacher => (
                            <SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Reason for Substitution</Label>
                    <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasons.map(reason => (
                          <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any special instructions for the substitute teacher..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAssignment}>
                    {editingAssignment ? 'Update Assignment' : 'Schedule Substitute'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today's Substitutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAssignments.length}</div>
            <p className="text-sm text-muted-foreground">
              Active assignments today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
            <p className="text-sm text-muted-foreground">
              Scheduled assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Available Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTeachers.length}</div>
            <p className="text-sm text-muted-foreground">
              Ready for substitution
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Assignments */}
      {todayAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Today's Substitute Assignments
            </CardTitle>
            <CardDescription>
              Active substitute assignments for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      Period {assignment.period} - {assignment.subject}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.class} Section {assignment.section} • {assignment.substituteTeacher} for {assignment.originalTeacher}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(assignment.status)}
                    <Select
                      value={assignment.status}
                      onValueChange={(value: any) => handleStatusChange(assignment.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>All Substitute Assignments</CardTitle>
          <CardDescription>
            Complete history of substitute teacher assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Period</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teachers</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{format(new Date(assignment.date), 'MMM dd, yyyy')}</div>
                        <div className="text-sm text-muted-foreground">Period {assignment.period}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {assignment.class} - {assignment.section}
                  </TableCell>
                  <TableCell>{assignment.subject}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Sub: <span className="font-medium">{assignment.substituteTeacher}</span></div>
                      <div className="text-muted-foreground">for {assignment.originalTeacher}</div>
                    </div>
                  </TableCell>
                  <TableCell>{assignment.reason}</TableCell>
                  <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditAssignment(assignment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Teacher Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Availability</CardTitle>
          <CardDescription>
            Current availability status of all teachers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-3">Available ({availableTeachers.length})</h4>
              <div className="space-y-2">
                {availableTeachers.map(teacher => (
                  <div key={teacher.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {teacher.subjects.join(', ')}
                      </div>
                    </div>
                    <Badge variant="default">Available</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-red-600 mb-3">Unavailable ({unavailableTeachers.length})</h4>
              <div className="space-y-2">
                {unavailableTeachers.map(teacher => (
                  <div key={teacher.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {teacher.subjects.join(', ')}
                      </div>
                    </div>
                    <Badge variant="destructive">Unavailable</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};