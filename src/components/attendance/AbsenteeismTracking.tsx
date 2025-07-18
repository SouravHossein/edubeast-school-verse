
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calendar, Clock, FileText, Mail, Phone, User, Users, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AbsenteeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  date: string;
  reason?: string;
  contactAttempts: number;
  status: 'unexcused' | 'excused' | 'pending' | 'medical';
  parentContacted: boolean;
}

interface LeaveRequest {
  id: string;
  studentName: string;
  class: string;
  requestDate: string;
  leaveDate: string;
  returnDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
}

export const AbsenteeismTracking: React.FC = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data
  const absenteeRecords: AbsenteeRecord[] = [
    {
      id: '1',
      studentId: 'S001',
      studentName: 'John Doe',
      class: 'Class X',
      section: 'A',
      date: '2024-01-15',
      reason: 'Sick',
      contactAttempts: 2,
      status: 'medical',
      parentContacted: true
    },
    {
      id: '2',
      studentId: 'S002',
      studentName: 'Jane Smith',
      class: 'Class IX',
      section: 'B',
      date: '2024-01-15',
      contactAttempts: 0,
      status: 'unexcused',
      parentContacted: false
    },
    {
      id: '3',
      studentId: 'S003',
      studentName: 'Bob Johnson',
      class: 'Class XI',
      section: 'A',
      date: '2024-01-15',
      reason: 'Family emergency',
      contactAttempts: 1,
      status: 'excused',
      parentContacted: true
    }
  ];

  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      studentName: 'Alice Brown',
      class: 'Class X-B',
      requestDate: '2024-01-10',
      leaveDate: '2024-01-20',
      returnDate: '2024-01-25',
      reason: 'Family wedding',
      status: 'pending',
      requestedBy: 'Parent'
    },
    {
      id: '2',
      studentName: 'Charlie Wilson',
      class: 'Class IX-A',
      requestDate: '2024-01-12',
      leaveDate: '2024-01-18',
      returnDate: '2024-01-19',
      reason: 'Medical appointment',
      status: 'approved',
      requestedBy: 'Parent'
    }
  ];

  const chronicAbsentees = [
    {
      id: '1',
      studentName: 'Michael Davis',
      class: 'Class X-A',
      totalDays: 45,
      absentDays: 18,
      attendanceRate: 60.0,
      lastAbsent: '2024-01-14',
      riskLevel: 'high'
    },
    {
      id: '2',
      studentName: 'Sarah Johnson',
      class: 'Class XI-B',
      totalDays: 45,
      absentDays: 12,
      attendanceRate: 73.3,
      lastAbsent: '2024-01-12',
      riskLevel: 'medium'
    }
  ];

  const handleContactParent = (studentId: string) => {
    toast({
      title: "Parent Contacted",
      description: "Parent contact attempt has been logged",
    });
  };

  const handleApproveLeave = (requestId: string) => {
    toast({
      title: "Leave Approved",
      description: "Leave request has been approved",
    });
  };

  const handleRejectLeave = (requestId: string) => {
    toast({
      title: "Leave Rejected",
      description: "Leave request has been rejected",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", color: string }> = {
      unexcused: { variant: 'destructive', color: 'bg-red-100 text-red-800' },
      excused: { variant: 'default', color: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary', color: 'bg-yellow-100 text-yellow-800' },
      medical: { variant: 'outline', color: 'bg-blue-100 text-blue-800' }
    };
    
    const config = variants[status] || variants.pending;
    return (
      <Badge className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (level: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[level as keyof typeof colors] || colors.medium}>
        {level.toUpperCase()} RISK
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily Absentees</TabsTrigger>
          <TabsTrigger value="chronic">Chronic Absentees</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="followup">Follow-up</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Daily Absentee List
              </CardTitle>
              <CardDescription>
                Track and manage student absences for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <div>
                    <Label htmlFor="class-filter">Class Filter</Label>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="9">Class IX</SelectItem>
                        <SelectItem value="10">Class X</SelectItem>
                        <SelectItem value="11">Class XI</SelectItem>
                        <SelectItem value="12">Class XII</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Export List
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Contact Attempts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absenteeRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.studentName}</p>
                          <p className="text-sm text-muted-foreground">ID: {record.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{record.class}-{record.section}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.reason || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{record.contactAttempts}</span>
                          {record.parentContacted && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContactParent(record.studentId)}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chronic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Chronic Absentee Alert
              </CardTitle>
              <CardDescription>
                Students with concerning attendance patterns requiring intervention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chronicAbsentees.map((student) => (
                  <div key={student.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{student.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{student.class}</p>
                      </div>
                      {getRiskBadge(student.riskLevel)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        <p className="font-medium text-red-600">{student.attendanceRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Days Absent</p>
                        <p className="font-medium">{student.absentDays}/{student.totalDays}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Absent</p>
                        <p className="font-medium">{student.lastAbsent}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Action Needed</p>
                        <p className="font-medium text-orange-600">Counseling</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <User className="h-3 w-3 mr-1" />
                        Schedule Counseling
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Contact Parent
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Leave Request Management
              </CardTitle>
              <CardDescription>
                Approve or reject student leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Leave Period</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.studentName}</p>
                          <p className="text-sm text-muted-foreground">{request.class}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{request.leaveDate} to {request.returnDate}</p>
                          <p className="text-xs text-muted-foreground">Requested: {request.requestDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleApproveLeave(request.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectLeave(request.id)}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Follow-up Reminders
              </CardTitle>
              <CardDescription>
                Smart reminders for repeated absences and follow-up actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-800">Repeated Absence Alert</h4>
                      <p className="text-sm text-yellow-700 mb-2">
                        Michael Davis has been absent for 3 consecutive days without proper documentation.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Contact Parent</Button>
                        <Button size="sm" variant="outline">Schedule Meeting</Button>
                        <Button size="sm" variant="outline">Mark as Followed Up</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-800">Counseling Due</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Sarah Johnson's attendance rate has dropped below 75%. Counseling session recommended.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Schedule Counseling</Button>
                        <Button size="sm" variant="outline">Notify Counselor</Button>
                        <Button size="sm" variant="outline">Send Report</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Bulk Actions</h4>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      Send Daily Summary
                    </Button>
                    <Button variant="outline">
                      Generate Weekly Report
                    </Button>
                    <Button variant="outline">
                      Mark All Contacted
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
