
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/useTenant';
import { DomainManager } from './DomainManager';
import { PublicationControls } from './PublicationControls';
import { School, Palette, Globe, Settings, Users, Eye } from 'lucide-react';

export const TenantSettingsPanel: React.FC = () => {
  const { tenant, features, updateTenant, toggleFeature } = useTenant();

  if (!tenant) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading school settings...</p>
      </div>
    );
  }

  const handleBasicUpdate = async (field: string, value: any) => {
    await updateTenant({ [field]: value });
  };

  const availableFeatures = [
    { key: 'attendanceManagement', label: 'Attendance Management', description: 'Track student and staff attendance' },
    { key: 'onlineExams', label: 'Online Examinations', description: 'Conduct digital exams and assessments' },
    { key: 'feeManagement', label: 'Fee Management', description: 'Handle fee collection and payments' },
    { key: 'parentPortal', label: 'Parent Portal', description: 'Parent access to student information' },
    { key: 'studentPortal', label: 'Student Portal', description: 'Student dashboard and information' },
    { key: 'teacherPortal', label: 'Teacher Portal', description: 'Teacher management interface' },
    { key: 'messagingSystem', label: 'Messaging System', description: 'Internal communication platform' },
    { key: 'eventManagement', label: 'Event Management', description: 'School event planning and tracking' },
    { key: 'reportCards', label: 'Report Cards', description: 'Digital report card generation' },
    { key: 'libraryManagement', label: 'Library Management', description: 'Library book and resource tracking' }
  ];

  const themes = [
    { value: 'modern', label: 'Modern' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'classic', label: 'Classic' }
  ];

  const fontFamilies = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Lato', label: 'Lato' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">School Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your school's configuration and appearance
          </p>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <School className="w-4 h-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="publication" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Publication
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your school's basic details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    value={tenant.name}
                    onChange={(e) => handleBasicUpdate('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={tenant.slug}
                    onChange={(e) => handleBasicUpdate('slug', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {tenant.slug}.schoolsaas.com
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={tenant.contact_email || ''}
                    onChange={(e) => handleBasicUpdate('contact_email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={tenant.contact_phone || ''}
                    onChange={(e) => handleBasicUpdate('contact_phone', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={tenant.address || ''}
                  onChange={(e) => handleBasicUpdate('address', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={tenant.timezone} onValueChange={(value) => handleBasicUpdate('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dhaka">Asia/Dhaka (UTC+6)</SelectItem>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</SelectItem>
                      <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={tenant.language} onValueChange={(value) => handleBasicUpdate('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Colors</CardTitle>
              <CardDescription>
                Customize your school's visual appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <Select value={tenant.theme || 'modern'} onValueChange={(value) => handleBasicUpdate('theme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Font Family</Label>
                <Select value={tenant.font_family} onValueChange={(value) => handleBasicUpdate('font_family', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={tenant.primary_color}
                      onChange={(e) => handleBasicUpdate('primary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={tenant.primary_color}
                      onChange={(e) => handleBasicUpdate('primary_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={tenant.secondary_color}
                      onChange={(e) => handleBasicUpdate('secondary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={tenant.secondary_color}
                      onChange={(e) => handleBasicUpdate('secondary_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={tenant.accent_color}
                      onChange={(e) => handleBasicUpdate('accent_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={tenant.accent_color}
                      onChange={(e) => handleBasicUpdate('accent_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize your school's search engine presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={tenant.meta_title || ''}
                  onChange={(e) => handleBasicUpdate('meta_title', e.target.value)}
                  placeholder={tenant.name}
                />
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={tenant.meta_description || ''}
                  onChange={(e) => handleBasicUpdate('meta_description', e.target.value)}
                  placeholder="A brief description of your school"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Management</CardTitle>
              <CardDescription>
                Enable or disable features for your school
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFeatures.map(feature => {
                  const isEnabled = features.find(f => f.feature_key === feature.key)?.is_enabled ?? false;
                  return (
                    <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{feature.label}</h4>
                          <Badge variant={isEnabled ? "default" : "secondary"}>
                            {isEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => toggleFeature(feature.key, checked)}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains" className="space-y-6">
          <DomainManager />
        </TabsContent>

        <TabsContent value="publication" className="space-y-6">
          <PublicationControls />
        </TabsContent>
      </Tabs>
    </div>
  );
};
