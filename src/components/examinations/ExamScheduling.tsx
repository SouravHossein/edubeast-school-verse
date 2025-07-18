
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Exam {
  id: string;
  subject: string;
  class: string;
  date: string;
  time: string;
  duration: string;
  hall: string;
  totalMarks: number;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export const ExamScheduling = () => {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      subject: 'Mathematics',
      class: 'Grade 10A',
      date: '2024-03-15',
      time: '09:00',
      duration: '3 hours',
      hall: 'Hall A',
      totalMarks: 100,
      status: 'scheduled'
    },
    {
      id: '2',
      subject: 'English',
      class: 'Grade 10A',
      date: '2024-03-16',
      time: '09:00',
      duration: '3 hours',
      hall: 'Hall B',
      totalMarks: 100,
      status: 'scheduled'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    class: '',
    date: '',
    time: '',
    duration: '',
    hall: '',
    totalMarks: 100
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExam) {
      setExams(exams.map(exam => 
        exam.id === editingExam.id 
          ? { ...exam, ...formData }
          : exam
      ));
      toast({
        title: "Exam Updated",
        description: "Exam schedule has been updated successfully.",
      });
    } else {
      const newExam: Exam = {
        id: Date.now().toString(),
        ...formData,
        status: 'scheduled'
      };
      setExams([...exams, newExam]);
      toast({
        title: "Exam Scheduled",
        description: "New exam has been scheduled successfully.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      class: '',
      date: '',
      time: '',
      duration: '',
      hall: '',
      totalMarks: 100
    });
    setEditingExam(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      subject: exam.subject,
      class: exam.class,
      date: exam.date,
      time: exam.time,
      duration: exam.duration,
      hall: exam.hall,
      totalMarks: exam.totalMarks
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExams(exams.filter(exam => exam.id !== id));
    toast({
      title: "Exam Deleted",
      description: "Exam has been removed from schedule.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600';
      case 'ongoing': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Examination Schedule</h3>
          <p className="text-sm text-muted-foreground">
            Schedule exams and allocate examination halls
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingExam ? 'Edit Exam' : 'Schedule New Exam'}
              </DialogTitle>
              <DialogDescription>
                {editingExam ? 'Update exam details' : 'Add a new exam to the schedule'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 9A">Grade 9A</SelectItem>
                      <SelectItem value="Grade 9B">Grade 9B</SelectItem>
                      <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                      <SelectItem value="Grade 10B">Grade 10B</SelectItem>
                      <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                      <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                        <SelectItem value="2 hours">2 hours</SelectItem>
                        <SelectItem value="3 hours">3 hours</SelectItem>
                        <SelectItem value="4 hours">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hall">Hall</Label>
                    <Select value={formData.hall} onValueChange={(value) => setFormData({...formData, hall: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hall" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hall A">Hall A</SelectItem>
                        <SelectItem value="Hall B">Hall B</SelectItem>
                        <SelectItem value="Hall C">Hall C</SelectItem>
                        <SelectItem value="Auditorium">Auditorium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalMarks">Total Marks</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExam ? 'Update' : 'Schedule'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Exams
          </CardTitle>
          <CardDescription>
            View and manage all scheduled examinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Hall</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.subject}</TableCell>
                  <TableCell>{exam.class}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {exam.date}
                      <Clock className="h-4 w-4 ml-2" />
                      {exam.time}
                    </div>
                  </TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {exam.hall}
                    </div>
                  </TableCell>
                  <TableCell>{exam.totalMarks}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${getStatusColor(exam.status)}`}>
                      {exam.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(exam)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(exam.id)}
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
    </div>
  );
};
