
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParentPortal } from '@/components/communications/ParentPortal';
import { TeacherMessaging } from '@/components/communications/TeacherMessaging';
import { AnnouncementSystem } from '@/components/communications/AnnouncementSystem';
import { ExternalIntegrations } from '@/components/communications/ExternalIntegrations';
import { MessageSquare, Users, Megaphone, Settings, Mail, Phone } from 'lucide-react';

export default function CommunicationHub() {
  const stats = [
    { title: 'Active Parent Portals', value: '1,245', icon: Users, color: 'text-blue-600' },
    { title: 'Messages Today', value: '342', icon: MessageSquare, color: 'text-green-600' },
    { title: 'Announcements', value: '23', icon: Megaphone, color: 'text-purple-600' },
    { title: 'SMS Sent', value: '156', icon: Phone, color: 'text-orange-600' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Communication Hub</h1>
          <p className="text-muted-foreground">Integrated communication with external platforms</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="parent-portal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="parent-portal">Parent Portal</TabsTrigger>
          <TabsTrigger value="teacher-messaging">Teacher Messaging</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="integrations">External Apps</TabsTrigger>
        </TabsList>

        <TabsContent value="parent-portal">
          <ParentPortal />
        </TabsContent>

        <TabsContent value="teacher-messaging">
          <TeacherMessaging />
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementSystem />
        </TabsContent>

        <TabsContent value="integrations">
          <ExternalIntegrations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
