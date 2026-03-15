import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  tenantId?: string;
  studentId?: string;
  avatar?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
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

const getRolePermissions = (role: User['role']): string[] => {
  const permissions: Record<string, string[]> = {
    admin: ['all'],
    teacher: ['view_students', 'manage_grades', 'view_reports', 'manage_assignments'],
    student: ['view_grades', 'view_assignments', 'submit_assignments'],
    parent: ['view_child_progress', 'view_announcements', 'communicate_teachers'],
  };
  return permissions[role] || [];
};

const mapProfile = (supabaseUser: SupabaseUser, profile: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  fullName: profile?.full_name || supabaseUser.user_metadata?.full_name || '',
  role: profile?.role || supabaseUser.user_metadata?.role || 'admin',
  tenantId: profile?.tenant_id || undefined,
  avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${supabaseUser.email}`,
  permissions: getRolePermissions(profile?.role || 'admin'),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up listener BEFORE getSession
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        // Use setTimeout to avoid potential deadlock with Supabase client
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', newSession.user.id)
            .single();

          setUser(mapProfile(newSession.user, profile));
          setIsLoading(false);
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!existingSession) {
        setIsLoading(false);
      }
      // onAuthStateChange will handle the rest
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, _role?: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
        return false;
      }
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      return true;
    } catch {
      toast({ title: 'Login Failed', description: 'An unexpected error occurred.', variant: 'destructive' });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: data.fullName,
            role: data.role,
          },
        },
      });

      if (error) {
        toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
        return false;
      }

      toast({ title: 'Registration Successful', description: `Welcome to EduBeast, ${data.fullName}!` });
      return true;
    } catch {
      toast({ title: 'Registration Failed', description: 'Something went wrong.', variant: 'destructive' });
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session,
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
