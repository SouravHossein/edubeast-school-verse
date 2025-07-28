
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSchoolConfig } from '@/contexts/SchoolConfigContext';
import { 
  Home,
  Users,
  BookOpen,
  Calendar,
  BarChart,
  Settings,
  GraduationCap,
  FileText,
  MessageSquare,
  DollarSign,
  Clock,
  Shield,
  UserCheck,
  ClipboardList,
  Building,
  Bus,
  Bed,
  Library,
  Award,
  Heart,
  LogOut,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const { user, logout } = useAuth();
  const { isFeatureEnabled } = useSchoolConfig();

  const getNavigationItems = () => {
    const baseItems: Array<{ icon: any; label: string; path: string; feature?: string }> = [
      { icon: Home, label: 'Dashboard', path: '/dashboard' }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, label: 'Student Management', path: '/dashboard/students' },
          { icon: GraduationCap, label: 'Teacher Management', path: '/dashboard/teachers' },
          { icon: UserCheck, label: 'User Approvals', path: '/dashboard/approvals' },
          { icon: Building, label: 'Staff Management', path: '/dashboard/staff' },
          { icon: BookOpen, label: 'Class Management', path: '/dashboard/classes' },
          { icon: Calendar, label: 'Timetable', path: '/dashboard/timetable' },
          { icon: FileText, label: 'Exams & Results', path: '/dashboard/examinations' },
          { icon: DollarSign, label: 'Fee Management', path: '/dashboard/fees', feature: 'feeManagement' },
          { icon: Clock, label: 'Attendance', path: '/dashboard/attendance', feature: 'attendanceManagement' },
          { icon: MessageSquare, label: 'Communications', path: '/dashboard/communications', feature: 'messagingSystem' },
          { icon: Edit3, label: 'Blog Management', path: '/dashboard/blog' },
          { icon: Library, label: 'Library', path: '/dashboard/library', feature: 'libraryManagement' },
          { icon: Bus, label: 'Transport', path: '/dashboard/transport', feature: 'transportManagement' },
          { icon: Bed, label: 'Hostel', path: '/dashboard/hostel', feature: 'hostelManagement' },
          { icon: Heart, label: 'Health Records', path: '/dashboard/health', feature: 'healthRecords' },
          { icon: Award, label: 'Discipline', path: '/dashboard/discipline', feature: 'disciplineTracking' },
          { icon: BarChart, label: 'Reports & Analytics', path: '/dashboard/reports' },
          { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
        ];

      case 'teacher':
        return [
          ...baseItems,
          { icon: Users, label: 'My Students', path: '/dashboard/students' },
          { icon: BookOpen, label: 'My Classes', path: '/dashboard/classes' },
          { icon: Calendar, label: 'My Schedule', path: '/dashboard/schedule' },
          { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
          { icon: ClipboardList, label: 'Gradebook', path: '/dashboard/grades' },
          { icon: Clock, label: 'Attendance', path: '/dashboard/attendance', feature: 'attendanceManagement' },
          { icon: MessageSquare, label: 'Communications', path: '/dashboard/communications', feature: 'messagingSystem' },
          { icon: Edit3, label: 'Blog Posts', path: '/dashboard/blog' },
          { icon: BarChart, label: 'Reports', path: '/dashboard/reports' },
        ];

      case 'student':
        return [
          ...baseItems,
          { icon: BookOpen, label: 'My Courses', path: '/dashboard/courses' },
          { icon: Calendar, label: 'Schedule', path: '/dashboard/schedule' },
          { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
          { icon: ClipboardList, label: 'Grades', path: '/dashboard/grades' },
          { icon: Clock, label: 'Attendance', path: '/dashboard/attendance', feature: 'attendanceManagement' },
          { icon: MessageSquare, label: 'Messages', path: '/dashboard/communications', feature: 'messagingSystem' },
          { icon: Edit3, label: 'Blog Posts', path: '/dashboard/blog' },
          { icon: Library, label: 'Library', path: '/dashboard/library', feature: 'libraryManagement' },
          { icon: DollarSign, label: 'Fees', path: '/dashboard/fees', feature: 'feeManagement' },
        ];

      case 'parent':
        return [
          ...baseItems,
          { icon: Users, label: "Child's Progress", path: '/dashboard/progress' },
          { icon: ClipboardList, label: 'Grades & Reports', path: '/dashboard/grades' },
          { icon: Clock, label: 'Attendance', path: '/dashboard/attendance', feature: 'attendanceManagement' },
          { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
          { icon: MessageSquare, label: 'Communications', path: '/dashboard/communications', feature: 'messagingSystem' },
          { icon: DollarSign, label: 'Fee Payments', path: '/dashboard/fees', feature: 'feeManagement' },
          { icon: Calendar, label: 'Events', path: '/dashboard/events', feature: 'eventManagement' },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems().filter(item => 
    !item.feature || isFeatureEnabled(item.feature as any)
  );

  return (
    <div className={`bg-card border-r transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-primary">EduBeast</span>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user?.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={logout}
          className={`w-full justify-start space-x-3 text-muted-foreground hover:text-foreground hover:bg-muted ${
            isCollapsed ? 'px-3' : ''
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};
