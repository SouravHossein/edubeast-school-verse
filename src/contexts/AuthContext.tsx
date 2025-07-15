import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  studentId?: string;
  avatar?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  studentId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session on app start
    const checkAuth = () => {
      const savedUser = localStorage.getItem('edubeast-user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('edubeast-user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call - replace with actual authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: `${role}-${Date.now()}`,
        email,
        fullName: `${role.charAt(0).toUpperCase()}${role.slice(1)} User`,
        role: role as User['role'],
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
        permissions: getRolePermissions(role as User['role'])
      };

      setUser(mockUser);
      localStorage.setItem('edubeast-user', JSON.stringify(mockUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.fullName}!`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `${data.role}-${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        studentId: data.studentId,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.email}`,
        permissions: getRolePermissions(data.role)
      };

      setUser(newUser);
      localStorage.setItem('edubeast-user', JSON.stringify(newUser));
      
      toast({
        title: "Registration Successful",
        description: `Welcome to EduBeast, ${newUser.fullName}!`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edubeast-user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('edubeast-user', JSON.stringify(updatedUser));
    }
  };

  const getRolePermissions = (role: User['role']): string[] => {
    const permissions = {
      admin: ['all'],
      teacher: ['view_students', 'manage_grades', 'view_reports', 'manage_assignments'],
      student: ['view_grades', 'view_assignments', 'submit_assignments'],
      parent: ['view_child_progress', 'view_announcements', 'communicate_teachers']
    };
    return permissions[role] || [];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};