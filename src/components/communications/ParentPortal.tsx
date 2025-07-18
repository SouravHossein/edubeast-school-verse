
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, FileText, CreditCard, MessageSquare, Calendar, Send, Download, Eye, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ParentPortal: React.FC = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [reportType, setReportType] = useState('');

  const progressReports = [
    {
      id: '1',
      student: 'John Smith',
      class: 'Class 10-A',
      type: 'Weekly Progress',
      date: '2024-01-15',
      status: 'sent',
      gmailThreadId: 'thread_abc123'
    },
    {
      id: '2',
      student: 'Sarah Johnson',
      class: 'Class 9-B',
      type: 'Monthly Summary',
      date: '2024-01-10',
      status: 'pending',
      gmailThreadId: null
    }
  ];

  const homeworkAssignments = [
    {
      id: '1',
      subject: 'Mathematics',
      class: 'Class 10-A',
      title: 'Quadratic Equations Practice',
      dueDate: '2024-01-20',
      platform: 'Google Classroom',
      link: 'https://classroom.google.com/assignment123',
      whatsappShared: true
    },
    {
      id: '2',
      subject: 'English',
      class: 'Class 9-B',
      title: 'Essay Writing Assignment',
      dueDate: '2024-01-18',
      platform: 'Google Forms',
      link: 'https://forms.google.com/form456',
      whatsappShared: false
    }
  ];

  const feeInvoices = [
    {
      id: '1',
      student: 'John Smith',
      amount: '₹15,000',
      dueDate: '2024-01-25',
      type: 'Tuition Fee',
      status: 'pending',
      paymentLink: 'https://payment.sslcommerz.com/invoice789'
    },
    {
      id: '2',
      student: 'Sarah Johnson',
      amount: '₹8,500',
      dueDate: '2024-01-30',
      type: 'Transport Fee',
      status: 'paid',
      paymentLink: null
    }
  ];

  const handleSendProgressReport = () => {
    toast({
      title: "Progress Report Sent",
      description: "Weekly progress report has been sent via Gmail",
    });
  };

  const handleShareHomework = (platform: string) => {
    toast({
      title: `Homework Shared`,
      description: `Assignment shared via ${platform}`,
    });
  };

  const handleSendFeeInvoice = () => {
    toast({
      title: "Fee Invoice Sent",
      description: "Invoice sent via Gmail with payment link",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="progress-reports" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress-reports">Progress Reports</TabsTrigger>
          <TabsTrigger value="homework">Homework</TabsTrigger>
          <TabsTrigger value="fee-invoices">Fee Invoices</TabsTrigger>
          <TabsTrigger value="whatsapp-alerts">WhatsApp Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="progress-reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Send Progress Reports
                </CardTitle>
                <CardDescription>
                  Generate and send automated progress reports via Gmail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="class-select">Select Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class-10a">Class 10-A</SelectItem>
                      <SelectItem value="class-9b">Class 9-B</SelectItem>
                      <SelectItem value="class-8c">Class 8-C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly Progress</SelectItem>
                      <SelectItem value="monthly">Monthly Summary</SelectItem>
                      <SelectItem value="term">Term Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSendProgressReport} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send via Gmail
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Progress Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{report.student}</p>
                        <p className="text-sm text-muted-foreground">{report.type} - {report.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={report.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {report.status}
                        </Badge>
                        {report.gmailThreadId && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="homework">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Share Homework Assignment
                </CardTitle>
                <CardDescription>
                  Share assignments via Google Classroom or WhatsApp groups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter subject" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignment-title">Assignment Title</Label>
                  <Input id="assignment-title" placeholder="Enter assignment title" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Share Platform</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google-classroom">Google Classroom</SelectItem>
                      <SelectItem value="google-forms">Google Forms</SelectItem>
                      <SelectItem value="google-drive">Google Drive</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp Groups</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleShareHomework('Google Classroom')} className="flex-1">
                    Share to Classroom
                  </Button>
                  <Button onClick={() => handleShareHomework('WhatsApp')} variant="outline" className="flex-1">
                    Share to WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Homework Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {homeworkAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <Badge variant="outline">{assignment.subject}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Due: {assignment.dueDate} | {assignment.class}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={assignment.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {assignment.platform}
                          </a>
                        </Button>
                        {assignment.whatsappShared && (
                          <Badge className="bg-green-100 text-green-800">WhatsApp Shared</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fee-invoices">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Send Fee Invoice
                </CardTitle>
                <CardDescription>
                  Generate and send fee invoices via Gmail with payment links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-select">Select Student</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="mike-brown">Mike Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fee-type">Fee Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition Fee</SelectItem>
                      <SelectItem value="transport">Transport Fee</SelectItem>
                      <SelectItem value="examination">Examination Fee</SelectItem>
                      <SelectItem value="miscellaneous">Miscellaneous Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" placeholder="Enter amount" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-gateway">Payment Gateway</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sslcommerz">SSL Commerz</SelectItem>
                      <SelectItem value="bkash">bKash</SelectItem>
                      <SelectItem value="nagad">Nagad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSendFeeInvoice} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invoice via Gmail
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Fee Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feeInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{invoice.student}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.type} - {invoice.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {invoice.status}
                        </Badge>
                        {invoice.paymentLink && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={invoice.paymentLink} target="_blank" rel="noopener noreferrer">
                              <CreditCard className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp-alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                WhatsApp Business API Alerts
              </CardTitle>
              <CardDescription>
                Configure automated alerts for attendance, exam results, and other notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Attendance Alerts', description: 'Daily attendance summaries', enabled: true },
                  { name: 'Exam Results', description: 'Result notifications', enabled: true },
                  { name: 'Fee Reminders', description: 'Payment due alerts', enabled: true },
                  { name: 'Holiday Announcements', description: 'School closure notifications', enabled: false }
                ].map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <Badge className={alert.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {alert.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-token">WhatsApp Business API Token</Label>
                <Input id="whatsapp-token" type="password" placeholder="Enter your WhatsApp Business API token" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-number">Test Phone Number</Label>
                <Input id="test-number" placeholder="+880123456789" />
              </div>

              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Test WhatsApp Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
