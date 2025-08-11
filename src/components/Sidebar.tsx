
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTenant } from '@/hooks/useTenant';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  BookOpen,
  DollarSign,
  MessageSquare,
  Camera,
  FileText,
  Settings,
  BarChart3,
  UserCheck,
  Bell,
  School
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    title: 'Students',
    href: '/dashboard/students',
    icon: Users,
    description: 'Student management',
    feature: 'studentPortal'
  },
  {
    title: 'Teachers',
    href: '/dashboard/teachers',
    icon: GraduationCap,
    description: 'Staff management',
    feature: 'teacherPortal'
  },
  {
    title: 'Classes & Timetable',
    href: '/dashboard/classes',
    icon: Calendar,
    description: 'Class scheduling'
  },
  {
    title: 'Attendance',
    href: '/dashboard/attendance',
    icon: ClipboardCheck,
    description: 'Attendance tracking',
    feature: 'attendanceManagement'
  },
  {
    title: 'Examinations',
    href: '/dashboard/examinations',
    icon: BookOpen,
    description: 'Exam management',
    feature: 'onlineExams'
  },
  {
    title: 'Fees',
    href: '/dashboard/fees',
    icon: DollarSign,
    description: 'Fee management',
    feature: 'feeManagement'
  },
  {
    title: 'Communications',
    href: '/dashboard/communications',
    icon: MessageSquare,
    description: 'Messaging system',
    feature: 'messagingSystem'
  },
  {
    title: 'Blog',
    href: '/dashboard/blog',
    icon: FileText,
    description: 'Content management'
  }
];

const adminItems = [
  {
    title: 'User Approvals',
    href: '/dashboard/approvals',
    icon: UserCheck,
    description: 'Manage user requests'
  },
  {
    title: 'School Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'System configuration'
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const { isFeatureEnabled, tenant } = useTenant();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.feature) {
      return isFeatureEnabled(item.feature);
    }
    return true;
  });

  return (
    <div className="flex h-full flex-col bg-background border-r">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <School className="h-6 w-6" />
          <span className="truncate">{tenant?.name || 'School'}</span>
        </Link>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          <div className="mb-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Main Menu</h4>
            <nav className="grid gap-1">
              {filteredNavigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start gap-2 h-auto p-3",
                    isActive(item.href) && "bg-secondary"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>

          <Separator />

          <div className="mb-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Administration</h4>
            <nav className="grid gap-1">
              {adminItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "justify-start gap-2 h-auto p-3",
                    isActive(item.href) && "bg-secondary"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
