
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, CheckCircle, AlertTriangle, Copy, ExternalLink, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTenant } from '@/hooks/useTenant';

interface Domain {
  id: string;
  domain: string;
  is_primary: boolean;
  verified_at: string | null;
  verification_token: string;
  dns_instructions: {
    type: string;
    name: string;
    value: string;
  }[];
}

export const DomainManager = () => {
  const { toast } = useToast();
  const { tenant } = useTenant();
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      domain: 'example.com',
      is_primary: true,
      verified_at: '2024-01-10T10:00:00Z',
      verification_token: 'abc123def456',
      dns_instructions: [
        { type: 'A', name: '@', value: '192.168.1.1' },
        { type: 'CNAME', name: 'www', value: 'example.com' }
      ]
    }
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;

    const domain: Domain = {
      id: Date.now().toString(),
      domain: newDomain.trim(),
      is_primary: false,
      verified_at: null,
      verification_token: Math.random().toString(36).substring(2),
      dns_instructions: [
        { type: 'A', name: '@', value: `${tenant?.slug}.lovable.app` },
        { type: 'CNAME', name: 'www', value: `${tenant?.slug}.lovable.app` },
        { type: 'TXT', name: '_verification', value: `school-verify=${Math.random().toString(36).substring(2)}` }
      ]
    };

    setDomains([...domains, domain]);
    setNewDomain('');
    setShowAddDialog(false);
    
    toast({
      title: "Domain Added",
      description: "Please configure your DNS settings to verify the domain.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "DNS record copied to clipboard",
    });
  };

  const verifyDomain = (domainId: string) => {
    setDomains(domains.map(domain => 
      domain.id === domainId 
        ? { ...domain, verified_at: new Date().toISOString() }
        : domain
    ));
    
    toast({
      title: "Domain Verified",
      description: "Your domain has been successfully verified.",
    });
  };

  const makePrimary = (domainId: string) => {
    setDomains(domains.map(domain => ({
      ...domain,
      is_primary: domain.id === domainId
    })));
    
    toast({
      title: "Primary Domain Updated",
      description: "Primary domain has been changed successfully.",
    });
  };

  const removeDomain = (domainId: string) => {
    setDomains(domains.filter(domain => domain.id !== domainId));
    toast({
      title: "Domain Removed",
      description: "Domain has been removed from your school.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Custom Domains
              </CardTitle>
              <CardDescription>
                Connect your own domain to your school website
              </CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Domain</DialogTitle>
                  <DialogDescription>
                    Enter your domain name to connect it to your school website
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="domain">Domain Name</Label>
                    <Input
                      id="domain"
                      placeholder="yourdomain.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDomain}>Add Domain</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No domains connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your own domain to make your school website accessible at your custom URL
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Domain
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{domain.domain}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      {domain.verified_at ? (
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {domain.is_primary && (
                        <Badge variant="outline">Primary</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!domain.verified_at && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verifyDomain(domain.id)}
                          >
                            Verify
                          </Button>
                        )}
                        {domain.verified_at && !domain.is_primary && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => makePrimary(domain.id)}
                          >
                            Make Primary
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDomain(domain.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DNS Instructions for unverified domains */}
      {domains.filter(d => !d.verified_at).map((domain) => (
        <Card key={`dns-${domain.id}`}>
          <CardHeader>
            <CardTitle>DNS Configuration for {domain.domain}</CardTitle>
            <CardDescription>
              Add these DNS records to your domain provider to verify and connect your domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                DNS changes can take up to 48 hours to propagate. After adding these records,
                click "Verify" to check the configuration.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {domain.dns_instructions.map((record, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <div className="font-mono">{record.type}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <div className="font-mono">{record.name}</div>
                  </div>
                  <div className="col-span-1">
                    <Label className="text-xs text-muted-foreground">Value</Label>
                    <div className="font-mono text-sm break-all">{record.value}</div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(record.value)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
