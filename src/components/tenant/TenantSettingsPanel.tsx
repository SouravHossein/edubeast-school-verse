
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/useTenant';
import { Palette, Settings, Globe, CreditCard, Users } from 'lucide-react';

export const TenantSettingsPanel: React.FC = () => {
  const { tenant, features, updateTenant, toggleFeature } = useTenant();
  const [formData, setFormData] = useState(tenant || {
    name: '',
    slug: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    logo_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#10b981',
    accent_color: '#f59e0b',
    font_family: 'Inter',
    custom_domain: ''
  });

  if (!tenant) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateTenant(formData);
  };

  const featureCategories = {
    core: ['attendanceManagement', 'feeManagement', 'studentPortal', 'teacherPortal'],
    advanced: ['onlineExams', 'parentPortal', 'messagingSystem', 'eventManagement'],
    premium: ['libraryManagement', 'transportManagement', 'hostelManagement', 'reportCards'],
    optional: ['disciplineTracking', 'healthRecords']
  };

  const getFeatureLabel = (key: string) => {
    const labels: Record<string, string> = {
      attendanceManagement: 'Attendance Management',
      onlineExams: 'Online Examinations',
      libraryManagement: 'Library Management',
      transportManagement: 'Transport Management',
      hostelManagement: 'Hostel Management',
      feeManagement: 'Fee Management',
      parentPortal: 'Parent Portal',
      studentPortal: 'Student Portal',
      teacherPortal: 'Teacher Portal',
      messagingSystem: 'Messaging System',
      eventManagement: 'Event Management',
      reportCards: 'Report Cards',
      disciplineTracking: 'Discipline Tracking',
      healthRecords: 'Health Records'
    };
    return labels[key] || key;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">School Settings</h1>
        <p className="text-muted-foreground">Manage your school's branding, features, and configuration</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="domain" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Domain
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Basic information about your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug || ''}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email || ''}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone || ''}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Branding</CardTitle>
              <CardDescription>Customize your school's appearance and colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url || ''}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={formData.primary_color || '#3b82f6'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.primary_color || '#3b82f6'}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={formData.secondary_color || '#10b981'}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.secondary_color || '#10b981'}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent_color"
                      type="color"
                      value={formData.accent_color || '#f59e0b'}
                      onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.accent_color || '#f59e0b'}
                      onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font_family">Font Family</Label>
                <select
                  id="font_family"
                  value={formData.font_family || 'Inter'}
                  onChange={(e) => handleInputChange('font_family', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Nunito">Nunito</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {Object.entries(featureCategories).map(([category, featureKeys]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category} Features</CardTitle>
                <CardDescription>
                  {category === 'core' && 'Essential features for school management'}
                  {category === 'advanced' && 'Enhanced features for better functionality'}
                  {category === 'premium' && 'Premium features for comprehensive management'}
                  {category === 'optional' && 'Optional features for specialized needs'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featureKeys.map(featureKey => {
                    const feature = features.find(f => f.feature_key === featureKey);
                    const isEnabled = feature?.is_enabled ?? false;
                    
                    return (
                      <div key={featureKey} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => toggleFeature(featureKey, checked)}
                          />
                          <div>
                            <div className="font-medium">{getFeatureLabel(featureKey)}</div>
                            <div className="text-sm text-muted-foreground">
                              {featureKey.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={isEnabled ? 'default' : 'secondary'}>
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>Configure your custom domain and URL settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom_domain">Custom Domain</Label>
                <Input
                  id="custom_domain"
                  placeholder="www.yourschool.edu.bd"
                  value={formData.custom_domain || ''}
                  onChange={(e) => handleInputChange('custom_domain', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Point your domain's CNAME record to our servers to use your own domain.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current URLs:</h4>
                <ul className="space-y-1 text-sm">
                  <li>Default: https://{tenant.slug}.schoolsaas.com</li>
                  {tenant.custom_domain && (
                    <li>Custom: https://{tenant.custom_domain}</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Current Plan</div>
                  <Badge className="mt-1 capitalize">{tenant.plan}</Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Status</div>
                  <Badge 
                    variant={tenant.status === 'active' ? 'default' : 'destructive'}
                    className="mt-1 capitalize"
                  >
                    {tenant.status}
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="font-medium">Currency</div>
                  <div className="mt-1">{tenant.currency}</div>
                </div>
              </div>
              {tenant.subscription_end && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="font-medium">Subscription Details</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Valid until: {new Date(tenant.subscription_end).toLocaleDateString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6">
        <Button variant="outline" onClick={() => setFormData(tenant)}>
          Reset
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
