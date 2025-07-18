import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PendingUser {
  id: string;
  fullName: string;
  email: string;
  role: 'teacher' | 'student' | 'parent';
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  studentId?: string;
  parentStudentId?: string; // For parents linking to students
  additionalInfo?: {
    qualifications?: string;
    experience?: string;
    subjects?: string[];
    classes?: string[];
    phone?: string;
    address?: string;
  };
}

export interface ApprovedUser {
  id: string;
  fullName: string;
  email: string;
  role: 'teacher' | 'student' | 'parent';
  studentId?: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
  linkedStudents?: string[]; // For parents
  tempPassword: string;
  approvedAt: string;
  isFirstLogin: boolean;
}

interface ApprovalContextType {
  pendingUsers: PendingUser[];
  approvedUsers: ApprovedUser[];
  submitApplication: (userData: Omit<PendingUser, 'id' | 'status' | 'appliedAt'>) => Promise<boolean>;
  approveUser: (userId: string, assignments?: { classes?: string[]; subjects?: string[]; linkedStudents?: string[] }) => Promise<boolean>;
  rejectUser: (userId: string, reason?: string) => Promise<boolean>;
  sendApprovalEmail: (user: ApprovedUser) => Promise<boolean>;
  isApplicationSubmitted: (email: string) => boolean;
}

const ApprovalContext = createContext<ApprovalContextType | undefined>(undefined);

export const ApprovalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUser[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved data
    const savedPending = localStorage.getItem('edubeast-pending-users');
    const savedApproved = localStorage.getItem('edubeast-approved-users');
    
    if (savedPending) {
      try {
        setPendingUsers(JSON.parse(savedPending));
      } catch (error) {
        console.error('Error loading pending users:', error);
      }
    }
    
    if (savedApproved) {
      try {
        setApprovedUsers(JSON.parse(savedApproved));
      } catch (error) {
        console.error('Error loading approved users:', error);
      }
    }
  }, []);

  const submitApplication = async (userData: Omit<PendingUser, 'id' | 'status' | 'appliedAt'>): Promise<boolean> => {
    try {
      // Check if email already exists
      const existingPending = pendingUsers.find(u => u.email === userData.email);
      const existingApproved = approvedUsers.find(u => u.email === userData.email);
      
      if (existingPending || existingApproved) {
        toast({
          title: "Application Error",
          description: "An application with this email already exists.",
          variant: "destructive",
        });
        return false;
      }

      const newApplication: PendingUser = {
        ...userData,
        id: `pending-${Date.now()}`,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };

      const updatedPending = [...pendingUsers, newApplication];
      setPendingUsers(updatedPending);
      localStorage.setItem('edubeast-pending-users', JSON.stringify(updatedPending));
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted for review. You'll receive an email notification once approved.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const approveUser = async (
    userId: string, 
    assignments?: { classes?: string[]; subjects?: string[]; linkedStudents?: string[] }
  ): Promise<boolean> => {
    try {
      const userIndex = pendingUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) return false;

      const user = pendingUsers[userIndex];
      const tempPassword = generateTempPassword();
      const studentId = user.role === 'student' ? generateStudentId() : user.studentId;

      const approvedUser: ApprovedUser = {
        id: `approved-${Date.now()}`,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentId,
        assignedClasses: assignments?.classes || [],
        assignedSubjects: assignments?.subjects || [],
        linkedStudents: assignments?.linkedStudents || [],
        tempPassword,
        approvedAt: new Date().toISOString(),
        isFirstLogin: true,
      };

      // Remove from pending and add to approved
      const updatedPending = pendingUsers.filter(u => u.id !== userId);
      const updatedApproved = [...approvedUsers, approvedUser];
      
      setPendingUsers(updatedPending);
      setApprovedUsers(updatedApproved);
      
      localStorage.setItem('edubeast-pending-users', JSON.stringify(updatedPending));
      localStorage.setItem('edubeast-approved-users', JSON.stringify(updatedApproved));

      // Send approval email
      await sendApprovalEmail(approvedUser);

      toast({
        title: "User Approved",
        description: `${user.fullName} has been approved and notified via email.`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectUser = async (userId: string, reason?: string): Promise<boolean> => {
    try {
      const userIndex = pendingUsers.findIndex(u => u.id === userId);
      if (userIndex === -1) return false;

      const user = pendingUsers[userIndex];
      const updatedPending = pendingUsers.filter(u => u.id !== userId);
      
      setPendingUsers(updatedPending);
      localStorage.setItem('edubeast-pending-users', JSON.stringify(updatedPending));

      // In a real app, send rejection email here
      toast({
        title: "User Rejected",
        description: `${user.fullName}'s application has been rejected.`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: "Failed to reject user. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const sendApprovalEmail = async (user: ApprovedUser): Promise<boolean> => {
    try {
      // In a real implementation, this would send an actual email
      // For demo purposes, we'll just simulate the email content
      const emailContent = `
Subject: Account Approved - Welcome to EduBeast

Dear ${user.fullName},

Your ${user.role} account has been approved! Here are your login credentials:

Email: ${user.email}
Temporary Password: ${user.tempPassword}
${user.studentId ? `Student ID: ${user.studentId}` : ''}

Please log in to your account and change your password on first login.

Dashboard URL: ${window.location.origin}/dashboard

Best regards,
EduBeast Administration Team
      `;

      console.log('Email would be sent:', emailContent);
      
      // Simulate email delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const isApplicationSubmitted = (email: string): boolean => {
    return pendingUsers.some(u => u.email === email) || approvedUsers.some(u => u.email === email);
  };

  const generateTempPassword = (): string => {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
  };

  const generateStudentId = (): string => {
    const year = new Date().getFullYear().toString().slice(-2);
    const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `STU${year}${number}`;
  };

  return (
    <ApprovalContext.Provider
      value={{
        pendingUsers,
        approvedUsers,
        submitApplication,
        approveUser,
        rejectUser,
        sendApprovalEmail,
        isApplicationSubmitted,
      }}
    >
      {children}
    </ApprovalContext.Provider>
  );
};

export const useApproval = () => {
  const context = useContext(ApprovalContext);
  if (context === undefined) {
    throw new Error('useApproval must be used within an ApprovalProvider');
  }
  return context;
};