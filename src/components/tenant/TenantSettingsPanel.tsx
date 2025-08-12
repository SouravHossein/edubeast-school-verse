
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTenant } from '@/hooks/useTenant';
import { useToast } from '@/hooks/use-toast';
import { DomainManager } from './DomainManager';
import { PublicationControls } from './PublicationControls';
import { 
  Settings, 
  Palette, 
  Globe, 
  Search, 
  Shield, 
  Zap,
  Upload,
  Info,
  Lock,
  Users,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const basicInfoSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  contact_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  address: z.string().optional(),
  timezone: z.string(),
  language: z.string(),
  currency: z.string(),
});

const brandingSchema = z.object({
  primary_color: z.string(),
  secondary_color: z.string(),
  accent_color: z.string(),
  font_family: z.string(),
  theme: z.string().optional(),
});

const seoSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
type BrandingFormData = z.infer<typeof brandingSchema>;
type SEOFormData = z.infer<typeof seoSchema>;

export const TenantSettingsPanel: React.FC = () => {
  const { tenant, features, updateTenant, toggleFeature } = useTenant();
  const { toast } = useToast();

  const basicInfoForm = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: tenant?.name || '',
      contact_email: tenant?.contact_email || '',
      contact_phone: tenant?.contact_phone || '',
      address: tenant?.address || '',
      timezone: tenant?.timezone || 'Asia/Dhaka',
      language: tenant?.language || 'en',
      currency: tenant?.currency || 'BDT',
    },
  });

  const brandingForm = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primary_color: tenant?.primary_color || '#3b82f6',
      secondary_color: tenant?.secondary_color || '#10b981',
      accent_color: tenant?.accent_color || '#f59e0b',
      font_family: tenant?.font_family || 'Inter',
      theme: tenant?.theme || 'modern',
    },
  });

  const seoForm = useForm<SEOFormData>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      meta_title: tenant?.meta_title || '',
      meta_description: tenant?.meta_description || '',
    },
  });

  const onBasicInfoSubmit = async (data: BasicInfoFormData) => {
    await updateTenant(data);
  };

  const onBrandingSubmit = async (data: BrandingFormData) => {
    await updateTenant(data);
  };

  const onSEOSubmit = async (data: SEOFormData) => {
    await updateTenant(data);
  };

  const handleFeatureToggle = async (featureKey: string, enabled: boolean) => {
    await toggleFeature(featureKey, enabled);
  };

  if (!tenant) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No Tenant Found</h3>
            <p className="text-muted-foreground">Please complete the onboarding process first.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">School Settings</h1>
          <p className="text-muted-foreground">Manage your school's configuration and preferences</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)} Plan
        </Badge>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Domains
          </TabsTrigger>
          <TabsTrigger value="publication" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Publication
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update your school's basic information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={basicInfoForm.handleSubmit(onBasicInfoSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      School Name
                    </Label>
                    <Input
                      id="name"
                      {...basicInfoForm.register('name')}
                      placeholder="Enter school name"
                    />
                    {basicInfoForm.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {basicInfoForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Email
                    </Label>
                    <Input
                      id="contact_email"
                      type="email"
                      {...basicInfoForm.register('contact_email')}
                      placeholder="school@example.com"
                    />
                    {basicInfoForm.formState.errors.contact_email && (
                      <p className="text-sm text-destructive">
                        {basicInfoForm.formState.errors.contact_email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Phone
                    </Label>
                    <Input
                      id="contact_phone"
                      {...basicInfoForm.register('contact_phone')}
                      placeholder="+880 1XX XXX XXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={basicInfoForm.watch('timezone')}
                      onValueChange={(value) => basicInfoForm.setValue('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={basicInfoForm.watch('language')}
                      onValueChange={(value) => basicInfoForm.setValue('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={basicInfoForm.watch('currency')}
                      onValueChange={(value) => basicInfoForm.setValue('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BDT">BDT (৳)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    {...basicInfoForm.register('address')}
                    placeholder="Enter school address"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Save Basic Information
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding & Theme
              </CardTitle>
              <CardDescription>
                Customize your school's visual identity and theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={brandingForm.handleSubmit(onBrandingSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        {...brandingForm.register('primary_color')}
                        className="w-20 h-10"
                      />
                      <Input
                        value={brandingForm.watch('primary_color')}
                        onChange={(e) => brandingForm.setValue('primary_color', e.target.value)}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        {...brandingForm.register('secondary_color')}
                        className="w-20 h-10"
                      />
                      <Input
                        value={brandingForm.watch('secondary_color')}
                        onChange={(e) => brandingForm.setValue('secondary_color', e.target.value)}
                        placeholder="#10b981"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="accent_color"
                        type="color"
                        {...brandingForm.register('accent_color')}
                        className="w-20 h-10"
                      />
                      <Input
                        value={brandingForm.watch('accent_color')}
                        onChange={(e) => brandingForm.setValue('accent_color', e.target.value)}
                        placeholder="#f59e0b"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Site Theme</Label>
                    <Select
                      value={brandingForm.watch('theme')}
                      onValueChange={(value) => brandingForm.setValue('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font_family">Font Family</Label>
                    <Select
                      value={brandingForm.watch('font_family')}
                      onValueChange={(value) => brandingForm.setValue('font_family', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <Label>School Logo</Label>
                  </div>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    {tenant.logo_url ? (
                      <div className="space-y-4">
                        <img 
                          src={tenant.logo_url} 
                          alt="School Logo" 
                          className="mx-auto h-20 w-auto"
                        />
                        <Button variant="outline" size="sm">
                          Change Logo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-sm text-muted-foreground">Upload your school logo</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Upload Logo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Save Branding Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Optimize your school website for search engines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={seoForm.handleSubmit(onSEOSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    {...seoForm.register('meta_title')}
                    placeholder="Your School Name - Quality Education"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 50-60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    {...seoForm.register('meta_description')}
                    placeholder="Brief description of your school and its values..."
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 150-160 characters
                  </p>
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  Save SEO Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domains">
          <DomainManager />
        </TabsContent>

        <TabsContent value="publication">
          <PublicationControls />
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Feature Management
              </CardTitle>
              <CardDescription>
                Enable or disable features for your school management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium capitalize">
                            {feature.feature_key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </h4>
                          <Badge variant={feature.is_enabled ? "default" : "secondary"}>
                            {feature.is_enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getFeatureDescription(feature.feature_key)}
                        </p>
                      </div>
                      <Switch
                        checked={feature.is_enabled}
                        onCheckedChange={(enabled) => handleFeatureToggle(feature.feature_key, enabled)}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function getFeatureDescription(featureKey: string): string {
  const descriptions: Record<string, string> = {
    attendanceManagement: "Track student attendance with automated marking and reporting",
    onlineExams: "Conduct online examinations with automated grading",
    libraryManagement: "Manage library resources, book lending, and inventory",
    transportManagement: "Track school bus routes, schedules, and student transportation",
    hostelManagement: "Manage dormitory facilities and student accommodation",
    feeManagement: "Handle fee collection, payment tracking, and financial reporting",
    parentPortal: "Provide parents access to student information and school updates",
    studentPortal: "Give students access to their academic information and resources",
    teacherPortal: "Enable teachers to manage classes, grades, and student interactions",
    messagingSystem: "Internal messaging system for school community communication",
    eventManagement: "Organize and manage school events, activities, and announcements",
    reportCards: "Generate and distribute digital report cards and academic reports",
    disciplineTracking: "Track student behavior and disciplinary actions",
    healthRecords: "Maintain student health records and medical information",
  };
  
  return descriptions[featureKey] || "Feature configuration and management";
}
