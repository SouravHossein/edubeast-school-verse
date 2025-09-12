import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudents } from '@/hooks/useStudents';

interface Class {
  id: string;
  name: string;
  code: string;
}

interface Student {
  id: string;
  student_id: string;
  roll_number?: string;
  class_id?: string;
  status: 'active' | 'inactive' | 'transferred';
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

interface StudentListViewProps {
  students: Student[];
  loading: boolean;
  onAddStudent: () => void;
  onEditStudent: (student: any) => void;
  onDeleteStudent: (id: string) => Promise<void>;
  classes: Class[];
}

export const StudentListView: React.FC<StudentListViewProps> = ({ 
  students, 
  loading,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  classes
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');


  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === '' || student.class_id === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return <div className="p-6">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Student Directory</h2>
          <p className="text-muted-foreground">View and manage all students</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name} ({cls.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={student.profiles?.avatar_url} />
                  <AvatarFallback>
                    {student.profiles?.full_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {student.profiles?.full_name}
                  </CardTitle>
                  <CardDescription>
                    Student ID: {student.student_id}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Class:</span>
                  <span>{classes.find(c => c.id === selectedClass)?.name || 'Not Assigned'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Roll Number:</span>
                  <span>{student.roll_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                    {student.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No students found</h3>
          <p className="text-muted-foreground">
            No students match your current search criteria
          </p>
        </div>
      )}
    </div>
  );
};
