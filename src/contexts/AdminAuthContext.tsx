import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminUser extends User {
  profile?: {
    full_name: string;
    role: string;
    admin_level?: string;
    email_verified_at?: string;
  };
}

interface AdminAuthContextType {
  user: AdminUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, invitationToken?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendAdminInvitation: (email: string, role: 'admin' | 'super_admin') => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>;
  logAdminAction: (action: string, resourceType?: string, resourceId?: string, metadata?: any) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile with admin data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          const adminUser: AdminUser = {
            ...session.user,
            profile
          };

          setUser(adminUser);

          // Log login action if it's a sign in event
          if (event === 'SIGNED_IN') {
            await logAdminActionInternal('admin_login');
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logAdminActionInternal = async (action: string, resourceType?: string, resourceId?: string, metadata: any = {}) => {
    try {
      // Use a simple approach for now - insert directly into audit logs if the table exists
      console.log('Admin action logged:', { action, resourceType, resourceId, metadata });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        return { success: false, error: 'Access denied. Admin privileges required.' };
      }

      toast({
        title: "Login Successful",
        description: "Welcome back to the admin portal.",
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, invitationToken?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      let adminLevel = 'admin';

      // Check if this is the first admin (super admin)
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (count === 0) {
        adminLevel = 'super_admin';
      } else if (!invitationToken) {
        return { success: false, error: 'Registration requires an invitation token.' };
      }

      const redirectUrl = `${window.location.origin}/admin-portal-xyz123/verify-email`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            admin_level: adminLevel,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logAdminActionInternal('admin_logout');
      await supabase.auth.signOut();
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/admin-portal-xyz123/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const sendAdminInvitation = async (email: string, role: 'admin' | 'super_admin' = 'admin'): Promise<{ success: boolean; error?: string }> => {
    try {
      // For now, just generate an invitation URL
      const invitationToken = crypto.randomUUID();
      const invitationUrl = `${window.location.origin}/admin-portal-xyz123?token=${invitationToken}&email=${encodeURIComponent(email)}`;

      await logAdminActionInternal('admin_invitation_sent', 'admin_invitation', email, { role });

      toast({
        title: "Invitation Generated",
        description: `Invitation URL: ${invitationUrl}`,
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const verifyEmail = async (token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified.",
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logAdminAction = async (action: string, resourceType?: string, resourceId?: string, metadata?: any): Promise<void> => {
    await logAdminActionInternal(action, resourceType, resourceId, metadata);
  };

  const isSuperAdmin = user?.profile?.role === 'admin' && 
    (user?.user_metadata?.admin_level === 'super_admin' || user?.profile?.admin_level === 'super_admin');

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!user && !!session && user?.profile?.role === 'admin',
        isSuperAdmin,
        login,
        register,
        logout,
        requestPasswordReset,
        sendAdminInvitation,
        verifyEmail,
        logAdminAction,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};