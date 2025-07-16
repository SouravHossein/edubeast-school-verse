import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Calendar, CreditCard, Clock, UserCheck, GraduationCap } from 'lucide-react';
import { TeacherList } from '@/components/teachers/TeacherList';
import { TeacherForm } from '@/components/teachers/TeacherForm';
import { StaffAttendance } from '@/components/teachers/StaffAttendance';
import { PayrollManagement } from '@/components/teachers/PayrollManagement';
import { LeaveManagement } from '@/components/teachers/LeaveManagement';

const TeacherManagement = () => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [showTeacherForm, setShowTeacherForm] = useState(false);

  const stats = [
    { title: 'Total Teachers', value: '45', icon: Users, color: 'text-blue-600' },
    { title: 'Present Today', value: '42', icon: UserCheck, color: 'text-green-600' },
    { title: 'On Leave', value: '3', icon: Calendar, color: 'text-orange-600' },
    { title: 'Pending Leaves', value: '7', icon: Clock, color: 'text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher & Staff Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage teaching staff, attendance, payroll, and leave applications
          </p>
        </div>
        <Button onClick={() => setShowTeacherForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4">
          <TeacherList />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <StaffAttendance />
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <LeaveManagement />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <PayrollManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Reports</CardTitle>
              <CardDescription>Generate comprehensive staff reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  Attendance Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <CreditCard className="h-6 w-6" />
                  Payroll Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Clock className="h-6 w-6" />
                  Leave Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <GraduationCap className="h-6 w-6" />
                  Performance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Teacher Form Modal */}
      {showTeacherForm && (
        <TeacherForm 
          open={showTeacherForm}
          onClose={() => setShowTeacherForm(false)}
        />
      )}
    </div>
  );
};

export default TeacherManagement;