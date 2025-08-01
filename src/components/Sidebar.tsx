import React, { useState, useEffect } from 'react';
//inline them

import {LogOut, Search, ClipboardList, Home, Users, BookOpen, GraduationCap, UserCheck, Building, Calendar, FileText, DollarSign, Clock, MessageSquare, Edit3, Library, Bus, Bed, Heart, Award, BarChart, Settings, Sun, Moon, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

// Type definitions
type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

interface User {
  fullName: string;
  role: UserRole;
  id?: string;
  email?: string;
}

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: string | null;
  isAlert?: boolean;
  feature?: string;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

interface SidebarProps {
  isCollapsed?: boolean;
}

// Mock contexts - replace with actual implementations

const useSchoolConfig = () => {
  return {
    features: {
      feeManagement: true,
      attendanceManagement: true,
      messagingSystem: true,
      libraryManagement: true,
      transportManagement: true,
      hostelManagement: true,
      healthRecords: true,
      disciplineTracking: true,
      eventManagement: true
    }
  };
};

const useNavigate = () => {
  return (path: string) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, this would use react-router's navigate
  };
};

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed: initialCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(initialCollapsed);
  const [activeItem, setActiveItem] = useState<string>('/dashboard');
  const {theme, toggleTheme } = useTheme();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user } = useAuth();
  const { features } = useSchoolConfig();
  const navigate = useNavigate();

  const isFeatureEnabled = (feature: string): boolean => {
    return features[feature as keyof typeof features] !== false;
  };

  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      { icon: Home, label: 'Dashboard', path: '/dashboard', badge: null }
    ];

    if (!user) return baseItems;

    switch (user.role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, label: 'Students', path: '/dashboard/students', badge: '2,847' },
          { icon: GraduationCap, label: 'Teachers', path: '/dashboard/teachers', badge: '156' },
          { icon: UserCheck, label: 'Approvals', path: '/dashboard/approvals', badge: '12', isAlert: true },
          { icon: Building, label: 'Staff', path: '/dashboard/staff', badge: '89' },
          { icon: BookOpen, label: 'Classes', path: '/dashboard/classes', badge: null },
          { icon: Calendar, label: 'Timetable', path: '/dashboard/timetable', badge: null },
          { icon: FileText, label: 'Exams', path: '/dashboard/examinations', badge: '5' },
          { icon: DollarSign, label: 'Fees', path: '/dashboard/fees', badge: null, feature: 'feeManagement' },
          { icon: Clock, label: 'Attendance', path: '/dashboard/attendance', badge: null, feature: 'attendanceManagement' },
          { icon: MessageSquare, label: 'Messages', path: '/dashboard/communications', badge: '24', isAlert: true, feature: 'messagingSystem' },
          { icon: Edit3, label: 'Blog', path: '/dashboard/blog', badge: null },
          { icon: Library, label: 'Library', path: '/dashboard/library', badge: null, feature: 'libraryManagement' },
          { icon: Bus, label: 'Transport', path: '/dashboard/transport', badge: null, feature: 'transportManagement' },
          { icon: Bed, label: 'Hostel', path: '/dashboard/hostel', badge: null, feature: 'hostelManagement' },
          { icon: Heart, label: 'Health', path: '/dashboard/health', badge: null, feature: 'healthRecords' },
          { icon: Award, label: 'Discipline', path: '/dashboard/discipline', badge: null, feature: 'disciplineTracking' },
          { icon: BarChart, label: 'Analytics', path: '/dashboard/reports', badge: null },
          { icon: Settings, label: 'Settings', path: '/dashboard/settings', badge: null }
        ];

      case 'teacher':
        return [
          ...baseItems,
          { icon: Users, label: 'My Students', path: '/dashboard/students', badge: '156' },
          { icon: BookOpen, label: 'My Classes', path: '/dashboard/classes', badge: '8' },
          { icon: Calendar, label: 'Schedule', path: '/dashboard/schedule', badge: null },
          { icon: FileText, label: 'Assignments', path: '/dashboard/assignments', badge: '15' },
          { icon: ClipboardList, label: 'Gradebook', path: '/dashboard/grades', badge: '32', isAlert: true },
          { icon: Clock, label: 'Attendance', path: '/dashboard/attendance', badge: null, feature: 'attendanceManagement' },
          { icon: MessageSquare, label: 'Messages', path: '/dashboard/communications', badge: '7', feature: 'messagingSystem' },
          { icon: Edit3, label: 'Blog Posts', path: '/dashboard/blog', badge: null },
          { icon: BarChart, label: 'Reports', path: '/dashboard/reports', badge: null }
        ];

      case 'student':
        return [
          ...baseItems,
          { icon: BookOpen, label: 'My Courses', path: '/dashboard/courses', badge: '6' },
          { icon: Calendar, label: 'Schedule', path: '/dashboard/schedule', badge: null },
          { icon: FileText, label: 'Assignments', path: '/dashboard/assignments', badge: '3', isAlert: true },
          { icon: ClipboardList, label: 'Grades', path: '/dashboard/grades', badge: null },
          { icon: Clock, label: 'Attendance', path: '/dashboard/attendance', badge: null, feature: 'attendanceManagement' },
          { icon: MessageSquare, label: 'Messages', path: '/dashboard/communications', badge: '2', feature: 'messagingSystem' },
          { icon: Edit3, label: 'Blog Posts', path: '/dashboard/blog', badge: null },
          { icon: Library, label: 'Library', path: '/dashboard/library', badge: null, feature: 'libraryManagement' },
          { icon: DollarSign, label: 'Fees', path: '/dashboard/fees', badge: null, feature: 'feeManagement' }
        ];

      case 'parent':
        return [
          ...baseItems,
          { icon: Users, label: "Child's Progress", path: '/dashboard/progress', badge: null },
          { icon: ClipboardList, label: 'Grades & Reports', path: '/dashboard/grades', badge: '2' },
          { icon: Clock, label: 'Attendance', path: '/dashboard/attendance', badge: null, feature: 'attendanceManagement' },
          { icon: FileText, label: 'Assignments', path: '/dashboard/assignments', badge: '5' },
          { icon: MessageSquare, label: 'Messages', path: '/dashboard/communications', badge: '1', feature: 'messagingSystem' },
          { icon: DollarSign, label: 'Fee Payments', path: '/dashboard/fees', badge: '1', isAlert: true, feature: 'feeManagement' },
          { icon: Calendar, label: 'Events', path: '/dashboard/events', badge: null, feature: 'eventManagement' }
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems().filter(item => 
    !item.feature || isFeatureEnabled(item.feature)
  );

  const getGroupedItems = (): NavigationGroup[] => {
    if (!user) {
      return [{ title: 'Main', items: navigationItems }];
    }

    switch (user.role) {
      case 'admin':
        return [
          {
            title: 'Main',
            items: navigationItems.slice(0, 1)
          },
          {
            title: 'Management',
            items: navigationItems.slice(1, 8)
          },
          {
            title: 'Academic',
            items: navigationItems.slice(8, 12)
          },
          {
            title: 'Facilities',
            items: navigationItems.slice(12, 16)
          },
          {
            title: 'System',
            items: navigationItems.slice(16)
          }
        ];
      case 'teacher':
        return [
          {
            title: 'Main',
            items: navigationItems.slice(0, 1)
          },
          {
            title: 'Teaching',
            items: navigationItems.slice(1, 6)
          },
          {
            title: 'Communication',
            items: navigationItems.slice(6, 8)
          },
          {
            title: 'Reports',
            items: navigationItems.slice(8)
          }
        ];
      default:
        return [
          {
            title: 'Main',
            items: navigationItems.slice(0, 1)
          },
          {
            title: 'Academic',
            items: navigationItems.slice(1, 5)
          },
          {
            title: 'Services',
            items: navigationItems.slice(5)
          }
        ];
    }
  };

  const groupedItems = getGroupedItems();

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    navigate(path);
  };

  const handleSignOut = () => {
    // Add sign out logic here
    console.log('Signing out...');
  };

  const getUserInitials = (fullName: string): string => {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) {
    return (
      <div className="w-80 h-screen bg-background border-r border-border flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground mb-2">Loading...</div>
          <div className="text-sm text-muted-foreground">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TooltipProvider>
        <div className={`bg-background border-r border-border transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-80'} h-screen flex flex-col shadow-lg`}>
          
          {/* Header */}
          <div className="relative p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      EduVerse
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Management System
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {!isCollapsed && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTheme()}
                      className="h-8 w-8 p-0"
                    >
                      {theme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
                      <Bell className="w-4 h-4" />
                      <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-destructive" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="h-8 w-8 p-0"
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold">
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.fullName}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role} • Online
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {!isCollapsed && (
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search menu..."
                  className="pl-10 h-9"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {groupedItems.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                {!isCollapsed && (
                  <h3 className="px-4 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1 px-2">
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeItem === item.path;
                    
                    const NavigationButton = (
                      <Button
                        key={item.path}
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleNavigation(item.path)}
                        className={`w-full justify-center h-10 ${
                          isActive
                            ? 'bg-primary hover:bg-primary/90 text-white shadow-md'
                            : 'hover:bg-accent text-foreground'
                        } ${isCollapsed ? 'px-2' : 'px-3'}`}
                        onMouseEnter={() => setHoveredItem(item.path)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <IconComponent className="w-5 h-5 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="ml-3 text-sm font-medium flex-1 text-left">
                              {item.label}
                            </span>
                            {item.badge && (
                              <Badge 
                                variant={item.isAlert ? "destructive" : "secondary"}
                                className={`ml-2 ${isActive && !item.isAlert ? 'bg-white/20 text-white hover:bg-white/30' : ''}`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Button>
                    );

                    if (isCollapsed) {
                      return (
                        <Tooltip key={item.path}>
                          <TooltipTrigger asChild>
                            {NavigationButton}
                          </TooltipTrigger>
                          <TooltipContent side="right" className="flex items-center space-x-2">
                            <span>{item.label}</span>
                            {item.badge && (
                              <Badge variant={item.isAlert ? "destructive" : "secondary"}>
                                {item.badge}
                              </Badge>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return NavigationButton;
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className={`w-full text-destructive hover:text-destructive hover:bg-destructive/10 ${
                isCollapsed ? 'px-2' : 'justify-start px-3'
              }`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="ml-3 text-sm font-medium">Sign Out</span>}
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};