
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Megaphone, Calendar, Mail, MessageSquare, Send, Users, Clock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AnnouncementSystem: React.FC = () => {
  const { toast } = useToast();
  const [announcementText, setAnnouncementText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const calendarEvents = [
    {
      id: '1',
      title: 'Annual Sports Day',
      date: '2024-02-15',
      type: 'Event',
      audience: 'All Students & Parents',
      calendarLink: 'https://calendar.google.com/event/abc123'
    },
    {
      id: '2',
      title: 'Parent-Teacher Meeting',
      date: '2024-02-10',
      type: 'Meeting',
      audience: 'All Parents',
      calendarLink: 'https://calendar.google.com/event/def456'
    },
    {
      id: '3',
      title: 'Mid-term Examinations',
      date: '2024-02-20',
      type: 'Exam',
      audience: 'Students & Teachers',
      calendarLink: 'https://calendar.google.com/event/ghi789'
    }
  ];

  const emailCampaigns = [
    {
      id: '1',
      subject: 'School Reopening Notice',
      audience: 'All Parents',
      sent: 1245,
      opened: 987,
      platform: 'Mailchimp',
      status: 'sent'
    },
    {
      id: '2',
      subject: 'Fee Payment Reminder',
      audience: 'Parents with Due Fees',
      sent: 234,
      opened: 156,
      platform: 'Gmail Labels',
      status: 'sent'
    },
    {
      id: '3',
      subject: 'Teacher Training Workshop',
      audience: 'All Teachers',
      sent: 0,
      opened: 0,
      platform: 'Gmail Labels',
      status: 'draft'
    }
  ];

  const whatsappBroadcasts = [
    {
      id: '1',
      message: 'School will remain closed tomorrow due to heavy rain',
      type: 'Emergency',
      sent: 456,
      delivered: 445,
      status: 'delivered'
    },
    {
      id: '2',
      message: 'Exam timetable has been updated. Please check the website',
      type: 'Academic',
      sent: 234,
      delivered: 230,
      status: 'delivered'
    },
    {
      id: '3',
      message: 'Annual function registration now open',
      type: 'Event',
      sent: 0,
      delivered: 0,
      status: 'pending'
    }
  ];

  const telegramAlerts = [
    {
      id: '1',
      message: 'System maintenance scheduled for tonight',
      type: 'System',
      subscribers: 45,
      status: 'active'
    },
    {
      id: '2',
      message: 'New admission forms are now available',
      type: 'Admission',
      subscribers: 78,
      status: 'active'
    }
  ];

  const handleCreateCalendarEvent = () => {
    toast({
      title: "Calendar Event Created",
      description: "Event added to Google Calendar with invitations sent",
    });
  };

  const handleSendEmailCampaign = () => {
    toast({
      title: "Email Campaign Sent",
      description: "Bulk announcement sent via selected platform",
    });
  };

  const handleSendWhatsAppBroadcast = () => {
    toast({
      title: "WhatsApp Broadcast Sent",
      description: "Message sent to all broadcast list members",
    });
  };

  const handleSendTelegramAlert = () => {
    toast({
      title: "Telegram Alert Sent",
      description: "Push notification sent to all subscribers",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calendar-events" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar-events">Calendar Events</TabsTrigger>
          <TabsTrigger value="email-campaigns">Email Campaigns</TabsTrigger>
          <TabsTrigger value="whatsapp-broadcast">WhatsApp Broadcast</TabsTrigger>
          <TabsTrigger value="telegram-alerts">Telegram Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar-events">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Create Calendar Event
                </CardTitle>
                <CardDescription>
                  Create events in Google Calendar and invite specific roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input id="event-title" placeholder="e.g., Annual Sports Day" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-date">Event Date</Label>
                  <Input id="event-date" type="datetime-local" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-type">Event Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="exam">Examination</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-audience">Invite Audience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="students">All Students</SelectItem>
                      <SelectItem value="parents">All Parents</SelectItem>
                      <SelectItem value="teachers">All Teachers</SelectItem>
                      <SelectItem value="staff">All Staff</SelectItem>
                      <SelectItem value="class-specific">Specific Classes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea id="event-description" placeholder="Event details..." />
                </div>

                <Button onClick={handleCreateCalendarEvent} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create & Send Invites
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Calendar Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calendarEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {event.date} • {event.audience}
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={event.calendarLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View in Calendar
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email-campaigns">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Create Email Campaign
                </CardTitle>
                <CardDescription>
                  Send role-based announcements via Mailchimp or Gmail Labels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input id="email-subject" placeholder="e.g., Important School Notice" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-platform">Email Platform</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mailchimp">Mailchimp</SelectItem>
                      <SelectItem value="gmail-labels">Gmail Labels</SelectItem>
                      <SelectItem value="school-email">School Email System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-parents">All Parents</SelectItem>
                      <SelectItem value="all-teachers">All Teachers</SelectItem>
                      <SelectItem value="all-students">All Students</SelectItem>
                      <SelectItem value="all-staff">All Staff</SelectItem>
                      <SelectItem value="class-parents">Class-specific Parents</SelectItem>
                      <SelectItem value="department">Department-specific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-content">Email Content</Label>
                  <Textarea 
                    id="email-content" 
                    placeholder="Write your announcement here..."
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    rows={5}
                  />
                </div>

                <Button onClick={handleSendEmailCampaign} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email Campaign
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Campaign History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emailCampaigns.map((campaign) => (
                    <div key={campaign.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{campaign.subject}</h4>
                        <Badge className={campaign.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {campaign.audience} • {campaign.platform}
                      </p>
                      {campaign.status === 'sent' && (
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Sent: {campaign.sent}</span>
                          <span>Opened: {campaign.opened}</span>
                          <span>Rate: {Math.round((campaign.opened / campaign.sent) * 100)}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp-broadcast">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp Broadcast
                </CardTitle>
                <CardDescription>
                  Send quick alerts via WhatsApp broadcast lists (admin only)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="broadcast-type">Broadcast Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Alert</SelectItem>
                      <SelectItem value="academic">Academic Update</SelectItem>
                      <SelectItem value="event">Event Notification</SelectItem>
                      <SelectItem value="general">General Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="broadcast-audience">Broadcast List</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select broadcast list" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-parents">All Parents</SelectItem>
                      <SelectItem value="all-teachers">All Teachers</SelectItem>
                      <SelectItem value="class-parents">Class Parents</SelectItem>
                      <SelectItem value="emergency-contacts">Emergency Contacts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="broadcast-message">Message</Label>
                  <Textarea 
                    id="broadcast-message" 
                    placeholder="Type your message (max 256 characters)..."
                    maxLength={256}
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Schedule Send</p>
                    <p className="text-sm text-muted-foreground">Send message at specific time</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>

                <Button onClick={handleSendWhatsAppBroadcast} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Broadcast
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Broadcast History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {whatsappBroadcasts.map((broadcast) => (
                    <div key={broadcast.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{broadcast.type}</Badge>
                        <Badge className={broadcast.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {broadcast.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{broadcast.message}</p>
                      {broadcast.status === 'delivered' && (
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Sent: {broadcast.sent}</span>
                          <span>Delivered: {broadcast.delivered}</span>
                          <span>Rate: {Math.round((broadcast.delivered / broadcast.sent) * 100)}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="telegram-alerts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Telegram Push Notifications
                </CardTitle>
                <CardDescription>
                  Send push notifications via Telegram bots (simple, light storage)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="telegram-bot-token">Telegram Bot Token</Label>
                  <Input id="telegram-bot-token" type="password" placeholder="Enter your Telegram bot token" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-type">Alert Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System Updates</SelectItem>
                      <SelectItem value="admission">Admission Alerts</SelectItem>
                      <SelectItem value="emergency">Emergency Notifications</SelectItem>
                      <SelectItem value="academic">Academic Updates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram-message">Message</Label>
                  <Textarea 
                    id="telegram-message" 
                    placeholder="Type your push notification message..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subscriber-count">Subscribers</Label>
                  <Input id="subscriber-count" value="123 active subscribers" readOnly />
                </div>

                <Button onClick={handleSendTelegramAlert} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Push Notification
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Telegram Bots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {telegramAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{alert.type}</Badge>
                        <Badge className={alert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{alert.subscribers} subscribers</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Telegram bots are lightweight and don't require database storage for messages. Perfect for simple push notifications!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
