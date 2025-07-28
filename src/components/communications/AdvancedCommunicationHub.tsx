import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Mail, Phone, Bell, Users, Send, Calendar, AlertTriangle, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: Date;
  type: 'email' | 'sms' | 'push' | 'in_app';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  urgent: boolean;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  targetAudience: string[];
  channels: string[];
  scheduledFor?: Date;
  status: 'draft' | 'scheduled' | 'published';
  urgent: boolean;
}

interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  children: string[];
  lastSeen: Date;
  preferredChannel: 'email' | 'sms' | 'app';
}

export const AdvancedCommunicationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    type: 'email' as Message['type'],
    urgent: false
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    targetAudience: [] as string[],
    channels: [] as string[],
    urgent: false
  });

  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'John Doe (Parent)',
      recipient: 'Ms. Smith (Teacher)',
      subject: 'Question about homework',
      content: 'Could you please clarify the math assignment for this week?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'email',
      status: 'read',
      urgent: false
    },
    {
      id: '2',
      sender: 'School Admin',
      recipient: 'All Parents',
      subject: 'School closure notice',
      content: 'Due to weather conditions, school will be closed tomorrow.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'sms',
      status: 'delivered',
      urgent: true
    }
  ]);

  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Annual Sports Day',
      content: 'Join us for our annual sports day celebration on Friday, July 25th.',
      author: 'Principal Office',
      targetAudience: ['parents', 'students'],
      channels: ['email', 'sms', 'app'],
      status: 'published',
      urgent: false
    },
    {
      id: '2',
      title: 'Emergency Contact Update',
      content: 'Please update your emergency contact information by the end of this week.',
      author: 'Admin Office',
      targetAudience: ['parents'],
      channels: ['email', 'app'],
      status: 'scheduled',
      urgent: true
    }
  ]);

  const [parents] = useState<Parent[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1234567890',
      children: ['Alice Smith', 'Bob Smith'],
      lastSeen: new Date(Date.now() - 5 * 60 * 1000),
      preferredChannel: 'email'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1234567891',
      children: ['Emily Johnson'],
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      preferredChannel: 'sms'
    }
  ]);

  const { toast } = useToast();

  const sendMessage = () => {
    if (!newMessage.recipient || !newMessage.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `${newMessage.type.toUpperCase()} sent successfully!`,
    });

    setNewMessage({
      recipient: '',
      subject: '',
      content: '',
      type: 'email',
      urgent: false
    });
  };

  const publishAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Announcement Published",
      description: `Sent to ${newAnnouncement.targetAudience.length} audience groups via ${newAnnouncement.channels.length} channels.`,
    });

    setNewAnnouncement({
      title: '',
      content: '',
      targetAudience: [],
      channels: [],
      urgent: false
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': case 'draft': return 'secondary';
      case 'delivered': case 'scheduled': return 'default';
      case 'read': case 'published': return 'default';
      case 'failed': return 'destructive';
      default: return 'default';
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      case 'push': case 'app': return <Smartphone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const communicationStats = {
    totalMessages: 1247,
    deliveryRate: 98.5,
    responseRate: 76.3,
    activeParents: 89
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Advanced Communication Hub</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="parents">Parent Portal</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Communication Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                    <p className="text-2xl font-bold">{communicationStats.totalMessages.toLocaleString()}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                    <p className="text-2xl font-bold">{communicationStats.deliveryRate}%</p>
                  </div>
                  <Send className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                    <p className="text-2xl font-bold">{communicationStats.responseRate}%</p>
                  </div>
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Parents</p>
                    <p className="text-2xl font-bold">{communicationStats.activeParents}%</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest communication activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.slice(0, 5).map((message) => (
                  <div key={message.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getChannelIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{message.sender}</p>
                        <div className="flex items-center space-x-2">
                          {message.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                          <Badge variant={getStatusColor(message.status)} className="text-xs">
                            {message.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messaging" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compose Message */}
            <Card>
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
                <CardDescription>Send messages via multiple channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient</label>
                  <Select value={newMessage.recipient} onValueChange={(value) => setNewMessage(prev => ({ ...prev, recipient: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_parents">All Parents</SelectItem>
                      <SelectItem value="class_10a">Class 10-A Parents</SelectItem>
                      <SelectItem value="teachers">All Teachers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Channel</label>
                  <Select value={newMessage.type} onValueChange={(value: Message['type']) => setNewMessage(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="in_app">In-App Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter subject"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Type your message here..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgent"
                    checked={newMessage.urgent}
                    onCheckedChange={(checked) => setNewMessage(prev => ({ ...prev, urgent: checked }))}
                  />
                  <label htmlFor="urgent" className="text-sm font-medium">Mark as urgent</label>
                </div>

                <Button onClick={sendMessage} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Message History */}
            <Card>
              <CardHeader>
                <CardTitle>Message History</CardTitle>
                <CardDescription>Recent communication history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{message.sender}</p>
                          <div className="flex items-center space-x-1">
                            {getChannelIcon(message.type)}
                            <Badge variant={getStatusColor(message.status)} className="text-xs">
                              {message.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp.toRelativeTimeString ? message.timestamp.toRelativeTimeString() : message.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Announcement */}
            <Card>
              <CardHeader>
                <CardTitle>Create Announcement</CardTitle>
                <CardDescription>Broadcast to multiple audiences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Announcement title"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your announcement..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <div className="space-y-2">
                    {['Parents', 'Students', 'Teachers', 'Staff'].map((audience) => (
                      <div key={audience} className="flex items-center space-x-2">
                        <Switch id={audience.toLowerCase()} />
                        <label htmlFor={audience.toLowerCase()} className="text-sm">{audience}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Channels</label>
                  <div className="space-y-2">
                    {['Email', 'SMS', 'App Notification', 'Website'].map((channel) => (
                      <div key={channel} className="flex items-center space-x-2">
                        <Switch id={channel.toLowerCase().replace(' ', '_')} />
                        <label htmlFor={channel.toLowerCase().replace(' ', '_')} className="text-sm">{channel}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="urgent_announcement"
                    checked={newAnnouncement.urgent}
                    onCheckedChange={(checked) => setNewAnnouncement(prev => ({ ...prev, urgent: checked }))}
                  />
                  <label htmlFor="urgent_announcement" className="text-sm font-medium">Mark as urgent</label>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={publishAnnouncement} className="flex-1">
                    <Bell className="h-4 w-4 mr-2" />
                    Publish Now
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Announcements List */}
            <Card>
              <CardHeader>
                <CardTitle>Published Announcements</CardTitle>
                <CardDescription>Recent announcements and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <div className="flex items-center space-x-2">
                          {announcement.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                          <Badge variant={getStatusColor(announcement.status)} className="text-xs">
                            {announcement.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {announcement.author}</span>
                        <span>{announcement.targetAudience.length} groups • {announcement.channels.length} channels</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="parents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parent Communication</CardTitle>
              <CardDescription>Manage parent contacts and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parents.map((parent) => (
                  <div key={parent.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{parent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{parent.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Children: {parent.children.join(', ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Preferred: {parent.preferredChannel.toUpperCase()} • Last seen: {parent.lastSeen.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Emergency Communication</span>
              </CardTitle>
              <CardDescription>Send urgent alerts to all stakeholders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800">Emergency Alert System</h4>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  Use this system only for genuine emergencies. All alerts will be sent immediately to all registered contacts.
                </p>
                
                <div className="space-y-3">
                  <Textarea
                    placeholder="Enter emergency message..."
                    rows={3}
                    className="border-red-300 focus:border-red-500"
                  />
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Send Emergency Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};