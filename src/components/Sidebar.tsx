
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTenant } from '@/hooks/useTenant';
import { useRBAC } from '@/hooks/useRBAC';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  ClipboardCheck,
  BookOpen,
  DollarSign,
  MessageSquare,
  FileText,
  Settings,
  UserCheck,
  School
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and analytics',
    module: 'dashboard'
  },
  {
    title: 'Students',
    href: '/dashboard/students',
    icon: Users,
    description: 'Student management',
    module: 'students'
  },
  {
    title: 'Teachers',
    href: '/dashboard/teachers',
    icon: GraduationCap,
    description: 'Staff management',
    module: 'teachers'
  },
  {
    title: 'Classes & Timetable',
    href: '/dashboard/classes',
    icon: Calendar,
    description: 'Class scheduling',
    module: 'classes'
  },
  {
    title: 'Attendance',
    href: '/dashboard/attendance',
    icon: ClipboardCheck,
    description: 'Attendance tracking',
    module: 'attendance'
  },
  {
    title: 'Examinations',
    href: '/dashboard/examinations',
    icon: BookOpen,
    description: 'Exam management',
    module: 'examinations'
  },
  {
    title: 'Fees',
    href: '/dashboard/fees',
    icon: DollarSign,
    description: 'Fee management',
    module: 'fees'
  },
  {
    title: 'Communications',
    href: '/dashboard/communications',
    icon: MessageSquare,
    description: 'Messaging system',
    module: 'communications'
  },
  {
    title: 'Blog',
    href: '/dashboard/blog',
    icon: FileText,
    description: 'Content management',
    module: 'blog'
  }
];

const adminItems = [
  {
    title: 'User Approvals',
    href: '/dashboard/approvals',
    icon: UserCheck,
    description: 'Manage user requests',
    module: 'approvals'
  },
  {
    title: 'School Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'System configuration',
    module: 'settings'
  }
];

export const Sidebar = () => {
  const location = useLocation();
  const { tenant } = useTenant();
  const { canAccessModule, isAdmin } = useRBAC();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  // Filter navigation items based on permissions
  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.module === 'dashboard') return true; // Dashboard always visible
    return canAccessModule(item.module);
  });

  // Filter admin items based on role
  const filteredAdminItems = adminItems.filter(item => {
    if (item.module === 'settings' || item.module === 'approvals') {
      return isAdmin;
    }
    return canAccessModule(item.module);
  });

  return (
    <div className="flex h-full flex-col bg-background border-r w-64">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <School className="h-6 w-6" />
          <span className="truncate">{tenant?.name || 'School Portal'}</span>
        </Link>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {filteredNavigationItems.length > 0 && (
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
          )}

          {filteredAdminItems.length > 0 && (
            <>
              <Separator />
              <div className="mb-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Administration</h4>
                <nav className="grid gap-1">
                  {filteredAdminItems.map((item) => (
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
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
