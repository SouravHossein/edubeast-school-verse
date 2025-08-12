
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/useTenant';
import { Globe, Check, AlertCircle, Copy } from 'lucide-react';

interface Domain {
  id: string;
  domain: string;
  is_primary: boolean;
  verification_token?: string;
  verified_at?: string;
  dns_instructions: any;
}

export const DomainManager: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { tenant } = useTenant();

  React.useEffect(() => {
    loadDomains();
  }, [tenant]);

  const loadDomains = async () => {
    if (!tenant) return;

    try {
      const { data, error } = await supabase
        .from('school_domains')
        .select('*')
        .eq('school_id', tenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDomains(data || []);
    } catch (error) {
      console.error('Error loading domains:', error);
    }
  };

  const addDomain = async () => {
    if (!tenant || !newDomain.trim()) return;

    setLoading(true);
    try {
      const verificationToken = `verify-${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase
        .from('school_domains')
        .insert({
          school_id: tenant.id,
          domain: newDomain.trim(),
          verification_token: verificationToken,
          dns_instructions: {
            type: 'A',
            name: '@',
            value: '185.158.133.1',
            ttl: 300
          }
        });

      if (error) throw error;

      setNewDomain('');
      loadDomains();
      toast({
        title: "Domain added",
        description: "Follow the DNS instructions to verify your domain.",
      });
    } catch (error) {
      console.error('Error adding domain:', error);
      toast({
        title: "Failed to add domain",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "DNS record value copied.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Custom Domains
          </CardTitle>
          <CardDescription>
            Connect your own domain to your school website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="yourdomain.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDomain()}
            />
            <Button onClick={addDomain} disabled={loading || !newDomain.trim()}>
              Add Domain
            </Button>
          </div>

          {domains.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Connected Domains</h4>
              {domains.map((domain) => (
                <div key={domain.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{domain.domain}</span>
                      {domain.verified_at ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Pending
                        </Badge>
                      )}
                      {domain.is_primary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                    </div>
                  </div>

                  {!domain.verified_at && domain.dns_instructions && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">DNS Configuration Required:</p>
                          <div className="bg-muted p-3 rounded font-mono text-sm">
                            <div className="flex items-center justify-between">
                              <span>Type: A</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Name: @</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Value: 185.158.133.1</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard('185.158.133.1')}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Add this A record to your domain's DNS settings. Verification may take up to 48 hours.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
