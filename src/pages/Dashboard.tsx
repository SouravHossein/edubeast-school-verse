import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useActivityLog } from '@/hooks/useActivityLog';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart, 
  TrendingUp,
  Clock,
  Bell,
  CheckCircle,
  AlertCircle,
  Star,
  DollarSign,
  GraduationCap
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      default:
        return <div>Dashboard content not available</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in your {user?.role} portal today.
          </p>
        </div>
        <Badge variant="secondary" className="text-primary capitalize">
          {user?.role} Account
        </Badge>
      </div>

      {getDashboardContent()}
    </div>
  );
};

const AdminDashboard = () => {
  const { stats, recentActivities, loading } = useDashboardData();
  const { logActivity } = useActivityLog();

  const dashboardStats = [
    { 
      title: 'Total Students', 
      value: loading ? '...' : stats.totalStudents.toString(), 
      change: stats.recentEnrollments > 0 ? `+${stats.recentEnrollments}` : '0', 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Active Teachers', 
      value: loading ? '...' : stats.totalTeachers.toString(), 
      change: '+3%', 
      icon: GraduationCap, 
      color: 'text-green-600' 
    },
    { 
      title: 'Active Classes', 
      value: loading ? '...' : stats.totalClasses.toString(), 
      change: '0%', 
      icon: BookOpen, 
      color: 'text-purple-600' 
    },
    { 
      title: 'Attendance Rate', 
      value: loading ? '...' : `${stats.attendanceRate}%`, 
      change: '+2%', 
      icon: TrendingUp, 
      color: 'text-orange-600' 
    },
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {activity.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                    {activity.type === 'warning' && <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />}
                    {activity.type === 'info' && <Bell className="h-5 w-5 text-blue-600 mt-0.5" />}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Class
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Event
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const TeacherDashboard = () => {
  const teacherStats = [
    { title: 'My Classes', value: '5', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Total Students', value: '142', icon: Users, color: 'text-green-600' },
    { title: 'Pending Grades', value: '23', icon: Star, color: 'text-orange-600' },
    { title: 'Today\'s Classes', value: '3', icon: Clock, color: 'text-purple-600' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teacherStats.map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                <div>
                  <p className="font-medium">Mathematics - Grade 10A</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 10:00 AM</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Physics - Grade 11B</p>
                  <p className="text-sm text-muted-foreground">11:00 AM - 12:00 PM</p>
                </div>
                <Badge variant="outline">Upcoming</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Grade Assignments
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const StudentDashboard = () => {
  const studentStats = [
    { title: 'Enrolled Courses', value: '8', icon: BookOpen, color: 'text-blue-600' },
    { title: 'Assignments Due', value: '5', icon: Clock, color: 'text-orange-600' },
    { title: 'Average Grade', value: 'A-', icon: Star, color: 'text-green-600' },
    { title: 'Attendance', value: '96%', icon: CheckCircle, color: 'text-purple-600' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentStats.map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
                <div>
                  <p className="font-medium">Math Assignment #3</p>
                  <p className="text-sm text-muted-foreground">Due: Tomorrow</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50">
                <div>
                  <p className="font-medium">Physics Lab Report</p>
                  <p className="text-sm text-muted-foreground">Due: In 3 days</p>
                </div>
                <Badge variant="secondary">Due Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Mathematics Quiz</span>
                <Badge className="bg-green-100 text-green-800">A</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>English Essay</span>
                <Badge className="bg-blue-100 text-blue-800">B+</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Physics Test</span>
                <Badge className="bg-green-100 text-green-800">A-</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const ParentDashboard = () => {
  const parentStats = [
    { title: 'Children', value: '2', icon: Users, color: 'text-blue-600' },
    { title: 'Avg. Attendance', value: '94%', icon: CheckCircle, color: 'text-green-600' },
    { title: 'Upcoming Events', value: '3', icon: Calendar, color: 'text-purple-600' },
    { title: 'Pending Fees', value: '$250', icon: AlertCircle, color: 'text-orange-600' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {parentStats.map((stat, index) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Children's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Emma Johnson - Grade 8</h4>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Average: A- | Attendance: 96%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Jake Johnson - Grade 5</h4>
                  <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Average: B+ | Attendance: 92%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View School Calendar
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Message Teachers
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart className="h-4 w-4 mr-2" />
              View Progress Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;