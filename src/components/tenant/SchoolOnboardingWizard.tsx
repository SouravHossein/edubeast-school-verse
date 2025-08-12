
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { School, Palette, Users, CheckCircle, Globe, Settings } from 'lucide-react';

interface OnboardingData {
  name: string;
  slug: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  timezone: string;
  country: string;
  theme: 'modern' | 'minimal' | 'classic';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  meta_title: string;
  meta_description: string;
  features: string[];
}

interface SchoolOnboardingWizardProps {
  onComplete: () => void;
}

export const SchoolOnboardingWizard: React.FC<SchoolOnboardingWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    slug: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    timezone: 'Asia/Dhaka',
    country: 'BD',
    theme: 'modern',
    primary_color: '#3b82f6',
    secondary_color: '#10b981',
    accent_color: '#f59e0b',
    font_family: 'Inter',
    meta_title: '',
    meta_description: '',
    features: ['attendanceManagement', 'feeManagement', 'studentPortal', 'teacherPortal']
  });
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const timezones = [
    { value: 'Asia/Dhaka', label: 'Asia/Dhaka (UTC+6)' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (UTC+5:30)' },
    { value: 'UTC', label: 'UTC (UTC+0)' },
    { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0)' }
  ];

  const countries = [
    { value: 'BD', label: 'Bangladesh' },
    { value: 'IN', label: 'India' },
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' }
  ];

  const themes = [
    { value: 'modern', label: 'Modern', description: 'Clean gradients and rounded corners' },
    { value: 'minimal', label: 'Minimal', description: 'Simple and clean design' },
    { value: 'classic', label: 'Classic', description: 'Traditional academic look' }
  ];

  const fontFamilies = [
    { value: 'Inter', label: 'Inter (Default)' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Lato', label: 'Lato' }
  ];

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

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (featureKey: string, checked: boolean) => {
    if (checked) {
      setData(prev => ({ ...prev, features: [...prev.features, featureKey] }));
    } else {
      setData(prev => ({ ...prev, features: prev.features.filter(f => f !== featureKey) }));
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    handleInputChange('name', name);
    if (!data.slug || data.slug === generateSlug(data.name)) {
      handleInputChange('slug', generateSlug(name));
    }
    if (!data.meta_title || data.meta_title === data.name) {
      handleInputChange('meta_title', name);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.name && data.slug && data.contact_email);
      case 2:
        return !!(data.timezone && data.country);
      case 3:
        return !!(data.theme);
      case 4:
        return true; // SEO is optional
      case 5:
        return data.features.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast({
        title: "Please fill required fields",
        description: "Complete all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: data.name,
          slug: data.slug,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          address: data.address,
          timezone: data.timezone,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
          font_family: data.font_family,
          theme: data.theme,
          meta_title: data.meta_title || data.name,
          meta_description: data.meta_description,
          status: 'trial',
          onboarding_completed: true
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Update user profile with tenant_id
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ tenant_id: tenant.id })
          .eq('user_id', user.user.id);

        if (profileError) throw profileError;
      }

      // Update selected features
      const featureUpdates = availableFeatures.map(feature => ({
        tenant_id: tenant.id,
        feature_key: feature.key,
        is_enabled: data.features.includes(feature.key)
      }));

      const { error: featuresError } = await supabase
        .from('tenant_features')
        .upsert(featureUpdates);

      if (featuresError) throw featuresError;

      toast({
        title: "School setup complete!",
        description: "Welcome to your new school management system.",
      });

      onComplete();
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Setup failed",
        description: "There was an error setting up your school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <School className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">School Information</h2>
              <p className="text-muted-foreground">Let's start with basic information about your school</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">School Name *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Green Valley High School"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={data.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="green-valley-high"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your school will be accessible at: {data.slug}.schoolsaas.com
                </p>
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={data.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="admin@greenvalley.edu"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">Location & Settings</h2>
              <p className="text-muted-foreground">Configure your school's location and timezone</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={data.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone *</Label>
                <Select value={data.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(timezone => (
                      <SelectItem key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={data.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
              <div>
                <Label htmlFor="address">School Address</Label>
                <Textarea
                  id="address"
                  value={data.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your school's complete address"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Palette className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">Design & Branding</h2>
              <p className="text-muted-foreground">Choose your theme and colors</p>
            </div>
            <div className="space-y-6">
              <div>
                <Label>Theme *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {themes.map(theme => (
                    <div 
                      key={theme.value}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        data.theme === theme.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleInputChange('theme', theme.value)}
                    >
                      <h4 className="font-medium">{theme.label}</h4>
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Font Family</Label>
                <Select value={data.font_family} onValueChange={(value) => handleInputChange('font_family', value)}>
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
                      id="primary_color"
                      type="color"
                      value={data.primary_color}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={data.primary_color}
                      onChange={(e) => handleInputChange('primary_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={data.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={data.secondary_color}
                      onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="accent_color"
                      type="color"
                      value={data.accent_color}
                      onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={data.accent_color}
                      onChange={(e) => handleInputChange('accent_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">SEO Settings</h2>
              <p className="text-muted-foreground">Optimize your school's online presence</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={data.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder={data.name || "Your School Name"}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Appears in search results and browser tabs
                </p>
              </div>
              <div>
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={data.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="A brief description of your school for search engines"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Brief description shown in search results (150-160 characters recommended)
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">Select Features</h2>
              <p className="text-muted-foreground">Choose the features you want to enable for your school</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableFeatures.map(feature => (
                <div key={feature.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={feature.key}
                    checked={data.features.includes(feature.key)}
                    onCheckedChange={(checked) => handleFeatureToggle(feature.key, checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={feature.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>School Setup Wizard</CardTitle>
              <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{Math.round(progress)}% complete</div>
              <Progress value={progress} className="w-32 mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? 'Setting up...' : 'Complete Setup'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
