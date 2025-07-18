
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Settings, Check, X, MessageSquare, Mail, Calendar, Phone, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ExternalIntegrations: React.FC = () => {
  const { toast } = useToast();

  const integrations = [
    {
      id: '1',
      name: 'Google Workspace',
      services: ['Gmail', 'Google Chat', 'Google Calendar', 'Google Classroom'],
      status: 'connected',
      icon: Mail,
      setupRequired: false
    },
    {
      id: '2',
      name: 'WhatsApp Business API',
      services: ['Broadcast Lists', 'Group Management', 'Auto-replies'],
      status: 'connected',
      icon: MessageSquare,
      setupRequired: false
    },
    {
      id: '3',
      name: 'Mailchimp',
      services: ['Email Campaigns', 'Newsletter', 'Automated Sequences'],
      status: 'not-connected',
      icon: Mail,
      setupRequired: true
    },
    {
      id: '4',
      name: 'Telegram Bot API',
      services: ['Push Notifications', 'Channel Management'],
      status: 'connected',
      icon: Smartphone,
      setupRequired: false
    },
    {
      id: '5',
      name: 'Local SMS Gateway',
      services: ['SMS Alerts', 'Bulk SMS', 'Delivery Reports'],
      status: 'not-connected',
      icon: Phone,
      setupRequired: true
    }
  ];

  const configurationSteps = {
    'google-workspace': [
      'Enable Google Workspace APIs',
      'Create OAuth 2.0 credentials',
      'Set up service account',
      'Configure domain-wide delegation',
      'Test Gmail and Calendar integration'
    ],
    'whatsapp-business': [
      'Create WhatsApp Business Account',
      'Get WhatsApp Business API access',
      'Set up webhook endpoints',
      'Configure message templates',
      'Test broadcast functionality'
    ],
    'mailchimp': [
      'Create Mailchimp account',
      'Generate API key',
      'Set up audience lists',
      'Create email templates',
      'Configure automation workflows'
    ],
    'telegram-bot': [
      'Create Telegram bot via BotFather',
      'Get bot token',
      'Set up webhook (optional)',
      'Configure bot commands',
      'Test push notifications'
    ],
    'sms-gateway': [
      'Choose local SMS provider',
      'Get API credentials',
      'Configure sender ID',
      'Test SMS delivery',
      'Set up delivery reports'
    ]
  };

  const handleConnectIntegration = (integrationName: string) => {
    toast({
      title: "Integration Setup",
      description: `Starting setup process for ${integrationName}`,
    });
  };

  const handleTestIntegration = (integrationName: string) => {
    toast({
      title: "Integration Test",
      description: `Testing ${integrationName} connection...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'not-connected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check className="h-4 w-4" />;
      case 'not-connected':
        return <X className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Integration Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup Guides</TabsTrigger>
          <TabsTrigger value="api-keys">API Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => {
              const IconComponent = integration.icon;
              return (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(integration.status)}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1">{integration.status}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {integration.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {integration.status === 'connected' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleTestIntegration(integration.name)}
                            className="flex-1"
                          >
                            Test Connection
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleConnectIntegration(integration.name)}
                            className="flex-1"
                          >
                            Connect
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Integration Benefits</CardTitle>
              <CardDescription>
                Why use external platforms instead of building internal systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">🚀 Advantages</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No database maintenance required</li>
                    <li>• Familiar platforms for users</li>
                    <li>• Built-in reliability and uptime</li>
                    <li>• Advanced features (templates, automation)</li>
                    <li>• Mobile apps already installed</li>
                    <li>• Better delivery rates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">💡 Best Practices</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use Gmail for formal communications</li>
                    <li>• WhatsApp for urgent/quick alerts</li>
                    <li>• Google Calendar for events</li>
                    <li>• Telegram for system notifications</li>
                    <li>• SMS for critical alerts only</li>
                    <li>• Regular backup of important data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup">
          <div className="space-y-6">
            {Object.entries(configurationSteps).map(([key, steps]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {key.replace('-', ' ')} Setup Guide
                  </CardTitle>
                  <CardDescription>
                    Step-by-step configuration instructions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm">
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 Need help? Check our detailed documentation or contact support for assistance with this integration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api-keys">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Configure API keys and tokens for external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="google-client-id">Google Client ID</Label>
                  <Input id="google-client-id" type="password" placeholder="Enter Google OAuth Client ID" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp-token">WhatsApp Business Token</Label>
                  <Input id="whatsapp-token" type="password" placeholder="Enter WhatsApp Business API token" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mailchimp-api">Mailchimp API Key</Label>
                  <Input id="mailchimp-api" type="password" placeholder="Enter Mailchimp API key" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram-bot-token">Telegram Bot Token</Label>
                  <Input id="telegram-bot-token" type="password" placeholder="Enter Telegram bot token" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-api">SMS Gateway API</Label>
                  <Input id="sms-api" type="password" placeholder="Enter SMS provider API key" />
                </div>

                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">🔒 Security Best Practices</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Store API keys securely (use environment variables)</li>
                      <li>• Rotate keys regularly</li>
                      <li>• Use least privilege access</li>
                      <li>• Monitor API usage and logs</li>
                      <li>• Enable 2FA where possible</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">📊 Usage Monitoring</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Track API rate limits</li>
                      <li>• Monitor delivery success rates</li>
                      <li>• Set up usage alerts</li>
                      <li>• Regular integration health checks</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">✅ Backup Strategy</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Export important contact lists</li>
                      <li>• Backup email templates</li>
                      <li>• Document integration configurations</li>
                      <li>• Have fallback communication methods</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
