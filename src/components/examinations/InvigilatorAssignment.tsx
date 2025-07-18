
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users, UserCheck, Clock, MapPin, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface InvigilatorAssignment {
  id: string;
  examId: string;
  examTitle: string;
  date: string;
  time: string;
  hall: string;
  primaryInvigilator: string;
  secondaryInvigilator?: string;
  status: 'assigned' | 'confirmed' | 'completed';
}

interface Teacher {
  id: string;
  name: string;
  department: string;
  available: boolean;
}

export const InvigilatorAssignment = () => {
  const [assignments, setAssignments] = useState<InvigilatorAssignment[]>([
    {
      id: '1',
      examId: 'ex1',
      examTitle: 'Mathematics Mid-Term',
      date: '2024-03-15',
      time: '09:00',
      hall: 'Hall A',
      primaryInvigilator: 'Dr. Smith',
      secondaryInvigilator: 'Ms. Johnson',
      status: 'confirmed'
    },
    {
      id: '2',
      examId: 'ex2',
      examTitle: 'English Literature',
      date: '2024-03-16',
      time: '09:00',
      hall: 'Hall B',
      primaryInvigilator: 'Prof. Wilson',
      status: 'assigned'
    }
  ]);

  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'Dr. Smith', department: 'Mathematics', available: true },
    { id: '2', name: 'Ms. Johnson', department: 'English', available: true },
    { id: '3', name: 'Prof. Wilson', department: 'Science', available: true },
    { id: '4', name: 'Mr. Brown', department: 'History', available: false },
    { id: '5', name: 'Dr. Davis', department: 'Chemistry', available: true }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    examId: '',
    primaryInvigilator: '',
    secondaryInvigilator: ''
  });

  const availableExams = [
    { id: 'ex3', title: 'Physics Final', date: '2024-03-18', time: '14:00', hall: 'Hall C' },
    { id: 'ex4', title: 'Chemistry Test', date: '2024-03-19', time: '10:00', hall: 'Lab 1' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedExam = availableExams.find(exam => exam.id === formData.examId);
    if (!selectedExam) return;

    const newAssignment: InvigilatorAssignment = {
      id: Date.now().toString(),
      examId: formData.examId,
      examTitle: selectedExam.title,
      date: selectedExam.date,
      time: selectedExam.time,
      hall: selectedExam.hall,
      primaryInvigilator: formData.primaryInvigilator,
      secondaryInvigilator: formData.secondaryInvigilator || undefined,
      status: 'assigned'
    };

    setAssignments([...assignments, newAssignment]);
    toast({
      title: "Invigilators Assigned",
      description: "Invigilators have been assigned successfully.",
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      examId: '',
      primaryInvigilator: '',
      secondaryInvigilator: ''
    });
    setIsDialogOpen(false);
  };

  const updateStatus = (id: string, newStatus: 'assigned' | 'confirmed' | 'completed') => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, status: newStatus } : assignment
    ));
    toast({
      title: "Status Updated",
      description: `Assignment status changed to ${newStatus}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Invigilator Assignment</h3>
          <p className="text-sm text-muted-foreground">
            Assign invigilators to examination halls and time slots
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Assign Invigilators
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign Invigilators</DialogTitle>
              <DialogDescription>
                Assign primary and secondary invigilators to an exam
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="exam">Exam</Label>
                  <Select value={formData.examId} onValueChange={(value) => setFormData({...formData, examId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.title} - {exam.date} {exam.time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="primary">Primary Invigilator</Label>
                  <Select value={formData.primaryInvigilator} onValueChange={(value) => setFormData({...formData, primaryInvigilator: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary invigilator" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.filter(t => t.available).map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.name}>
                          {teacher.name} ({teacher.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="secondary">Secondary Invigilator (Optional)</Label>
                  <Select value={formData.secondaryInvigilator} onValueChange={(value) => setFormData({...formData, secondaryInvigilator: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select secondary invigilator" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.filter(t => t.available && t.name !== formData.primaryInvigilator).map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.name}>
                          {teacher.name} ({teacher.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  Assign
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'confirmed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.filter(t => t.available).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invigilator Assignments
          </CardTitle>
          <CardDescription>
            View and manage invigilator assignments for all exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Hall</TableHead>
                <TableHead>Primary Invigilator</TableHead>
                <TableHead>Secondary Invigilator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.examTitle}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {assignment.date} {assignment.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {assignment.hall}
                    </div>
                  </TableCell>
                  <TableCell>{assignment.primaryInvigilator}</TableCell>
                  <TableCell>{assignment.secondaryInvigilator || '-'}</TableCell>
                  <TableCell>
                    <Select
                      value={assignment.status}
                      onValueChange={(value: 'assigned' | 'confirmed' | 'completed') => updateStatus(assignment.id, value)}
                    >
                      <SelectTrigger className={`w-28 ${getStatusColor(assignment.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
