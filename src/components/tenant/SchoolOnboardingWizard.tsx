
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { School, Palette, Users, CheckCircle } from 'lucide-react';

interface OnboardingData {
  name: string;
  slug: string;
  address: string;
  contact_email: string;
  contact_phone: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
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
    primary_color: '#3b82f6',
    secondary_color: '#10b981',
    accent_color: '#f59e0b',
    features: ['attendanceManagement', 'feeManagement', 'studentPortal', 'teacherPortal']
  });
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

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
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.name && data.slug && data.contact_email);
      case 2:
        return true; // Contact info is optional
      case 3:
        return true; // Colors have defaults
      case 4:
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
    if (!validateStep(4)) return;

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
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
          status: 'trial'
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
              <School className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold">Contact Details</h2>
              <p className="text-muted-foreground">Additional contact information for your school</p>
            </div>
            <div className="space-y-4">
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
              <h2 className="text-2xl font-bold">Brand Colors</h2>
              <p className="text-muted-foreground">Choose colors that represent your school's identity</p>
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
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Color Preview</h4>
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: data.primary_color }}
                />
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: data.secondary_color }}
                />
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: data.accent_color }}
                />
              </div>
            </div>
          </div>
        );

      case 4:
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
