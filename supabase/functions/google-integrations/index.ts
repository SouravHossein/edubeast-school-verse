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

    const { tenantId, service, action } = await req.json();
    console.log(`Google ${service} ${action} for tenant: ${tenantId}`);

    // Get integration config
    const { data: integration } = await supabase
      .from('integrations')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('service_name', service)
      .single();

    if (!integration || !integration.enabled) {
      return new Response(JSON.stringify({ error: `${service} integration not configured` }), {
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

    if (service === 'google_meet' && action === 'create_meeting') {
      const { summary, start_time, end_time, description, attendees } = await req.json();

      const eventData = {
        summary,
        start: {
          dateTime: start_time,
          timeZone: 'Asia/Dhaka'
        },
        end: {
          dateTime: end_time,
          timeZone: 'Asia/Dhaka'
        },
        description,
        attendees: attendees?.map((email: string) => ({ email })) || [],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      const event = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok) {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'meet.created',
          p_payload: { event_id: event.id, summary },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({
          success: true,
          meeting: {
            id: event.id,
            summary: event.summary,
            start_time: event.start.dateTime,
            end_time: event.end.dateTime,
            meet_link: event.conferenceData?.entryPoints?.[0]?.uri || event.hangoutLink,
            calendar_link: event.htmlLink
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'meet.create_failed',
          p_payload: { error: event },
          p_status: 'error',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ error: event.error?.message || 'Failed to create meeting' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

    } else if (service === 'google_drive' && action === 'upload_file') {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const folderId = formData.get('folder_id') as string;
      const fileName = formData.get('file_name') as string || file.name;

      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Create file metadata
      const metadata = {
        name: fileName,
        parents: folderId ? [folderId] : undefined
      };

      // Upload file
      const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: new FormData().append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
                             .append('data', file)
      });

      const uploadResult = await uploadResponse.json();
      const executionTime = Date.now() - startTime;

      if (uploadResponse.ok) {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'drive.file_uploaded',
          p_payload: { file_id: uploadResult.id, file_name: fileName },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({
          success: true,
          file: {
            id: uploadResult.id,
            name: uploadResult.name,
            mimeType: uploadResult.mimeType,
            webViewLink: `https://drive.google.com/file/d/${uploadResult.id}/view`,
            downloadLink: `https://drive.google.com/uc?id=${uploadResult.id}`
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'drive.upload_failed',
          p_payload: { error: uploadResult, file_name: fileName },
          p_status: 'error',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ error: uploadResult.error?.message || 'Failed to upload file' }), {
          status: uploadResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

    } else if (service === 'google_classroom' && action === 'create_assignment') {
      const { courseId, title, description, dueDate, materials } = await req.json();

      const assignmentData = {
        title,
        description,
        workType: 'ASSIGNMENT',
        state: 'PUBLISHED',
        dueDate: dueDate ? {
          year: new Date(dueDate).getFullYear(),
          month: new Date(dueDate).getMonth() + 1,
          day: new Date(dueDate).getDate()
        } : undefined,
        materials: materials || []
      };

      const response = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentData)
      });

      const assignment = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok) {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'classroom.assignment_created',
          p_payload: { assignment_id: assignment.id, course_id: courseId, title },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({
          success: true,
          assignment: {
            id: assignment.id,
            title: assignment.title,
            description: assignment.description,
            alternateLink: assignment.alternateLink,
            creationTime: assignment.creationTime
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'classroom.assignment_failed',
          p_payload: { error: assignment, course_id: courseId, title },
          p_status: 'error',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ error: assignment.error?.message || 'Failed to create assignment' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid service or action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Google integration error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});