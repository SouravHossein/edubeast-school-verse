import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { tenantId, action } = await req.json();
    console.log(`Zoom ${action} for tenant: ${tenantId}`);

    // Get integration config
    const { data: integration } = await supabase
      .from('integrations')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('service_name', 'zoom')
      .single();

    if (!integration || !integration.enabled) {
      return new Response(JSON.stringify({ error: 'Zoom integration not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const config = integration.config_json;
    const accessToken = config.oauth_tokens?.access_token;

    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'No valid access token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();

    if (action === 'create_meeting') {
      const { topic, start_time, duration, agenda, recurrence } = await req.json();

      // Check quota
      const quotaCheck = await supabase.rpc('check_integration_quota', {
        p_tenant_id: tenantId,
        p_service_name: 'zoom',
        p_quota_type: 'meetings_per_hour',
        p_increment: 1
      });

      if (!quotaCheck.data) {
        return new Response(JSON.stringify({ error: 'Meeting quota exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const meetingData = {
        topic,
        type: recurrence ? 8 : 2, // 2 = scheduled, 8 = recurring
        start_time,
        duration,
        agenda,
        settings: {
          host_video: true,
          participant_video: true,
          cn_meeting: false,
          in_meeting: false,
          join_before_host: true,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: 'both',
          auto_recording: 'cloud',
          enforce_login: false,
          registrants_email_notification: true
        }
      };

      if (recurrence) {
        meetingData.recurrence = recurrence;
      }

      const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(meetingData)
      });

      const meeting = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok) {
        // Log success
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'meeting.created',
          p_payload: { meeting_id: meeting.id, topic },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({
          success: true,
          meeting: {
            id: meeting.id,
            topic: meeting.topic,
            start_url: meeting.start_url,
            join_url: meeting.join_url,
            password: meeting.password,
            start_time: meeting.start_time,
            duration: meeting.duration
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        // Log error
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'meeting.create_failed',
          p_payload: { error: meeting },
          p_status: 'error',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ error: meeting.message || 'Failed to create meeting' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

    } else if (action === 'get_recordings') {
      const { meeting_id } = await req.json();

      const response = await fetch(`https://api.zoom.us/v2/meetings/${meeting_id}/recordings`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const recordings = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok) {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'recordings.fetched',
          p_payload: { meeting_id, recording_count: recordings.recording_files?.length || 0 },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({
          success: true,
          recordings: recordings.recording_files || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'recordings.fetch_failed',
          p_payload: { meeting_id, error: recordings },
          p_status: 'error',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ error: recordings.message || 'Failed to get recordings' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

    } else if (action === 'delete_meeting') {
      const { meeting_id } = await req.json();

      const response = await fetch(`https://api.zoom.us/v2/meetings/${meeting_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const executionTime = Date.now() - startTime;

      if (response.ok || response.status === 204) {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'meeting.deleted',
          p_payload: { meeting_id },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const error = await response.json();
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'meeting.delete_failed',
          p_payload: { meeting_id, error },
          p_status: 'error',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ error: error.message || 'Failed to delete meeting' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Zoom integration error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});