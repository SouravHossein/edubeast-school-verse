
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Globe, Lock, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/useTenant';

export const PublicationControls = () => {
  const { toast } = useToast();
  const { tenant, updateTenant } = useTenant();

  const handlePublishToggle = async (published: boolean) => {
    await updateTenant({ is_published: published });
    
    toast({
      title: published ? "School Published" : "School Unpublished",
      description: published 
        ? "Your school website is now public and visible to everyone"
        : "Your school website is now private and only accessible to logged-in users",
    });
  };

  const previewUrl = tenant?.slug ? `/s/${tenant.slug}` : '#';
  const customDomainUrl = tenant?.custom_domain ? `https://${tenant.custom_domain}` : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publication Status
          </CardTitle>
          <CardDescription>
            Control the public visibility of your school website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="publish-toggle" className="text-base font-medium">
                  Public Website
                </Label>
                {tenant?.is_published ? (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Published
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <EyeOff className="h-3 w-3" />
                    Draft
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {tenant?.is_published 
                  ? "Your school website is visible to the public and search engines"
                  : "Your school website is private and only accessible to logged-in users"
                }
              </p>
            </div>
            <Switch
              id="publish-toggle"
              checked={tenant?.is_published || false}
              onCheckedChange={handlePublishToggle}
            />
          </div>

          {!tenant?.is_published && (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Your school website is currently in draft mode. Only logged-in users can access it.
                Enable publication to make it visible to everyone.
              </AlertDescription>
            </Alert>
          )}

          {tenant?.is_published && !tenant?.meta_title && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your website is published but missing SEO optimization. Consider adding a meta title 
                and description in the SEO settings tab.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website URLs</CardTitle>
          <CardDescription>
            Access your school website through these URLs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Default URL</div>
                <div className="text-sm text-muted-foreground font-mono">{previewUrl}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Preview
                  </a>
                </Button>
              </div>
            </div>

            {customDomainUrl && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Custom Domain</div>
                  <div className="text-sm text-muted-foreground font-mono">{customDomainUrl}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Primary</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a href={customDomainUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Indexing</CardTitle>
          <CardDescription>
            Control how search engines discover and index your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Search Engine Indexing</Label>
                <p className="text-sm text-muted-foreground">
                  Allow search engines to index and display your website in search results
                </p>
              </div>
              <Switch
                checked={tenant?.is_published || false}
                disabled={true}
              />
            </div>
            
            <Alert>
              <AlertDescription>
                Search engine indexing is automatically enabled when your website is published.
                Unpublishing will prevent search engines from indexing your content.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
