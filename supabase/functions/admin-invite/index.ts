import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

interface AdminInviteRequest {
  email: string;
  role: 'admin' | 'super_admin';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the user from the request
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is super admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, admin_level')
      .eq('user_id', user.id)
      .single();

    if (!profile || profile.role !== 'admin' || profile.admin_level !== 'super_admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Super admin access required.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, role }: AdminInviteRequest = await req.json();

    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: 'Email and role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (existingProfile) {
      return new Response(
        JSON.stringify({ error: 'User with this email already exists' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate invitation token
    const invitationToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    // Create invitation record
    const { error: inviteError } = await supabase
      .from('admin_invitations')
      .insert({
        email,
        invitation_token: invitationToken,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
        role,
      });

    if (inviteError) {
      console.error('Failed to create invitation:', inviteError);
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send invitation email (you can integrate with your email service here)
    const invitationUrl = `${Deno.env.get('SITE_URL')}/admin-portal-xyz123?token=${invitationToken}&email=${encodeURIComponent(email)}`;
    
    console.log(`Invitation sent to ${email}: ${invitationUrl}`);
    
    // Log the admin action
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: user.id,
        action: 'admin_invitation_created',
        resource_type: 'admin_invitation',
        resource_id: email,
        metadata: {
          role,
          expires_at: expiresAt.toISOString(),
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin invitation sent successfully',
        invitationUrl // Remove this in production
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in admin-invite function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);