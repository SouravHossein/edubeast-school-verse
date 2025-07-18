
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Mail, ExternalLink, Settings, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TeacherMessaging: React.FC = () => {
  const { toast } = useToast();

  const googleChatSpaces = [
    {
      id: '1',
      name: 'Class 10-A Teachers',
      type: 'class',
      members: 8,
      link: 'https://chat.google.com/space/abc123',
      active: true
    },
    {
      id: '2',
      name: 'Mathematics Department',
      type: 'department',
      members: 12,
      link: 'https://chat.google.com/space/def456',
      active: true
    },
    {
      id: '3',
      name: 'School Admin Team',
      type: 'admin',
      members: 5,
      link: 'https://chat.google.com/space/ghi789',
      active: false
    }
  ];

  const whatsappGroups = [
    {
      id: '1',
      name: 'Class 9-B Teachers',
      type: 'class',
      members: 6,
      adminOnly: true,
      active: true
    },
    {
      id: '2',
      name: 'Science Department',
      type: 'department',
      members: 15,
      adminOnly: false,
      active: true
    },
    {
      id: '3',
      name: 'Emergency Alerts',
      type: 'emergency',
      members: 45,
      adminOnly: true,
      active: true
    }
  ];

  const gmailFilters = [
    {
      id: '1',
      name: 'Parent Queries',
      label: 'Parent-Communication',
      criteria: 'from:parent',
      autoReply: true
    },
    {
      id: '2',
      name: 'Student Issues',
      label: 'Student-Support',
      criteria: 'subject:student help',
      autoReply: false
    },
    {
      id: '3',
      name: 'Administrative',
      label: 'Admin-Tasks',
      criteria: 'from:admin@school.edu',
      autoReply: false
    }
  ];

  const handleCreateChatSpace = () => {
    toast({
      title: "Chat Space Created",
      description: "New Google Chat space has been created and invites sent",
    });
  };

  const handleCreateWhatsAppGroup = () => {
    toast({
      title: "WhatsApp Group Created",
      description: "New WhatsApp group created with selected teachers",
    });
  };

  const handleSetupGmailFilter = () => {
    toast({
      title: "Gmail Filter Setup",
      description: "Gmail filter and labels have been configured",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="google-chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="google-chat">Google Chat Spaces</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Groups</TabsTrigger>
          <TabsTrigger value="gmail-organization">Gmail Organization</TabsTrigger>
        </TabsList>

        <TabsContent value="google-chat">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Create Google Chat Space
                </CardTitle>
                <CardDescription>
                  Create private or class-wise Google Chat spaces for teacher communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="space-name">Space Name</Label>
                  <Input id="space-name" placeholder="e.g., Class 10-A Teachers" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="space-type">Space Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select space type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class-wise</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                      <SelectItem value="admin">Administrative</SelectItem>
                      <SelectItem value="project">Project-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teachers">Add Teachers</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teachers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-class-teachers">All Class Teachers</SelectItem>
                      <SelectItem value="math-dept">Mathematics Department</SelectItem>
                      <SelectItem value="science-dept">Science Department</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleCreateChatSpace} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Chat Space
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Google Chat Spaces</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {googleChatSpaces.map((space) => (
                    <div key={space.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{space.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {space.members} members • {space.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={space.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {space.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <a href={space.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Create WhatsApp Group
                </CardTitle>
                <CardDescription>
                  Create class-specific WhatsApp groups with admin controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-group-name">Group Name</Label>
                  <Input id="whatsapp-group-name" placeholder="e.g., Class 9-B Teachers" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group-purpose">Group Purpose</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class Communication</SelectItem>
                      <SelectItem value="department">Department Updates</SelectItem>
                      <SelectItem value="emergency">Emergency Alerts</SelectItem>
                      <SelectItem value="announcements">Announcements Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Admin-only Posting</p>
                    <p className="text-sm text-muted-foreground">Only admins can send messages</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>

                <Button onClick={handleCreateWhatsAppGroup} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create WhatsApp Group
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {whatsappGroups.map((group) => (
                    <div key={group.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{group.name}</h4>
                        <Badge className={group.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {group.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {group.members} members • {group.type}
                        </p>
                        {group.adminOnly && (
                          <Badge variant="outline">Admin Only</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gmail-organization">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Setup Gmail Filters & Labels
                </CardTitle>
                <CardDescription>
                  Organize school emails with automatic filters and labels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-name">Filter Name</Label>
                  <Input id="filter-name" placeholder="e.g., Parent Queries" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filter-criteria">Filter Criteria</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select criteria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="from-parent">From: Parent emails</SelectItem>
                      <SelectItem value="subject-student">Subject: Student related</SelectItem>
                      <SelectItem value="from-admin">From: Admin emails</SelectItem>
                      <SelectItem value="urgent">Contains: Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gmail-label">Gmail Label</Label>
                  <Input id="gmail-label" placeholder="e.g., Parent-Communication" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto-Reply</p>
                    <p className="text-sm text-muted-foreground">Send automatic acknowledgment</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>

                <Button onClick={handleSetupGmailFilter} className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Setup Filter & Label
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Gmail Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gmailFilters.map((filter) => (
                    <div key={filter.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{filter.name}</h4>
                        <Badge variant="outline">{filter.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Criteria: {filter.criteria}
                      </p>
                      {filter.autoReply && (
                        <Badge className="bg-blue-100 text-blue-800">Auto-Reply Enabled</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
