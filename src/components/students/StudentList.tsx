
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MoreHorizontal, Eye, Edit, CreditCard, ArrowUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  section: string;
  rollNo: string;
  status: 'active' | 'inactive' | 'graduated';
  admissionDate: string;
  parentName: string;
  phone: string;
}

export const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual API call
  const students: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      studentId: 'STU001',
      class: 'Grade 10',
      section: 'A',
      rollNo: '001',
      status: 'active',
      admissionDate: '2023-01-15',
      parentName: 'Robert Doe',
      phone: '+1234567890'
    },
    {
      id: '2',
      name: 'Jane Smith',
      studentId: 'STU002',
      class: 'Grade 9',
      section: 'B',
      rollNo: '002',
      status: 'active',
      admissionDate: '2023-02-20',
      parentName: 'Mary Smith',
      phone: '+1234567891'
    },
    // Add more mock data as needed
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      active: 'default',
      inactive: 'secondary',
      graduated: 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Database</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or parent name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="Grade 10">Grade 10</SelectItem>
              <SelectItem value="Grade 9">Grade 9</SelectItem>
              <SelectItem value="Grade 8">Grade 8</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="graduated">Graduated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" className="h-auto p-0 font-medium">
                  Student ID <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Class/Section</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.studentId}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class} - {student.section}</TableCell>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>{getStatusBadge(student.status)}</TableCell>
                <TableCell>{student.parentName}</TableCell>
                <TableCell>{new Date(student.admissionDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Generate ID Card
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
