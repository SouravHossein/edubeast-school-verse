import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Download, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workHours: number;
  overtime: number;
}

export const StaffAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock data
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'Dr. Sarah Johnson',
      department: 'Mathematics',
      date: '2024-01-15',
      clockIn: '08:00',
      clockOut: '16:30',
      status: 'present',
      workHours: 8.5,
      overtime: 0.5
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Mr. James Wilson',
      department: 'Science',
      date: '2024-01-15',
      clockIn: '08:15',
      clockOut: '16:00',
      status: 'late',
      workHours: 7.75,
      overtime: 0
    },
    {
      id: '3',
      employeeId: 'EMP003',
      name: 'Ms. Emily Davis',
      department: 'English',
      date: '2024-01-15',
      clockIn: '',
      clockOut: '',
      status: 'absent',
      workHours: 0,
      overtime: 0
    }
  ];

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    const matchesDate = record.date === selectedDate;
    return matchesDepartment && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", icon: React.ReactNode }> = {
      present: { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      absent: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> },
      late: { variant: 'outline', icon: <AlertCircle className="h-3 w-3" /> },
      'half-day': { variant: 'secondary', icon: <Clock className="h-3 w-3" /> }
    };
    
    const config = variants[status] || variants.present;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const stats = {
    present: filteredRecords.filter(r => r.status === 'present').length,
    absent: filteredRecords.filter(r => r.status === 'absent').length,
    late: filteredRecords.filter(r => r.status === 'late').length,
    totalHours: filteredRecords.reduce((sum, r) => sum + r.workHours, 0)
  };

  return (
    <div className="space-y-6">
      {/* Date and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Staff Attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="date">Select Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="department">Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Record</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employeeId}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.clockIn || '-'}</TableCell>
                  <TableCell>{record.clockOut || '-'}</TableCell>
                  <TableCell>{record.workHours}h</TableCell>
                  <TableCell>{record.overtime > 0 ? `+${record.overtime}h` : '-'}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};