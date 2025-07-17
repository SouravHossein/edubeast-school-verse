import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Class {
  id: string;
  name: string;
  grade: string;
  sections: Section[];
  totalStudents: number;
}

interface Section {
  id: string;
  name: string;
  capacity: number;
  currentStudents: number;
  classTeacher?: string;
}

export const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'Class IX',
      grade: '9',
      sections: [
        { id: '1a', name: 'A', capacity: 40, currentStudents: 35, classTeacher: 'Mrs. Smith' },
        { id: '1b', name: 'B', capacity: 40, currentStudents: 38, classTeacher: 'Mr. Johnson' }
      ],
      totalStudents: 73
    },
    {
      id: '2',
      name: 'Class X',
      grade: '10',
      sections: [
        { id: '2a', name: 'A', capacity: 40, currentStudents: 40, classTeacher: 'Mrs. Davis' },
        { id: '2b', name: 'B', capacity: 40, currentStudents: 36, classTeacher: 'Mr. Wilson' }
      ],
      totalStudents: 76
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    sections: [{ name: 'A', capacity: 40, classTeacher: '' }]
  });

  const { toast } = useToast();

  const handleCreateClass = () => {
    const newClass: Class = {
      id: Date.now().toString(),
      name: formData.name,
      grade: formData.grade,
      sections: formData.sections.map((section, index) => ({
        id: `${Date.now()}_${index}`,
        name: section.name,
        capacity: section.capacity,
        currentStudents: 0,
        classTeacher: section.classTeacher
      })),
      totalStudents: 0
    };

    setClasses([...classes, newClass]);
    setIsDialogOpen(false);
    setFormData({ name: '', grade: '', sections: [{ name: 'A', capacity: 40, classTeacher: '' }] });
    
    toast({
      title: "Class Created",
      description: `${formData.name} has been created successfully.`,
    });
  };

  const handleEditClass = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      grade: classItem.grade,
      sections: classItem.sections.map(s => ({
        name: s.name,
        capacity: s.capacity,
        classTeacher: s.classTeacher || ''
      }))
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter(c => c.id !== classId));
    toast({
      title: "Class Deleted",
      description: "Class has been deleted successfully.",
    });
  };

  const addSection = () => {
    const nextSectionName = String.fromCharCode(65 + formData.sections.length); // A, B, C, etc.
    setFormData({
      ...formData,
      sections: [...formData.sections, { name: nextSectionName, capacity: 40, classTeacher: '' }]
    });
  };

  const removeSection = (index: number) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index)
    });
  };

  const updateSection = (index: number, field: string, value: string | number) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setFormData({ ...formData, sections: updatedSections });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Class Management
              </CardTitle>
              <CardDescription>
                Create and manage classes with sections
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingClass ? 'Edit Class' : 'Create New Class'}
                  </DialogTitle>
                  <DialogDescription>
                    Set up class details and sections
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Class Name</Label>
                      <Input
                        placeholder="e.g., Class IX"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Grade</Label>
                      <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              Grade {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Sections</Label>
                      <Button size="sm" variant="outline" onClick={addSection}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Section
                      </Button>
                    </div>
                    
                    {formData.sections.map((section, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-end">
                        <div className="space-y-1">
                          <Label className="text-xs">Section Name</Label>
                          <Input
                            value={section.name}
                            onChange={(e) => updateSection(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Capacity</Label>
                          <Input
                            type="number"
                            value={section.capacity}
                            onChange={(e) => updateSection(index, 'capacity', Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Class Teacher</Label>
                          <Input
                            placeholder="Teacher name"
                            value={section.classTeacher}
                            onChange={(e) => updateSection(index, 'classTeacher', e.target.value)}
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeSection(index)}
                          disabled={formData.sections.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateClass}>
                    {editingClass ? 'Update Class' : 'Create Class'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
          <CardDescription>
            Overview of all classes and their sections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Total Students</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">{classItem.name}</TableCell>
                  <TableCell>{classItem.grade}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {classItem.sections.map((section) => (
                        <Badge key={section.id} variant="outline">
                          {section.name} ({section.currentStudents}/{section.capacity})
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {classItem.totalStudents}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClass(classItem)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClass(classItem.id)}
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

      {/* Sections Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((classItem) =>
          classItem.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {classItem.name} - Section {section.name}
                </CardTitle>
                <CardDescription>
                  Class Teacher: {section.classTeacher || 'Not assigned'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Students:</span>
                    <span className="font-medium">
                      {section.currentStudents}/{section.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{
                        width: `${(section.currentStudents / section.capacity) * 100}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {section.capacity - section.currentStudents} seats available
                    </span>
                    <span>
                      {Math.round((section.currentStudents / section.capacity) * 100)}% full
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};