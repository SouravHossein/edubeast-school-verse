import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  Calendar, 
  FolderOpen, 
  MessageSquare, 
  Mail, 
  Phone,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

const integrationData = [
  {
    name: 'Zoom',
    service: 'zoom',
    description: 'Video conferencing and online classes',
    icon: Video,
    color: 'bg-blue-500',
    status: 'disconnected',
    features: ['Create meetings', 'Schedule classes', 'Record sessions', 'Participant management'],
    setupSteps: [
      'Create a Zoom Developer account',
      'Create a new OAuth app',
      'Configure redirect URLs',
      'Copy Client ID and Secret'
    ]
  },
  {
    name: 'Google Meet',
    service: 'google_meet',
    description: 'Google\'s video conferencing solution',
    icon: Calendar,
    color: 'bg-green-500',
    status: 'disconnected',
    features: ['Generate meeting links', 'Calendar integration', 'Auto-invites', 'Recording storage'],
    setupSteps: [
      'Enable Google Calendar API',
      'Create OAuth 2.0 credentials',
      'Configure consent screen',
      'Add authorized domains'
    ]
  },
  {
    name: 'Google Drive',
    service: 'google_drive',
    description: 'Cloud storage and file sharing',
    icon: FolderOpen,
    color: 'bg-yellow-500',
    status: 'disconnected',
    features: ['File uploads', 'Folder organization', 'Share permissions', 'Version control'],
    setupSteps: [
      'Enable Google Drive API',
      'Create service account',
      'Download credentials JSON',
      'Share folder with service account'
    ]
  },
  {
    name: 'WhatsApp Business',
    service: 'whatsapp',
    description: 'Automated messaging for parents and students',
    icon: MessageSquare,
    color: 'bg-green-600',
    status: 'disconnected',
    features: ['Automated alerts', 'Fee reminders', 'Class notifications', 'Two-way messaging'],
    setupSteps: [
      'Create WhatsApp Business account',
      'Apply for WhatsApp Business API',
      'Get API credentials',
      'Configure webhook endpoints'
    ]
  }
];

const automationTemplates = [
  {
    name: 'Class Scheduler',
    trigger: 'Class Scheduled',
    actions: ['Create Zoom/Meet Link', 'Send WhatsApp Reminder', 'Add to Calendar'],
    description: 'Automatically create meeting links and notify students when a class is scheduled'
  },
  {
    name: 'Fee Reminder',
    trigger: 'Fee Payment Due',
    actions: ['Send WhatsApp Message', 'Send Email', 'Create Notification'],
    description: 'Automatically remind parents about pending fee payments'
  },
  {
    name: 'Attendance Alert',
    trigger: 'Low Attendance',
    actions: ['Send WhatsApp Alert', 'Email Parent', 'Flag for Review'],
    description: 'Alert parents when student attendance falls below threshold'
  },
  {
    name: 'Exam Workflow',
    trigger: 'Exam Scheduled',
    actions: ['Create Meeting Room', 'Upload Documents to Drive', 'Notify Students'],
    description: 'Complete exam setup workflow with all necessary resources'
  }
];

export const IntegrationsHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [integrations, setIntegrations] = useState(integrationData);
  const [connectionData, setConnectionData] = useState<Record<string, any>>({});

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConnect = (service: string) => {
    // Update status to connected for demo
    setIntegrations(prev => prev.map(integration => 
      integration.service === service 
        ? { ...integration, status: 'connected' }
        : integration
    ));
    toast.success(`${service} connected successfully!`);
  };

  const handleDisconnect = (service: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.service === service 
        ? { ...integration, status: 'disconnected' }
        : integration
    ));
    toast.success(`${service} disconnected successfully!`);
  };

  const handleTest = (service: string) => {
    toast.success(`${service} connection test successful!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Integrations Hub</h2>
          <p className="text-muted-foreground">
            Connect with third-party services to enhance your school management system
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Integration Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup Guides</TabsTrigger>
          <TabsTrigger value="automation">Automation Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {integrations.map((integration) => {
              const IconComponent = integration.icon;
              
              return (
                <Card key={integration.service} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${integration.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(integration.status)}
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex space-x-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTest(integration.service)}
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Test
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDisconnect(integration.service)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleConnect(integration.service)}
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Integration Benefits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-medium">Save Time</h4>
                  <p className="text-sm text-muted-foreground">Automate repetitive tasks and workflows</p>
                </div>
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <h4 className="font-medium">Boost Productivity</h4>
                  <p className="text-sm text-muted-foreground">Streamline communication and file management</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h4 className="font-medium">Secure & Reliable</h4>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security and uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          {integrations.map((integration) => (
            <Card key={integration.service}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <integration.icon className="h-5 w-5" />
                  <span>{integration.name} Setup Guide</span>
                </CardTitle>
                <CardDescription>
                  Follow these steps to configure {integration.name} integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {integration.setupSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Configuration</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${integration.service}-client-id`}>Client ID</Label>
                      <Input
                        id={`${integration.service}-client-id`}
                        placeholder="Enter client ID"
                        value={connectionData[integration.service]?.clientId || ''}
                        onChange={(e) => setConnectionData(prev => ({
                          ...prev,
                          [integration.service]: {
                            ...prev[integration.service],
                            clientId: e.target.value
                          }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${integration.service}-client-secret`}>Client Secret</Label>
                      <Input
                        id={`${integration.service}-client-secret`}
                        type="password"
                        placeholder="Enter client secret"
                        value={connectionData[integration.service]?.clientSecret || ''}
                        onChange={(e) => setConnectionData(prev => ({
                          ...prev,
                          [integration.service]: {
                            ...prev[integration.service],
                            clientSecret: e.target.value
                          }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${integration.service}-enabled`}
                      checked={connectionData[integration.service]?.enabled || false}
                      onCheckedChange={(checked) => setConnectionData(prev => ({
                        ...prev,
                        [integration.service]: {
                          ...prev[integration.service],
                          enabled: checked
                        }
                      }))}
                    />
                    <Label htmlFor={`${integration.service}-enabled`}>Enable this integration</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Automation Templates</h3>
              <p className="text-sm text-muted-foreground">
                Pre-built automation workflows for common school scenarios
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Rule
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {automationTemplates.map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Trigger</h5>
                    <Badge variant="outline" className="bg-blue-50">
                      {template.trigger}
                    </Badge>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Actions</h5>
                    <div className="flex flex-wrap gap-2">
                      {template.actions.map((action, actionIndex) => (
                        <Badge key={actionIndex} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Custom Automation Rules</CardTitle>
              <CardDescription>
                Create your own automation workflows with custom triggers and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Advanced Automation Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Build custom workflows with drag-and-drop interface
                </p>
                <Button disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};