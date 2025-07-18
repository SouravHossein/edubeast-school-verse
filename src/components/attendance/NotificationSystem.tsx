
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, MessageSquare, Send, Settings, Users, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'absence' | 'late' | 'daily_summary' | 'holiday' | 'emergency';
  channel: 'sms' | 'email' | 'push' | 'all';
  template: string;
  enabled: boolean;
}

export const NotificationSystem: React.FC = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');

  const notificationTemplates: NotificationTemplate[] = [
    {
      id: '1',
      name: 'Student Absence Alert',
      type: 'absence',
      channel: 'all',
      template: 'Dear {parent_name}, {student_name} was absent from school today ({date}). Please contact the school if this was planned.',
      enabled: true
    },
    {
      id: '2',
      name: 'Late Arrival Notice',
      type: 'late',
      channel: 'sms',
      template: '{student_name} arrived late to school at {time} on {date}. Regular punctuality is important for academic success.',
      enabled: true
    },
    {
      id: '3',
      name: 'Daily Attendance Summary',
      type: 'daily_summary',
      channel: 'email',
      template: 'Daily Attendance Summary for {date}: Present: {present_count}, Absent: {absent_count}, Late: {late_count}',
      enabled: true
    },
    {
      id: '4',
      name: 'Holiday Announcement',
      type: 'holiday',
      channel: 'all',
      template: 'School Holiday Notice: {holiday_name} on {date}. School will remain closed. Classes will resume on {resume_date}.',
      enabled: true
    }
  ];

  const recentNotifications = [
    {
      id: '1',
      type: 'absence',
      recipient: 'Parent - John Doe',
      message: 'Student absence notification sent',
      channel: 'SMS',
      time: '10:30 AM',
      status: 'delivered'
    },
    {
      id: '2',
      type: 'daily_summary',
      recipient: 'All Teachers',
      message: 'Daily attendance summary',
      channel: 'Email',
      time: '09:00 AM',
      status: 'delivered'
    },
    {
      id: '3',
      type: 'late',
      recipient: 'Parent - Jane Smith',
      message: 'Late arrival notification',
      channel: 'Push',
      time: '08:45 AM',
      status: 'pending'
    }
  ];

  const handleSendNotification = () => {
    if (!customMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Notification Sent",
      description: "Your notification has been sent successfully",
    });
    setCustomMessage('');
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return <MessageSquare className="h-4 w-4" />;
      case 'Email':
        return <Mail className="h-4 w-4" />;
      case 'Push':
        return <Bell className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="send" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="send">Send Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Send */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Quick Send
                </CardTitle>
                <CardDescription>
                  Send instant notifications to parents, teachers, or students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_parents">All Parents</SelectItem>
                      <SelectItem value="all_teachers">All Teachers</SelectItem>
                      <SelectItem value="class_parents">Class Parents</SelectItem>
                      <SelectItem value="absent_parents">Parents of Absent Students</SelectItem>
                      <SelectItem value="custom">Custom Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channel">Channel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS Only</SelectItem>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="all">All Channels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button onClick={handleSendNotification} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </CardContent>
            </Card>

            {/* Automated Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Automated Alerts
                </CardTitle>
                <CardDescription>
                  Configure automatic notifications for various events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Student Absence Alert', description: 'Notify parents when student is absent', enabled: true },
                  { name: 'Late Arrival Alert', description: 'Alert parents about late arrivals', enabled: true },
                  { name: 'Daily Summary', description: 'Send daily attendance summary to teachers', enabled: true },
                  { name: 'Low Attendance Warning', description: 'Alert when student attendance drops below 75%', enabled: false }
                ].map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <Switch checked={alert.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Manage and customize notification templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="outline">{template.type}</Badge>
                        <Badge className={template.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {template.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Switch checked={template.enabled} />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Channel: {template.channel.toUpperCase()}
                    </p>
                    <p className="text-sm bg-muted p-2 rounded">
                      {template.template}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                View sent notifications and their delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getChannelIcon(notification.channel)}
                      <div>
                        <p className="font-medium">{notification.message}</p>
                        <p className="text-sm text-muted-foreground">{notification.recipient}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{notification.time}</p>
                        <p className="text-xs text-muted-foreground">{notification.channel}</p>
                      </div>
                      <Badge className={getStatusColor(notification.status)}>
                        {notification.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SMS Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-provider">SMS Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SMS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="local">Local Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-id">Sender ID</Label>
                  <Input id="sender-id" placeholder="SCHOOL" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-enabled">Enable SMS Notifications</Label>
                  <Switch id="sms-enabled" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-from">From Email</Label>
                  <Input id="email-from" placeholder="noreply@school.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-name">From Name</Label>
                  <Input id="email-name" placeholder="School Name" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-enabled">Enable Email Notifications</Label>
                  <Switch id="email-enabled" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fcm-key">FCM Server Key</Label>
                  <Input id="fcm-key" type="password" placeholder="Enter FCM key" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-enabled">Enable Push Notifications</Label>
                  <Switch id="push-enabled" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Timing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="daily-summary-time">Daily Summary Time</Label>
                  <Input id="daily-summary-time" type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="absence-delay">Absence Alert Delay (minutes)</Label>
                  <Input id="absence-delay" type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
