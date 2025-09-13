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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'webhook') {
      // Handle WhatsApp webhooks
      const payload = await req.json();
      console.log('WhatsApp webhook received:', payload);

      // Verify webhook (simplified - in production, verify signature)
      if (payload.object === 'whatsapp_business_account') {
        // Process webhook entries
        for (const entry of payload.entry || []) {
          for (const change of entry.changes || []) {
            if (change.field === 'messages') {
              const messages = change.value.messages || [];
              const statuses = change.value.statuses || [];

              // Process messages
              for (const message of messages) {
                await supabase
                  .from('integration_webhooks')
                  .insert({
                    tenant_id: null, // Will be set based on phone number mapping
                    service_name: 'whatsapp',
                    event_type: 'message.received',
                    payload: message,
                    processed: false
                  });
              }

              // Process status updates
              for (const status of statuses) {
                await supabase
                  .from('integration_webhooks')
                  .insert({
                    tenant_id: null,
                    service_name: 'whatsapp',
                    event_type: 'message.status',
                    payload: status,
                    processed: false
                  });

                // Update message status in logs
                await supabase
                  .from('integration_logs')
                  .update({
                    payload: {
                      ...status,
                      status_updated_at: new Date().toISOString()
                    }
                  })
                  .eq('action', 'whatsapp.message_sent')
                  .eq('payload->message_id', status.id);
              }
            }
          }
        }

        return new Response('OK', { status: 200 });
      }

      return new Response('Invalid webhook', { status: 400 });
    }

    const { tenantId, action: requestAction } = await req.json();
    console.log(`WhatsApp ${requestAction} for tenant: ${tenantId}`);

    // Get integration config
    const { data: integration } = await supabase
      .from('integrations')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('service_name', 'whatsapp')
      .single();

    if (!integration || !integration.enabled) {
      return new Response(JSON.stringify({ error: 'WhatsApp integration not configured' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const config = integration.config_json;
    const accessToken = config.access_token;
    const phoneNumberId = config.phone_number_id;

    if (!accessToken || !phoneNumberId) {
      return new Response(JSON.stringify({ error: 'Missing WhatsApp credentials' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();

    if (requestAction === 'send_message') {
      const { to, message_type, content, template_name, template_params } = await req.json();

      // Check quota
      const quotaCheck = await supabase.rpc('check_integration_quota', {
        p_tenant_id: tenantId,
        p_service_name: 'whatsapp',
        p_quota_type: 'messages_per_minute',
        p_increment: 1
      });

      if (!quotaCheck.data) {
        return new Response(JSON.stringify({ error: 'Message quota exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      let messagePayload;

      if (message_type === 'template') {
        messagePayload = {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: template_name,
            language: { code: 'en' },
            components: template_params ? [
              {
                type: 'body',
                parameters: template_params.map((param: string) => ({ type: 'text', text: param }))
              }
            ] : []
          }
        };
      } else {
        messagePayload = {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: content }
        };
      }

      const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagePayload)
      });

      const result = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok) {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'whatsapp.message_sent',
          p_payload: { 
            message_id: result.messages?.[0]?.id,
            to,
            message_type,
            template_name: template_name || null
          },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({
          success: true,
          message_id: result.messages?.[0]?.id,
          status: 'sent'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'whatsapp.send_failed',
          p_payload: { error: result, to, message_type },
          p_status: 'error',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ error: result.error?.message || 'Failed to send message' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

    } else if (requestAction === 'create_template') {
      const { name, category, language, components } = await req.json();

      const templateData = {
        name,
        category,
        language,
        components
      };

      const response = await fetch(`https://graph.facebook.com/v17.0/${config.business_account_id}/message_templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(templateData)
      });

      const result = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok) {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'whatsapp.template_created',
          p_payload: { template_id: result.id, name, category },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({
          success: true,
          template_id: result.id,
          status: result.status
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'whatsapp.template_failed',
          p_payload: { error: result, name },
          p_status: 'error',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({ error: result.error?.message || 'Failed to create template' }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

    } else if (requestAction === 'get_templates') {
      const response = await fetch(`https://graph.facebook.com/v17.0/${config.business_account_id}/message_templates`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const result = await response.json();
      const executionTime = Date.now() - startTime;

      if (response.ok) {
        await supabase.rpc('log_integration_action', {
          p_tenant_id: tenantId,
          p_integration_id: integration.id,
          p_action: 'whatsapp.templates_fetched',
          p_payload: { template_count: result.data?.length || 0 },
          p_status: 'success',
          p_execution_time_ms: executionTime
        });

        return new Response(JSON.stringify({
          success: true,
          templates: result.data || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ error: result.error?.message || 'Failed to fetch templates' }), {
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
    console.error('WhatsApp integration error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});