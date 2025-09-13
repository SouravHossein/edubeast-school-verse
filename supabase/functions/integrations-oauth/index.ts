import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

const OAUTH_CONFIGS = {
  zoom: {
    authUrl: 'https://zoom.us/oauth/authorize',
    tokenUrl: 'https://zoom.us/oauth/token',
    scopes: ['meeting:write', 'recording:read', 'user:read']
  },
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/classroom.courses',
      'https://www.googleapis.com/auth/classroom.rosters',
      'https://www.googleapis.com/auth/chat.bot'
    ]
  }
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
    const service = url.searchParams.get('service');
    const tenantId = url.searchParams.get('tenant_id');

    console.log(`OAuth ${action} for ${service}, tenant: ${tenantId}`);

    if (action === 'initiate') {
      // Start OAuth flow
      const { data: integration } = await supabase
        .from('integrations')
        .select('config_json')
        .eq('tenant_id', tenantId)
        .eq('service_name', service)
        .single();

      if (!integration) {
        return new Response(JSON.stringify({ error: 'Integration not configured' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const config = integration.config_json as OAuthConfig;
      const oauthConfig = OAUTH_CONFIGS[service as keyof typeof OAUTH_CONFIGS];
      
      if (!oauthConfig) {
        return new Response(JSON.stringify({ error: 'Unsupported service' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: oauthConfig.scopes.join(' '),
        state: `${tenantId}:${service}`
      });

      const authUrl = `${oauthConfig.authUrl}?${params.toString()}`;

      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } else if (action === 'callback') {
      // Handle OAuth callback
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      
      if (!code || !state) {
        return new Response(JSON.stringify({ error: 'Missing code or state' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const [callbackTenantId, callbackService] = state.split(':');
      
      // Get integration config
      const { data: integration } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', callbackTenantId)
        .eq('service_name', callbackService)
        .single();

      if (!integration) {
        return new Response(JSON.stringify({ error: 'Integration not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const config = integration.config_json as OAuthConfig;
      const oauthConfig = OAUTH_CONFIGS[callbackService as keyof typeof OAUTH_CONFIGS];

      // Exchange code for tokens
      const tokenResponse = await fetch(oauthConfig.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: config.redirectUri
        })
      });

      const tokens = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', tokens);
        return new Response(JSON.stringify({ error: 'Token exchange failed' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Store tokens securely
      const updatedConfig = {
        ...config,
        oauth_tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: Date.now() + (tokens.expires_in * 1000)
        }
      };

      await supabase
        .from('integrations')
        .update({
          config_json: updatedConfig,
          enabled: true,
          health_status: 'healthy',
          last_health_check: new Date().toISOString()
        })
        .eq('id', integration.id);

      // Store encrypted tokens
      if (tokens.access_token) {
        await supabase
          .from('integration_tokens')
          .upsert({
            integration_id: integration.id,
            token_type: 'access',
            encrypted_token: tokens.access_token, // TODO: Encrypt this
            expires_at: new Date(Date.now() + (tokens.expires_in * 1000)).toISOString(),
            scopes: oauthConfig.scopes
          });
      }

      if (tokens.refresh_token) {
        await supabase
          .from('integration_tokens')
          .upsert({
            integration_id: integration.id,
            token_type: 'refresh',
            encrypted_token: tokens.refresh_token, // TODO: Encrypt this
            scopes: oauthConfig.scopes
          });
      }

      // Log the connection
      await supabase.rpc('log_integration_action', {
        p_tenant_id: callbackTenantId,
        p_integration_id: integration.id,
        p_action: 'oauth.connected',
        p_payload: { service: callbackService },
        p_status: 'success'
      });

      return new Response(JSON.stringify({ 
        success: true, 
        message: `${callbackService} connected successfully`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } else if (action === 'refresh') {
      // Refresh tokens
      const { data: integration } = await supabase
        .from('integrations')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('service_name', service)
        .single();

      if (!integration) {
        return new Response(JSON.stringify({ error: 'Integration not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: refreshToken } = await supabase
        .from('integration_tokens')
        .select('encrypted_token')
        .eq('integration_id', integration.id)
        .eq('token_type', 'refresh')
        .single();

      if (!refreshToken) {
        return new Response(JSON.stringify({ error: 'No refresh token found' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const config = integration.config_json as OAuthConfig;
      const oauthConfig = OAUTH_CONFIGS[service as keyof typeof OAUTH_CONFIGS];

      const tokenResponse = await fetch(oauthConfig.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken.encrypted_token // TODO: Decrypt this
        })
      });

      const tokens = await tokenResponse.json();
      
      if (tokenResponse.ok) {
        // Update tokens
        await supabase
          .from('integration_tokens')
          .update({
            encrypted_token: tokens.access_token, // TODO: Encrypt this
            expires_at: new Date(Date.now() + (tokens.expires_in * 1000)).toISOString()
          })
          .eq('integration_id', integration.id)
          .eq('token_type', 'access');

        await supabase
          .from('integrations')
          .update({
            health_status: 'healthy',
            last_health_check: new Date().toISOString()
          })
          .eq('id', integration.id);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        await supabase
          .from('integrations')
          .update({
            health_status: 'error',
            last_health_check: new Date().toISOString()
          })
          .eq('id', integration.id);

        return new Response(JSON.stringify({ error: 'Token refresh failed' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('OAuth error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});