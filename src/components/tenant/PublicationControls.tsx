
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/hooks/useTenant';
import { Eye, EyeOff, Globe, AlertTriangle } from 'lucide-react';

export const PublicationControls: React.FC = () => {
  const { tenant, updateTenant } = useTenant();

  if (!tenant) return null;

  const handlePublishToggle = async (published: boolean) => {
    await updateTenant({ is_published: published });
  };

  const getPublicationStatus = () => {
    if (tenant.is_published) {
      return {
        icon: <Eye className="w-4 h-4" />,
        label: "Published",
        variant: "default" as const,
        description: "Your school website is live and visible to everyone"
      };
    } else {
      return {
        icon: <EyeOff className="w-4 h-4" />,
        label: "Unpublished",
        variant: "secondary" as const,
        description: "Your school website is in draft mode and only visible to logged-in users"
      };
    }
  };

  const status = getPublicationStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Website Publication
        </CardTitle>
        <CardDescription>
          Control the public visibility of your school website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Label htmlFor="publish-toggle">Publication Status</Label>
              <Badge variant={status.variant} className="flex items-center gap-1">
                {status.icon}
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {status.description}
            </p>
          </div>
          <Switch
            id="publish-toggle"
            checked={tenant.is_published}
            onCheckedChange={handlePublishToggle}
          />
        </div>

        {!tenant.is_published && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Website is currently unpublished.</strong> Only users logged into your portal can view the website. 
              Publish when you're ready to make it visible to everyone.
            </AlertDescription>
          </Alert>
        )}

        {tenant.is_published && (
          <div className="space-y-2">
            <h4 className="font-medium">Your website is live at:</h4>
            <div className="space-y-1">
              <div className="p-2 bg-muted rounded font-mono text-sm">
                https://{tenant.slug}.schoolsaas.com
              </div>
              {tenant.custom_domain && (
                <div className="p-2 bg-muted rounded font-mono text-sm">
                  https://{tenant.custom_domain}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
