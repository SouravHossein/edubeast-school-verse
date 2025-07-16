import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MoreHorizontal, Eye, Edit, FileText, ArrowUpDown, Phone, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  subjects: string[];
  qualification: string;
  experience: number;
  status: 'active' | 'inactive' | 'on-leave';
  joiningDate: string;
  phone: string;
  email: string;
  salary: number;
}

export const TeacherList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const teachers: Teacher[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'Dr. Sarah Johnson',
      department: 'Mathematics',
      subjects: ['Algebra', 'Geometry', 'Calculus'],
      qualification: 'PhD Mathematics',
      experience: 8,
      status: 'active',
      joiningDate: '2020-01-15',
      phone: '+1234567890',
      email: 'sarah.johnson@school.edu',
      salary: 75000
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Mr. James Wilson',
      department: 'Science',
      subjects: ['Physics', 'Chemistry'],
      qualification: 'MSc Physics',
      experience: 5,
      status: 'active',
      joiningDate: '2022-03-10',
      phone: '+1234567891',
      email: 'james.wilson@school.edu',
      salary: 65000
    },
    {
      id: '3',
      employeeId: 'EMP003',
      name: 'Ms. Emily Davis',
      department: 'English',
      subjects: ['Literature', 'Grammar', 'Writing'],
      qualification: 'MA English Literature',
      experience: 6,
      status: 'on-leave',
      joiningDate: '2021-08-22',
      phone: '+1234567892',
      email: 'emily.davis@school.edu',
      salary: 60000
    }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === 'all' || teacher.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || teacher.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      active: 'default',
      inactive: 'secondary',
      'on-leave': 'outline'
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('-', ' ')}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teaching Staff Directory</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
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
              <SelectItem value="on-leave">On Leave</SelectItem>
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
                  Employee ID <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">{teacher.employeeId}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{teacher.name}</div>
                    <div className="text-sm text-muted-foreground">{teacher.qualification}</div>
                  </div>
                </TableCell>
                <TableCell>{teacher.department}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.slice(0, 2).map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {teacher.subjects.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{teacher.subjects.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{teacher.experience} years</TableCell>
                <TableCell>{getStatusBadge(teacher.status)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {teacher.phone}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {teacher.email}
                    </div>
                  </div>
                </TableCell>
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
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
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