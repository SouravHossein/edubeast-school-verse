import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, Clock, AlertTriangle } from 'lucide-react';

export const AttendanceAnalytics: React.FC = () => {
  // Mock data - replace with actual API
  const overallStats = {
    totalStudents: 850,
    presentToday: 765,
    absentToday: 85,
    averageAttendance: 89.5,
    trend: 'up'
  };

  const monthlyData = [
    { month: 'Jan', attendance: 88.2 },
    { month: 'Feb', attendance: 90.1 },
    { month: 'Mar', attendance: 87.5 },
    { month: 'Apr', attendance: 89.8 },
    { month: 'May', attendance: 91.2 },
    { month: 'Jun', attendance: 85.6 },
  ];

  const classWiseData = [
    { class: 'Class IX', present: 180, absent: 20, late: 5 },
    { class: 'Class X', present: 195, absent: 15, late: 8 },
    { class: 'Class XI', present: 175, absent: 25, late: 12 },
    { class: 'Class XII', present: 165, absent: 18, late: 7 },
  ];

  const attendanceDistribution = [
    { name: 'Present', value: 765, color: '#10b981' },
    { name: 'Absent', value: 85, color: '#ef4444' },
  ];

  const weeklyTrend = [
    { day: 'Mon', attendance: 89.2 },
    { day: 'Tue', attendance: 91.5 },
    { day: 'Wed', attendance: 88.7 },
    { day: 'Thu', attendance: 90.3 },
    { day: 'Fri', attendance: 87.9 },
    { day: 'Sat', attendance: 85.4 },
  ];

  const lowAttendanceStudents = [
    { name: 'John Doe', rollNumber: 'R001', attendance: 65.5, class: 'Class X' },
    { name: 'Jane Smith', rollNumber: 'R045', attendance: 68.2, class: 'Class XI' },
    { name: 'Bob Wilson', rollNumber: 'R023', attendance: 71.8, class: 'Class IX' },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.presentToday}</div>
            <p className="text-xs text-muted-foreground">
              {((overallStats.presentToday / overallStats.totalStudents) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.absentToday}</div>
            <p className="text-xs text-muted-foreground">
              {((overallStats.absentToday / overallStats.totalStudents) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            {overallStats.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageAttendance}%</div>
            <p className="text-xs text-green-600">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance Trend</CardTitle>
            <CardDescription>Attendance percentage over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 95]} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance Distribution</CardTitle>
            <CardDescription>Present vs Absent students</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Class-wise Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Attendance</CardTitle>
            <CardDescription>Attendance breakdown by class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#10b981" name="Present" />
                <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Pattern</CardTitle>
            <CardDescription>Attendance percentage by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[80, 95]} />
                <Tooltip />
                <Bar dataKey="attendance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Low Attendance Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Students with Low Attendance
          </CardTitle>
          <CardDescription>
            Students with attendance below 75% threshold
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowAttendanceStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {student.rollNumber} • {student.class}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium text-red-600">{student.attendance}%</div>
                    <div className="text-xs text-muted-foreground">Attendance</div>
                  </div>
                  <Progress 
                    value={student.attendance} 
                    className="w-24"
                  />
                  <Badge variant="destructive">Low</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};