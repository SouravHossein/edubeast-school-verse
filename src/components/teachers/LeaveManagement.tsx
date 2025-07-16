import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus, Eye } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  leaveType: 'annual' | 'sick' | 'maternity' | 'emergency' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
}

export const LeaveManagement = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);

  // Mock data
  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'Dr. Sarah Johnson',
      department: 'Mathematics',
      leaveType: 'annual',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      days: 5,
      reason: 'Family vacation',
      status: 'pending',
      appliedDate: '2024-01-15'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Mr. James Wilson',
      department: 'Science',
      leaveType: 'sick',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      days: 3,
      reason: 'Fever and flu symptoms',
      status: 'approved',
      appliedDate: '2024-01-18',
      approvedBy: 'Principal'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      name: 'Ms. Emily Davis',
      department: 'English',
      leaveType: 'maternity',
      startDate: '2024-03-01',
      endDate: '2024-06-01',
      days: 90,
      reason: 'Maternity leave',
      status: 'approved',
      appliedDate: '2024-01-10',
      approvedBy: 'Principal'
    }
  ];

  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || request.department === departmentFilter;
    return matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", icon: React.ReactNode }> = {
      pending: { variant: 'outline', icon: <Clock className="h-3 w-3" /> },
      approved: { variant: 'default', icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { variant: 'destructive', icon: <XCircle className="h-3 w-3" /> }
    };
    
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const getLeaveTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      annual: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      maternity: 'bg-green-100 text-green-800',
      emergency: 'bg-orange-100 text-orange-800',
      unpaid: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="secondary" className={colors[type]}>
        {type}
      </Badge>
    );
  };

  const stats = {
    pending: filteredRequests.filter(r => r.status === 'pending').length,
    approved: filteredRequests.filter(r => r.status === 'approved').length,
    rejected: filteredRequests.filter(r => r.status === 'rejected').length,
    totalDays: filteredRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0)
  };

  const handleApproveReject = (request: LeaveRequest, action: 'approve' | 'reject') => {
    console.log(`${action} leave request:`, request);
    setShowApprovalDialog(false);
    setSelectedLeave(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Leave Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
        </CardContent>
      </Card>

      {/* Leave Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Days</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.name}</div>
                      <div className="text-sm text-muted-foreground">{request.employeeId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(request.startDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(request.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{request.days} days</TableCell>
                  <TableCell>{new Date(request.appliedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Leave Request Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Employee</Label>
                                <p className="text-sm">{request.name}</p>
                              </div>
                              <div>
                                <Label>Department</Label>
                                <p className="text-sm">{request.department}</p>
                              </div>
                              <div>
                                <Label>Leave Type</Label>
                                <p className="text-sm">{request.leaveType}</p>
                              </div>
                              <div>
                                <Label>Duration</Label>
                                <p className="text-sm">{request.days} days</p>
                              </div>
                            </div>
                            <div>
                              <Label>Reason</Label>
                              <p className="text-sm">{request.reason}</p>
                            </div>
                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  variant="default" 
                                  onClick={() => handleApproveReject(request, 'approve')}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleApproveReject(request, 'reject')}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
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