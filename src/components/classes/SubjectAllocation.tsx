import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Edit, Trash2, User, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubjectAllocation {
  id: string;
  subject: string;
  class: string;
  section: string;
  teacher: string;
  periodsPerWeek: number;
  isOptional?: boolean;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  type: 'core' | 'elective' | 'practical';
}

export const SubjectAllocation: React.FC = () => {
  const [allocations, setAllocations] = useState<SubjectAllocation[]>([
    {
      id: '1',
      subject: 'Mathematics',
      class: 'Class X',
      section: 'A',
      teacher: 'Mrs. Smith',
      periodsPerWeek: 6
    },
    {
      id: '2',
      subject: 'Physics',
      class: 'Class X',
      section: 'A',
      teacher: 'Mr. Johnson',
      periodsPerWeek: 5
    },
    {
      id: '3',
      subject: 'Chemistry',
      class: 'Class X',
      section: 'A',
      teacher: 'Dr. Davis',
      periodsPerWeek: 5
    },
    {
      id: '4',
      subject: 'English',
      class: 'Class X',
      section: 'A',
      teacher: 'Ms. Wilson',
      periodsPerWeek: 4
    }
  ]);

  const [subjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', code: 'MATH', department: 'Science', type: 'core' },
    { id: '2', name: 'Physics', code: 'PHY', department: 'Science', type: 'core' },
    { id: '3', name: 'Chemistry', code: 'CHEM', department: 'Science', type: 'core' },
    { id: '4', name: 'Biology', code: 'BIO', department: 'Science', type: 'core' },
    { id: '5', name: 'English', code: 'ENG', department: 'Languages', type: 'core' },
    { id: '6', name: 'History', code: 'HIST', department: 'Social Studies', type: 'elective' },
    { id: '7', name: 'Geography', code: 'GEO', department: 'Social Studies', type: 'elective' },
    { id: '8', name: 'Computer Science', code: 'CS', department: 'Technology', type: 'practical' }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState<SubjectAllocation | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    class: '',
    section: '',
    teacher: '',
    periodsPerWeek: 5
  });

  const { toast } = useToast();

  const classes = ['Class IX', 'Class X', 'Class XI', 'Class XII'];
  const sections = ['A', 'B', 'C', 'D'];
  const teachers = ['Mrs. Smith', 'Mr. Johnson', 'Dr. Davis', 'Ms. Wilson', 'Mr. Brown', 'Mrs. Taylor'];

  const handleCreateAllocation = () => {
    const newAllocation: SubjectAllocation = {
      id: Date.now().toString(),
      subject: formData.subject,
      class: formData.class,
      section: formData.section,
      teacher: formData.teacher,
      periodsPerWeek: formData.periodsPerWeek
    };

    if (editingAllocation) {
      setAllocations(allocations.map(a => 
        a.id === editingAllocation.id ? { ...newAllocation, id: editingAllocation.id } : a
      ));
      toast({
        title: "Allocation Updated",
        description: "Subject allocation has been updated successfully.",
      });
    } else {
      setAllocations([...allocations, newAllocation]);
      toast({
        title: "Allocation Created",
        description: "New subject allocation has been created successfully.",
      });
    }

    setIsDialogOpen(false);
    setEditingAllocation(null);
    setFormData({ subject: '', class: '', section: '', teacher: '', periodsPerWeek: 5 });
  };

  const handleEditAllocation = (allocation: SubjectAllocation) => {
    setEditingAllocation(allocation);
    setFormData({
      subject: allocation.subject,
      class: allocation.class,
      section: allocation.section,
      teacher: allocation.teacher,
      periodsPerWeek: allocation.periodsPerWeek
    });
    setIsDialogOpen(true);
  };

  const handleDeleteAllocation = (id: string) => {
    setAllocations(allocations.filter(a => a.id !== id));
    toast({
      title: "Allocation Deleted",
      description: "Subject allocation has been deleted successfully.",
    });
  };

  const getSubjectType = (subjectName: string) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject?.type || 'core';
  };

  const getSubjectTypeBadge = (type: string) => {
    switch (type) {
      case 'core':
        return <Badge variant="default">Core</Badge>;
      case 'elective':
        return <Badge variant="secondary">Elective</Badge>;
      case 'practical':
        return <Badge variant="outline">Practical</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getTeacherWorkload = (teacherName: string) => {
    return allocations
      .filter(a => a.teacher === teacherName)
      .reduce((total, a) => total + a.periodsPerWeek, 0);
  };

  const groupedAllocations = allocations.reduce((groups, allocation) => {
    const key = `${allocation.class}-${allocation.section}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(allocation);
    return groups;
  }, {} as Record<string, SubjectAllocation[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Subject Allocation
              </CardTitle>
              <CardDescription>
                Assign subjects to teachers for each class and section
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Allocation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingAllocation ? 'Edit Subject Allocation' : 'Create Subject Allocation'}
                  </DialogTitle>
                  <DialogDescription>
                    Assign a subject to a teacher for a specific class and section
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
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
                          <SelectItem key={subject.id} value={subject.name}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Teacher</Label>
                    <Select value={formData.teacher} onValueChange={(value) => setFormData({ ...formData, teacher: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map(teacher => (
                          <SelectItem key={teacher} value={teacher}>
                            {teacher} ({getTeacherWorkload(teacher)} periods/week)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Periods per Week</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.periodsPerWeek}
                      onChange={(e) => setFormData({ ...formData, periodsPerWeek: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAllocation}>
                    {editingAllocation ? 'Update Allocation' : 'Create Allocation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Class-wise Allocations */}
      <div className="space-y-6">
        {Object.entries(groupedAllocations).map(([classSection, classAllocations]) => (
          <Card key={classSection}>
            <CardHeader>
              <CardTitle className="text-lg">
                {classSection.replace('-', ' Section ')}
              </CardTitle>
              <CardDescription>
                {classAllocations.length} subjects allocated • {classAllocations.reduce((total, a) => total + a.periodsPerWeek, 0)} periods per week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Periods/Week</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classAllocations.map((allocation) => (
                    <TableRow key={allocation.id}>
                      <TableCell className="font-medium">{allocation.subject}</TableCell>
                      <TableCell>{getSubjectTypeBadge(getSubjectType(allocation.subject))}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {allocation.teacher}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {allocation.periodsPerWeek}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAllocation(allocation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAllocation(allocation.id)}
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
        ))}
      </div>

      {/* Teacher Workload Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Teacher Workload Summary</CardTitle>
          <CardDescription>
            Overview of teaching periods assigned to each teacher
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map(teacher => {
              const workload = getTeacherWorkload(teacher);
              const teacherSubjects = allocations.filter(a => a.teacher === teacher);
              
              return (
                <Card key={teacher}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{teacher}</CardTitle>
                    <CardDescription>
                      {workload} periods per week • {teacherSubjects.length} subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {teacherSubjects.map(allocation => (
                        <div key={allocation.id} className="flex justify-between text-sm">
                          <span>{allocation.subject}</span>
                          <span className="text-muted-foreground">
                            {allocation.class}-{allocation.section} ({allocation.periodsPerWeek}p)
                          </span>
                        </div>
                      ))}
                      {teacherSubjects.length === 0 && (
                        <div className="text-sm text-muted-foreground text-center">
                          No subjects assigned
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};