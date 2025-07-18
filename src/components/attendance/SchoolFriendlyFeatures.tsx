
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Wifi, WifiOff, Shield, Settings, BookOpen, UserCheck, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubstituteAssignment {
  id: string;
  date: string;
  absentTeacher: string;
  subject: string;
  class: string;
  period: string;
  substituteTeacher: string;
  status: 'assigned' | 'confirmed' | 'completed';
}

interface HolidayEntry {
  id: string;
  date: string;
  name: string;
  type: 'national' | 'religious' | 'school' | 'exam';
  autoMarked: boolean;
}

export const SchoolFriendlyFeatures: React.FC = () => {
  const { toast } = useToast();
  const [offlineMode, setOfflineMode] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(12);

  const substituteAssignments: SubstituteAssignment[] = [
    {
      id: '1',
      date: '2024-01-15',
      absentTeacher: 'Dr. Sarah Johnson',
      subject: 'Mathematics',
      class: 'Class X-A',
      period: '3rd Period',
      substituteTeacher: 'Mr. James Wilson',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2024-01-15',
      absentTeacher: 'Ms. Emily Davis',
      subject: 'English',
      class: 'Class IX-B',
      period: '5th Period',
      substituteTeacher: 'Ms. Rebecca Brown',
      status: 'assigned'
    }
  ];

  const holidays: HolidayEntry[] = [
    {
      id: '1',
      date: '2024-01-26',
      name: 'Republic Day',
      type: 'national',
      autoMarked: true
    },
    {
      id: '2',
      date: '2024-02-14',
      name: 'Saraswati Puja',
      type: 'religious',
      autoMarked: true
    },
    {
      id: '3',
      date: '2024-03-01',
      name: 'Annual Sports Day',
      type: 'school',
      autoMarked: false
    }
  ];

  const offlineEntries = [
    { id: '1', teacher: 'Mr. John Smith', class: 'Class X-A', students: 28, timestamp: '08:30 AM' },
    { id: '2', teacher: 'Ms. Jane Doe', class: 'Class IX-B', students: 32, timestamp: '09:15 AM' },
    { id: '3', teacher: 'Dr. Bob Wilson', class: 'Class XI-C', students: 25, timestamp: '10:00 AM' }
  ];

  const handleSyncOfflineData = () => {
    toast({
      title: "Sync Completed",
      description: `${pendingSyncCount} offline entries have been synchronized`,
    });
    setPendingSyncCount(0);
  };

  const handleToggleOfflineMode = () => {
    setOfflineMode(!offlineMode);
    toast({
      title: offlineMode ? "Online Mode" : "Offline Mode",
      description: offlineMode ? "Connected to server" : "Working offline - data will sync when connected",
    });
  };

  const handleOverrideAttendance = () => {
    toast({
      title: "Attendance Override",
      description: "Administrative override has been applied",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      assigned: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.assigned}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getHolidayTypeBadge = (type: string) => {
    const colors = {
      national: 'bg-red-100 text-red-800',
      religious: 'bg-purple-100 text-purple-800',
      school: 'bg-blue-100 text-blue-800',
      exam: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || colors.school}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="substitute" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="substitute">Substitute Teachers</TabsTrigger>
          <TabsTrigger value="holidays">Holidays & Events</TabsTrigger>
          <TabsTrigger value="offline">Offline Mode</TabsTrigger>
          <TabsTrigger value="override">Admin Override</TabsTrigger>
          <TabsTrigger value="parent-portal">Parent Portal</TabsTrigger>
        </TabsList>

        <TabsContent value="substitute">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Substitute Teacher Assignment
                </CardTitle>
                <CardDescription>
                  Manage substitute teachers for absent staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">New Assignment</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="absent-teacher">Absent Teacher</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="teacher1">Dr. Sarah Johnson</SelectItem>
                            <SelectItem value="teacher2">Ms. Emily Davis</SelectItem>
                            <SelectItem value="teacher3">Mr. John Smith</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="substitute">Substitute Teacher</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select substitute" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sub1">Mr. James Wilson</SelectItem>
                            <SelectItem value="sub2">Ms. Rebecca Brown</SelectItem>
                            <SelectItem value="sub3">Dr. Michael Davis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="class">Class</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="9a">Class IX-A</SelectItem>
                              <SelectItem value="10a">Class X-A</SelectItem>
                              <SelectItem value="11a">Class XI-A</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="period">Period</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1st Period</SelectItem>
                              <SelectItem value="2">2nd Period</SelectItem>
                              <SelectItem value="3">3rd Period</SelectItem>
                              <SelectItem value="4">4th Period</SelectItem>
                              <SelectItem value="5">5th Period</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="w-full">Assign Substitute</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Today's Assignments</h3>
                    <div className="space-y-3">
                      {substituteAssignments.map((assignment) => (
                        <div key={assignment.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{assignment.substituteTeacher}</p>
                              <p className="text-sm text-muted-foreground">
                                Covering for {assignment.absentTeacher}
                              </p>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>{assignment.class} - {assignment.subject}</p>
                            <p>{assignment.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="holidays">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Holiday & Event Management
                </CardTitle>
                <CardDescription>
                  Configure holidays and special events that affect attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Add Holiday/Event</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="holiday-date">Date</Label>
                        <Input id="holiday-date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="holiday-name">Name</Label>
                        <Input id="holiday-name" placeholder="Holiday/Event name" />
                      </div>
                      <div>
                        <Label htmlFor="holiday-type">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="national">National Holiday</SelectItem>
                            <SelectItem value="religious">Religious Holiday</SelectItem>
                            <SelectItem value="school">School Event</SelectItem>
                            <SelectItem value="exam">Exam Day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-mark" />
                        <Label htmlFor="auto-mark">Auto-mark as holiday</Label>
                      </div>
                      <Button className="w-full">Add Holiday</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Upcoming Holidays</h3>
                    <div className="space-y-3">
                      {holidays.map((holiday) => (
                        <div key={holiday.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{holiday.name}</p>
                              <p className="text-sm text-muted-foreground">{holiday.date}</p>
                            </div>
                            <div className="flex gap-2">
                              {getHolidayTypeBadge(holiday.type)}
                              {holiday.autoMarked && (
                                <Badge className="bg-green-100 text-green-800">Auto</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offline">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {offlineMode ? <WifiOff className="h-5 w-5 text-orange-500" /> : <Wifi className="h-5 w-5 text-green-500" />}
                  Offline Mode Management
                </CardTitle>
                <CardDescription>
                  Work offline and sync when connected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Connection Status</h3>
                      <p className="text-sm text-muted-foreground">
                        {offlineMode ? 'Working offline - data will sync when connected' : 'Connected to server'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {pendingSyncCount > 0 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          {pendingSyncCount} pending
                        </Badge>
                      )}
                      <Switch
                        checked={offlineMode}
                        onCheckedChange={handleToggleOfflineMode}
                      />
                    </div>
                  </div>

                  {pendingSyncCount > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Pending Sync</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {offlineEntries.map((entry) => (
                            <div key={entry.id} className="flex justify-between items-center p-2 bg-muted rounded">
                              <div>
                                <p className="text-sm font-medium">{entry.teacher}</p>
                                <p className="text-xs text-muted-foreground">
                                  {entry.class} - {entry.students} students - {entry.timestamp}
                                </p>
                              </div>
                              <Clock className="h-4 w-4 text-orange-500" />
                            </div>
                          ))}
                        </div>
                        <Button onClick={handleSyncOfflineData} className="w-full mt-4">
                          Sync All Data
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Offline Features</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Mark attendance offline</li>
                        <li>✓ View student lists</li>
                        <li>✓ Generate reports</li>
                        <li>✓ Auto-sync when online</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Sync Settings</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-sync</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Sync on WiFi only</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="override">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Administrative Override
                </CardTitle>
                <CardDescription>
                  Override attendance records and approve corrections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Override Required</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Administrative approval needed for attendance corrections
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Student:</strong> John Doe (Class X-A)
                          </p>
                          <p className="text-sm">
                            <strong>Date:</strong> 2024-01-14
                          </p>
                          <p className="text-sm">
                            <strong>Change:</strong> Absent → Present (Medical certificate provided)
                          </p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={handleOverrideAttendance}>
                            Approve Override
                          </Button>
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-medium">Manual Override</h3>
                      <div>
                        <Label htmlFor="override-student">Student</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="s1">John Doe - Class X-A</SelectItem>
                            <SelectItem value="s2">Jane Smith - Class IX-B</SelectItem>
                            <SelectItem value="s3">Bob Johnson - Class XI-C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="override-date">Date</Label>
                        <Input id="override-date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="override-status">New Status</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="excused">Excused</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="override-reason">Reason for Override</Label>
                        <Textarea
                          id="override-reason"
                          placeholder="Explain the reason for this override..."
                          rows={3}
                        />
                      </div>
                      <Button className="w-full">Apply Override</Button>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-medium">Recent Overrides</h3>
                      <div className="space-y-3">
                        {[
                          { student: 'Alice Brown', date: '2024-01-12', reason: 'Medical certificate', admin: 'Principal' },
                          { student: 'Charlie Wilson', date: '2024-01-10', reason: 'Technical error', admin: 'Vice Principal' },
                        ].map((override, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-medium">{override.student}</p>
                              <Badge className="bg-blue-100 text-blue-800">Approved</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{override.date}</p>
                            <p className="text-sm">{override.reason}</p>
                            <p className="text-xs text-muted-foreground">By: {override.admin}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="parent-portal">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Parent Portal Integration
                </CardTitle>
                <CardDescription>
                  Parent access to attendance records and leave applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Portal Features</h3>
                    <div className="space-y-3">
                      {[
                        { feature: 'View Child\'s Attendance', enabled: true },
                        { feature: 'Submit Leave Applications', enabled: true },
                        { feature: 'Receive Absence Notifications', enabled: true },
                        { feature: 'Download Attendance Reports', enabled: false },
                        { feature: 'View Attendance Analytics', enabled: false }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{item.feature}</span>
                          <Switch checked={item.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Leave Application Settings</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="advance-days">Minimum advance notice (days)</Label>
                        <Input id="advance-days" type="number" defaultValue="2" />
                      </div>
                      <div>
                        <Label htmlFor="max-days">Maximum leave days per request</Label>
                        <Input id="max-days" type="number" defaultValue="7" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="auto-approve" />
                        <Label htmlFor="auto-approve">Auto-approve medical leaves</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="require-docs" />
                        <Label htmlFor="require-docs">Require supporting documents</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Portal Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Parents</p>
                      <p className="text-lg font-bold">458</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Logins</p>
                      <p className="text-lg font-bold">1,234</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Leave Requests</p>
                      <p className="text-lg font-bold">67</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                      <p className="text-lg font-bold">4.2/5</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
