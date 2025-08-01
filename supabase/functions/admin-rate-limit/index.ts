import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

interface RateLimitRequest {
  identifier: string; // email or IP
  action: 'failed_login' | 'successful_login';
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { identifier, action }: RateLimitRequest = await req.json();

    if (!identifier || !action) {
      return new Response(
        JSON.stringify({ error: 'Identifier and action are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create rate limit record
    let { data: rateLimit } = await supabase
      .from('admin_rate_limits')
      .select('*')
      .eq('identifier', identifier)
      .single();

    if (!rateLimit) {
      const { data: newRecord } = await supabase
        .from('admin_rate_limits')
        .insert({
          identifier,
          attempt_count: 0,
          last_attempt: new Date().toISOString(),
        })
        .select()
        .single();
      
      rateLimit = newRecord;
    }

    if (action === 'failed_login') {
      const newAttemptCount = (rateLimit?.attempt_count || 0) + 1;
      let blockedUntil = null;

      if (newAttemptCount >= MAX_ATTEMPTS) {
        const lockoutTime = new Date();
        lockoutTime.setMinutes(lockoutTime.getMinutes() + LOCKOUT_DURATION_MINUTES);
        blockedUntil = lockoutTime.toISOString();
      }

      await supabase
        .from('admin_rate_limits')
        .update({
          attempt_count: newAttemptCount,
          last_attempt: new Date().toISOString(),
          blocked_until: blockedUntil,
        })
        .eq('identifier', identifier);

      return new Response(
        JSON.stringify({ 
          success: true, 
          attemptCount: newAttemptCount,
          isBlocked: !!blockedUntil,
          blockedUntil 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'successful_login') {
      // Reset rate limit on successful login
      await supabase
        .from('admin_rate_limits')
        .update({
          attempt_count: 0,
          last_attempt: new Date().toISOString(),
          blocked_until: null,
        })
        .eq('identifier', identifier);

      return new Response(
        JSON.stringify({ success: true, reset: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in admin-rate-limit function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);