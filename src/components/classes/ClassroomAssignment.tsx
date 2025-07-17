import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Building, Plus, Edit, Trash2, Users, MapPin, Wifi, Monitor, AirVent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Classroom {
  id: string;
  name: string;
  number: string;
  type: 'regular' | 'laboratory' | 'special';
  capacity: number;
  floor: number;
  building: string;
  facilities: string[];
  isAvailable: boolean;
  assignedClass?: string;
  assignedSection?: string;
}

interface ClassroomAssignment {
  id: string;
  classroomId: string;
  className: string;
  section: string;
  isTemporary?: boolean;
  notes?: string;
}

export const ClassroomAssignment: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: '1',
      name: 'Room 101',
      number: '101',
      type: 'regular',
      capacity: 40,
      floor: 1,
      building: 'Main Building',
      facilities: ['Projector', 'AC', 'WiFi'],
      isAvailable: false,
      assignedClass: 'Class X',
      assignedSection: 'A'
    },
    {
      id: '2',
      name: 'Science Lab 1',
      number: 'SL1',
      type: 'laboratory',
      capacity: 30,
      floor: 2,
      building: 'Science Block',
      facilities: ['Lab Equipment', 'Safety Equipment', 'Projector'],
      isAvailable: true
    },
    {
      id: '3',
      name: 'Computer Lab',
      number: 'CL1',
      type: 'laboratory',
      capacity: 35,
      floor: 3,
      building: 'Technology Block',
      facilities: ['Computers', 'Projector', 'AC', 'WiFi'],
      isAvailable: true
    },
    {
      id: '4',
      name: 'Library',
      number: 'LIB',
      type: 'special',
      capacity: 100,
      floor: 1,
      building: 'Main Building',
      facilities: ['Books', 'Reading Tables', 'WiFi', 'Silent Zone'],
      isAvailable: true
    }
  ]);

  const [assignments, setAssignments] = useState<ClassroomAssignment[]>([
    {
      id: '1',
      classroomId: '1',
      className: 'Class X',
      section: 'A',
      notes: 'Primary classroom for Class X-A'
    }
  ]);

  const [isClassroomDialogOpen, setIsClassroomDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<ClassroomAssignment | null>(null);

  const [classroomForm, setClassroomForm] = useState({
    name: '',
    number: '',
    type: 'regular' as 'regular' | 'laboratory' | 'special',
    capacity: 30,
    floor: 1,
    building: '',
    facilities: [] as string[],
    isAvailable: true
  });

  const [assignmentForm, setAssignmentForm] = useState({
    classroomId: '',
    className: '',
    section: '',
    isTemporary: false,
    notes: ''
  });

  const { toast } = useToast();

  const classTypes = [
    { value: 'regular', label: 'Regular Classroom' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'special', label: 'Special Room' }
  ];

  const buildings = ['Main Building', 'Science Block', 'Technology Block', 'Sports Complex'];
  const classes = ['Class IX', 'Class X', 'Class XI', 'Class XII'];
  const sections = ['A', 'B', 'C', 'D'];
  
  const allFacilities = [
    'Projector', 'AC', 'WiFi', 'Whiteboard', 'Blackboard', 
    'Lab Equipment', 'Safety Equipment', 'Computers', 
    'Audio System', 'Smart Board', 'Reading Tables', 'Books'
  ];

  const handleCreateClassroom = () => {
    const newClassroom: Classroom = {
      id: Date.now().toString(),
      name: classroomForm.name,
      number: classroomForm.number,
      type: classroomForm.type,
      capacity: classroomForm.capacity,
      floor: classroomForm.floor,
      building: classroomForm.building,
      facilities: classroomForm.facilities,
      isAvailable: classroomForm.isAvailable
    };

    if (editingClassroom) {
      setClassrooms(classrooms.map(c => 
        c.id === editingClassroom.id ? { ...newClassroom, id: editingClassroom.id } : c
      ));
      toast({
        title: "Classroom Updated",
        description: "Classroom has been updated successfully.",
      });
    } else {
      setClassrooms([...classrooms, newClassroom]);
      toast({
        title: "Classroom Created",
        description: "New classroom has been created successfully.",
      });
    }

    setIsClassroomDialogOpen(false);
    setEditingClassroom(null);
    setClassroomForm({
      name: '', number: '', type: 'regular', capacity: 30,
      floor: 1, building: '', facilities: [], isAvailable: true
    });
  };

  const handleCreateAssignment = () => {
    const newAssignment: ClassroomAssignment = {
      id: Date.now().toString(),
      classroomId: assignmentForm.classroomId,
      className: assignmentForm.className,
      section: assignmentForm.section,
      isTemporary: assignmentForm.isTemporary,
      notes: assignmentForm.notes
    };

    // Update classroom availability
    setClassrooms(classrooms.map(c => 
      c.id === assignmentForm.classroomId 
        ? { 
            ...c, 
            isAvailable: false, 
            assignedClass: assignmentForm.className,
            assignedSection: assignmentForm.section 
          }
        : c
    ));

    if (editingAssignment) {
      setAssignments(assignments.map(a => 
        a.id === editingAssignment.id ? { ...newAssignment, id: editingAssignment.id } : a
      ));
      toast({
        title: "Assignment Updated",
        description: "Classroom assignment has been updated successfully.",
      });
    } else {
      setAssignments([...assignments, newAssignment]);
      toast({
        title: "Assignment Created",
        description: "New classroom assignment has been created successfully.",
      });
    }

    setIsAssignmentDialogOpen(false);
    setEditingAssignment(null);
    setAssignmentForm({
      classroomId: '', className: '', section: '',
      isTemporary: false, notes: ''
    });
  };

  const handleEditClassroom = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setClassroomForm({
      name: classroom.name,
      number: classroom.number,
      type: classroom.type,
      capacity: classroom.capacity,
      floor: classroom.floor,
      building: classroom.building,
      facilities: classroom.facilities,
      isAvailable: classroom.isAvailable
    });
    setIsClassroomDialogOpen(true);
  };

  const handleDeleteClassroom = (id: string) => {
    setClassrooms(classrooms.filter(c => c.id !== id));
    setAssignments(assignments.filter(a => a.classroomId !== id));
    toast({
      title: "Classroom Deleted",
      description: "Classroom has been deleted successfully.",
    });
  };

  const handleDeleteAssignment = (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      // Make classroom available again
      setClassrooms(classrooms.map(c => 
        c.id === assignment.classroomId 
          ? { ...c, isAvailable: true, assignedClass: undefined, assignedSection: undefined }
          : c
      ));
    }

    setAssignments(assignments.filter(a => a.id !== id));
    toast({
      title: "Assignment Removed",
      description: "Classroom assignment has been removed successfully.",
    });
  };

  const getClassroomTypeBadge = (type: string) => {
    switch (type) {
      case 'regular':
        return <Badge variant="default">Regular</Badge>;
      case 'laboratory':
        return <Badge variant="secondary">Laboratory</Badge>;
      case 'special':
        return <Badge variant="outline">Special</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'projector':
      case 'smart board':
        return <Monitor className="h-3 w-3" />;
      case 'ac':
        return <AirVent className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const availableClassrooms = classrooms.filter(c => c.isAvailable);
  const occupiedClassrooms = classrooms.filter(c => !c.isAvailable);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Classroom Management
              </CardTitle>
              <CardDescription>
                Manage classrooms and assign them to classes
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isClassroomDialogOpen} onOpenChange={setIsClassroomDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Classroom
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}
                    </DialogTitle>
                    <DialogDescription>
                      Configure classroom details and facilities
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Classroom Name</Label>
                        <Input
                          placeholder="e.g., Room 101"
                          value={classroomForm.name}
                          onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Room Number</Label>
                        <Input
                          placeholder="e.g., 101"
                          value={classroomForm.number}
                          onChange={(e) => setClassroomForm({ ...classroomForm, number: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={classroomForm.type}
                          onValueChange={(value: any) => setClassroomForm({ ...classroomForm, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {classTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Capacity</Label>
                        <Input
                          type="number"
                          value={classroomForm.capacity}
                          onChange={(e) => setClassroomForm({ ...classroomForm, capacity: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Building</Label>
                        <Select
                          value={classroomForm.building}
                          onValueChange={(value) => setClassroomForm({ ...classroomForm, building: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select building" />
                          </SelectTrigger>
                          <SelectContent>
                            {buildings.map(building => (
                              <SelectItem key={building} value={building}>
                                {building}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Floor</Label>
                        <Input
                          type="number"
                          min="1"
                          value={classroomForm.floor}
                          onChange={(e) => setClassroomForm({ ...classroomForm, floor: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Facilities</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {allFacilities.map(facility => (
                          <div key={facility} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={facility}
                              checked={classroomForm.facilities.includes(facility)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setClassroomForm({
                                    ...classroomForm,
                                    facilities: [...classroomForm.facilities, facility]
                                  });
                                } else {
                                  setClassroomForm({
                                    ...classroomForm,
                                    facilities: classroomForm.facilities.filter(f => f !== facility)
                                  });
                                }
                              }}
                              className="rounded"
                            />
                            <Label htmlFor={facility} className="text-sm">
                              {facility}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={classroomForm.isAvailable}
                        onCheckedChange={(checked) => setClassroomForm({ ...classroomForm, isAvailable: checked })}
                      />
                      <Label>Available for assignment</Label>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsClassroomDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateClassroom}>
                      {editingClassroom ? 'Update Classroom' : 'Create Classroom'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Assign Classroom
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Classroom</DialogTitle>
                    <DialogDescription>
                      Assign a classroom to a class and section
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Classroom</Label>
                      <Select
                        value={assignmentForm.classroomId}
                        onValueChange={(value) => setAssignmentForm({ ...assignmentForm, classroomId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select classroom" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableClassrooms.map(classroom => (
                            <SelectItem key={classroom.id} value={classroom.id}>
                              {classroom.name} - {classroom.building} (Capacity: {classroom.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Class</Label>
                        <Select
                          value={assignmentForm.className}
                          onValueChange={(value) => setAssignmentForm({ ...assignmentForm, className: value })}
                        >
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
                        <Select
                          value={assignmentForm.section}
                          onValueChange={(value) => setAssignmentForm({ ...assignmentForm, section: value })}
                        >
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

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={assignmentForm.isTemporary}
                        onCheckedChange={(checked) => setAssignmentForm({ ...assignmentForm, isTemporary: checked })}
                      />
                      <Label>Temporary assignment</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        placeholder="Additional notes..."
                        value={assignmentForm.notes}
                        onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAssignment}>
                      Assign Classroom
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Classroom Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
          <CardDescription>
            Active classroom assignments for classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Classroom</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const classroom = classrooms.find(c => c.id === assignment.classroomId);
                if (!classroom) return null;
                
                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{classroom.name}</TableCell>
                    <TableCell>
                      {assignment.className} - Section {assignment.section}
                      {assignment.isTemporary && (
                        <Badge variant="outline" className="ml-2">Temporary</Badge>
                      )}
                    </TableCell>
                    <TableCell>{classroom.building} - Floor {classroom.floor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {classroom.capacity}
                      </div>
                    </TableCell>
                    <TableCell>{getClassroomTypeBadge(classroom.type)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* All Classrooms */}
      <Card>
        <CardHeader>
          <CardTitle>All Classrooms</CardTitle>
          <CardDescription>
            Complete list of classrooms and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Facilities</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classrooms.map((classroom) => (
                <TableRow key={classroom.id}>
                  <TableCell className="font-medium">{classroom.name}</TableCell>
                  <TableCell>{getClassroomTypeBadge(classroom.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {classroom.building} - Floor {classroom.floor}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {classroom.capacity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {classroom.facilities.slice(0, 3).map((facility) => (
                        <Badge key={facility} variant="outline" className="text-xs">
                          {getFacilityIcon(facility)}
                          <span className="ml-1">{facility}</span>
                        </Badge>
                      ))}
                      {classroom.facilities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{classroom.facilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {classroom.isAvailable ? (
                      <Badge variant="default">Available</Badge>
                    ) : (
                      <div>
                        <Badge variant="destructive">Occupied</Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {classroom.assignedClass} - {classroom.assignedSection}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClassroom(classroom)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClassroom(classroom.id)}
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