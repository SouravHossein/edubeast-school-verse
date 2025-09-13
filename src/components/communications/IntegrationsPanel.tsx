import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Video, 
  Calendar, 
  FolderOpen, 
  MessageSquare, 
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Zap,
  Shield,
  Clock,
  Activity,
  RefreshCw,
  Trash2,
  Users,
  FileText,
  Mail
} from 'lucide-react';
import { useIntegrations } from '@/hooks/useIntegrations';
import { toast } from 'sonner';

const integrationConfigs = {
  zoom: {
    name: 'Zoom',
    description: 'Video conferencing and online classes',
    icon: Video,
    color: 'bg-blue-500',
    features: ['Create meetings', 'Schedule classes', 'Record sessions', 'Participant management'],
    configFields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', required: true }
    ],
    setupSteps: [
      'Create a Zoom Developer account at marketplace.zoom.us',
      'Create a new OAuth app',
      'Configure redirect URLs',
      'Copy Client ID and Secret'
    ]
  },
  google_meet: {
    name: 'Google Meet',
    description: 'Google\'s video conferencing solution',
    icon: Calendar,
    color: 'bg-green-500',
    features: ['Generate meeting links', 'Calendar integration', 'Auto-invites', 'Recording storage'],
    configFields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', required: true }
    ],
    setupSteps: [
      'Enable Google Calendar API in Google Cloud Console',
      'Create OAuth 2.0 credentials',
      'Configure consent screen',
      'Add authorized domains'
    ]
  },
  google_drive: {
    name: 'Google Drive',
    description: 'Cloud storage and file sharing',
    icon: FolderOpen,
    color: 'bg-yellow-500',
    features: ['File uploads', 'Folder organization', 'Share permissions', 'Version control'],
    configFields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', required: true },
      { key: 'defaultFolderId', label: 'Default Folder ID', type: 'text', required: false }
    ],
    setupSteps: [
      'Enable Google Drive API',
      'Create service account or OAuth credentials',
      'Download credentials JSON',
      'Share folder with service account (if using service account)'
    ]
  },
  google_classroom: {
    name: 'Google Classroom',
    description: 'Classroom management and assignments',
    icon: Users,
    color: 'bg-purple-500',
    features: ['Sync courses', 'Create assignments', 'Manage students', 'Grade tracking'],
    configFields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', required: true }
    ],
    setupSteps: [
      'Enable Google Classroom API',
      'Create OAuth 2.0 credentials',
      'Request domain verification',
      'Configure proper scopes'
    ]
  },
  google_forms: {
    name: 'Google Forms',
    description: 'Create forms and collect responses',
    icon: FileText,
    color: 'bg-indigo-500',
    features: ['Create forms', 'Collect responses', 'Auto-grading', 'Response analysis'],
    configFields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', required: true }
    ],
    setupSteps: [
      'Enable Google Forms API',
      'Create OAuth 2.0 credentials',
      'Configure consent screen',
      'Set up proper scopes'
    ]
  },
  google_chat: {
    name: 'Google Chat',
    description: 'Team communication and messaging',
    icon: Mail,
    color: 'bg-red-500',
    features: ['Send messages', 'Create spaces', 'Bot integration', 'File sharing'],
    configFields: [
      { key: 'clientId', label: 'Client ID', type: 'text', required: true },
      { key: 'clientSecret', label: 'Client Secret', type: 'password', required: true },
      { key: 'redirectUri', label: 'Redirect URI', type: 'text', required: true }
    ],
    setupSteps: [
      'Enable Google Chat API',
      'Create service account or OAuth credentials',
      'Configure bot permissions',
      'Set up webhook endpoints'
    ]
  },
  whatsapp: {
    name: 'WhatsApp Business',
    description: 'Automated messaging for parents and students',
    icon: MessageSquare,
    color: 'bg-green-600',
    features: ['Automated alerts', 'Fee reminders', 'Class notifications', 'Two-way messaging'],
    configFields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
      { key: 'phoneNumberId', label: 'Phone Number ID', type: 'text', required: true },
      { key: 'businessAccountId', label: 'Business Account ID', type: 'text', required: true },
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', required: false }
    ],
    setupSteps: [
      'Create WhatsApp Business account',
      'Apply for WhatsApp Business API',
      'Get API credentials from Meta Business',
      'Configure webhook endpoints'
    ]
  }
};

export const IntegrationsPanel = () => {
  const {
    integrations,
    logs,
    loading,
    upsertIntegration,
    toggleIntegration,
    deleteIntegration,
    testIntegration,
    initiateOAuth,
    refreshTokens,
    isServiceConnected
  } = useIntegrations();

  const [activeTab, setActiveTab] = useState('overview');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const getStatusIcon = (integration: any) => {
    if (!integration) return <AlertCircle className="h-4 w-4 text-gray-400" />;
    
    switch (integration.health_status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (integration: any) => {
    if (!integration) return 'bg-gray-100 text-gray-800';
    
    switch (integration.health_status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) return;

    const config = integrationConfigs[selectedService as keyof typeof integrationConfigs];
    const requiredFields = config.configFields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.key]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    try {
      if (selectedService === 'whatsapp') {
        // Direct configuration for WhatsApp
        await upsertIntegration(selectedService, formData);
      } else {
        // OAuth flow for others
        await initiateOAuth(selectedService, formData);
      }
      
      setConfigDialogOpen(false);
      setFormData({});
      setSelectedService(null);
    } catch (error) {
      console.error('Error configuring integration:', error);
    }
  };

  const openConfigDialog = (serviceName: string) => {
    setSelectedService(serviceName);
    setFormData({});
    setConfigDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Integrations Panel</h2>
          <p className="text-muted-foreground">
            Connect with third-party services to enhance your school management system
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="quotas">Quotas & Usage</TabsTrigger>
          <TabsTrigger value="health">Health Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(integrationConfigs).map(([serviceName, config]) => {
              const integration = integrations.find(i => i.service_name === serviceName);
              const IconComponent = config.icon;
              const isConnected = isServiceConnected(serviceName);
              
              return (
                <Card key={serviceName} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{config.name}</CardTitle>
                          <CardDescription>{config.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(integration)}
                        <Badge className={getStatusColor(integration)}>
                          {isConnected ? 'Connected' : integration ? 'Disconnected' : 'Not Configured'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {config.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex space-x-2">
                      {isConnected ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testIntegration(integration)}
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Test
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refreshTokens(integration.id)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Refresh
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfigDialog(serviceName)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Settings
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => integration && deleteIntegration(integration.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => openConfigDialog(serviceName)}
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
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Integration activity logs and audit trail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No activity logs found
                  </div>
                ) : (
                  logs.slice(0, 20).map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`p-1 rounded-full ${
                        log.status === 'success' ? 'bg-green-100' :
                        log.status === 'error' ? 'bg-red-100' :
                        'bg-yellow-100'
                      }`}>
                        {log.status === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : log.status === 'error' ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{log.action}</p>
                          <time className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </time>
                        </div>
                        {log.error_message && (
                          <p className="text-xs text-red-600 mt-1">{log.error_message}</p>
                        )}
                        {log.execution_time_ms && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Execution time: {log.execution_time_ms}ms
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotas" className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Rate limiting helps protect your integrations from abuse and ensures reliable service.
            </AlertDescription>
          </Alert>
          {/* Quota monitoring will be implemented based on integration_quotas table */}
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Monitor the health and status of all your integrations in real-time.
            </AlertDescription>
          </Alert>
          {/* Health monitoring dashboard will be implemented */}
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Configure {selectedService && integrationConfigs[selectedService as keyof typeof integrationConfigs]?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <form onSubmit={handleConfigSubmit} className="space-y-4">
              {integrationConfigs[selectedService as keyof typeof integrationConfigs].configFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [field.key]: e.target.value
                    }))}
                    required={field.required}
                  />
                </div>
              ))}
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setConfigDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedService === 'whatsapp' ? 'Save Configuration' : 'Start OAuth'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};