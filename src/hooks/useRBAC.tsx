
import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/hooks/useTenant';

interface RBACContextType {
  hasPermission: (feature: string) => boolean;
  canAccessModule: (module: string) => boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider = ({ children }: RBACProviderProps) => {
  const { user } = useAuth();
  const { isFeatureEnabled } = useTenant();

  const rolePermissions = {
    admin: ['all'],
    teacher: [
      'attendanceManagement',
      'onlineExams', 
      'studentPortal',
      'teacherPortal',
      'messagingSystem',
      'reportCards'
    ],
    student: [
      'studentPortal',
      'onlineExams',
      'messagingSystem'
    ],
    parent: [
      'parentPortal',
      'messagingSystem',
      'reportCards'
    ]
  };

  const hasPermission = (feature: string): boolean => {
    if (!user) return false;
    
    const userPermissions = rolePermissions[user.role] || [];
    const hasRolePermission = userPermissions.includes('all') || userPermissions.includes(feature);
    const isFeatureActive = isFeatureEnabled(feature);
    
    return hasRolePermission && isFeatureActive;
  };

  const canAccessModule = (module: string): boolean => {
    const moduleFeatureMap: Record<string, string> = {
      'students': 'studentPortal',
      'teachers': 'teacherPortal', 
      'attendance': 'attendanceManagement',
      'examinations': 'onlineExams',
      'fees': 'feeManagement',
      'communications': 'messagingSystem',
      'classes': 'studentPortal', // Basic feature for classes
      'blog': 'all', // Available to all authenticated users
      'settings': 'all' // Admin only (checked separately)
    };

    const requiredFeature = moduleFeatureMap[module];
    if (!requiredFeature) return false;

    if (module === 'settings') {
      return user?.role === 'admin';
    }

    return hasPermission(requiredFeature);
  };

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher' || isAdmin;
  const isStudent = user?.role === 'student';
  const isParent = user?.role === 'parent';

  const value: RBACContextType = {
    hasPermission,
    canAccessModule,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};
