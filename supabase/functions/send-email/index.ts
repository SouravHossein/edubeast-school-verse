import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

interface EmailRequest {
  to: string[];
  subject: string;
  content: string;
  type: 'welcome' | 'notification' | 'reminder' | 'announcement' | 'fee_due';
  priority?: 'low' | 'normal' | 'high';
  attachments?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, content, type, priority = 'normal' }: EmailRequest = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Create email template based on type
    const getEmailTemplate = (content: string, type: string) => {
      const baseStyle = `
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      `;

      const headerColors: Record<string, string> = {
        welcome: '#3b82f6',
        notification: '#10b981', 
        reminder: '#f59e0b',
        announcement: '#8b5cf6',
        fee_due: '#ef4444',
      };

      return `
        <div style="${baseStyle}">
          <div style="background: ${headerColors[type] || '#3b82f6'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">School Management System</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <div style="background: white; padding: 20px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              ${content.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
              <p>Best regards,<br>School Management Team</p>
            </div>
          </div>
        </div>
      `;
    };

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'School Management <noreply@school.example.com>',
        to,
        subject,
        html: getEmailTemplate(content, type),
        headers: {
          'X-Priority': priority === 'high' ? '1' : priority === 'low' ? '5' : '3',
        },
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(result.message || 'Failed to send email');
    }

    console.log('Email sent successfully:', result);

    return new Response(
      JSON.stringify({
        success: true,
        id: result.id,
        message: 'Email sent successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send email',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});