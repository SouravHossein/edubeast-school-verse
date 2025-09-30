import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  to: string[];
  subject: string;
  content: string;
  type: 'welcome' | 'notification' | 'reminder' | 'announcement' | 'fee_due';
  priority?: 'low' | 'normal' | 'high';
  attachments?: string[];
}

interface BulkEmailData {
  template: EmailTemplate;
  recipients: string[];
  personalization?: Record<string, any>;
}

export const useEmailNotifications = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendEmail = async (emailData: EmailTemplate) => {
    try {
      setIsSending(true);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: emailData,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Email Sent",
        description: "Email has been sent successfully",
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
      toast({
        title: "Email Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  };

  const sendBulkEmail = async (bulkData: BulkEmailData) => {
    try {
      setIsSending(true);
      
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: bulkData,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Bulk Email Sent",
        description: `Email sent to ${bulkData.recipients.length} recipients`,
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send bulk email';
      toast({
        title: "Bulk Email Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSending(false);
    }
  };

  const sendFeeDueReminder = async (studentIds: string[], dueDate: string, amount: number) => {
    const emailData: EmailTemplate = {
      to: [], // Will be populated by the edge function
      subject: "Fee Payment Reminder",
      content: `Dear Student/Parent, this is a reminder that your fee payment of ${amount} is due on ${dueDate}. Please make the payment at your earliest convenience.`,
      type: 'fee_due',
      priority: 'high',
    };

    return await sendBulkEmail({
      template: emailData,
      recipients: studentIds,
      personalization: { dueDate, amount },
    });
  };

  const sendWelcomeEmail = async (userEmail: string, userName: string, role: string) => {
    const emailData: EmailTemplate = {
      to: [userEmail],
      subject: "Welcome to School Management System",
      content: `Dear ${userName}, welcome to our school management system! Your account has been created with ${role} privileges.`,
      type: 'welcome',
      priority: 'normal',
    };

    return await sendEmail(emailData);
  };

  const sendAnnouncementEmail = async (recipientEmails: string[], title: string, content: string) => {
    const emailData: EmailTemplate = {
      to: recipientEmails,
      subject: `Announcement: ${title}`,
      content,
      type: 'announcement',
      priority: 'normal',
    };

    return await sendEmail(emailData);
  };

  return {
    sendEmail,
    sendBulkEmail,
    sendFeeDueReminder,
    sendWelcomeEmail,
    sendAnnouncementEmail,
    isSending,
  };
};