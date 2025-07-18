
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Mail, MessageSquare, Send, Settings, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReminderRule {
  id: string;
  name: string;
  triggerDays: number;
  reminderType: 'before' | 'after';
  channels: ('email' | 'sms')[];
  template: string;
  active: boolean;
}

interface DueStudent {
  id: string;
  studentId: string;
  studentName: string;
  parentEmail: string;
  parentPhone: string;
  amount: number;
  feeType: string;
  dueDate: string;
  daysPastDue: number;
  lastReminder?: string;
}

export const DueReminders = () => {
  const { toast } = useToast();
  
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([
    {
      id: '1',
      name: '3 Days Before Due',
      triggerDays: 3,
      reminderType: 'before',
      channels: ['email', 'sms'],
      template: 'Dear Parent, your child\'s fee of ₹{amount} for {feeType} is due on {dueDate}. Please make the payment to avoid any inconvenience.',
      active: true
    },
    {
      id: '2',
      name: '1 Day After Due',
      triggerDays: 1,
      reminderType: 'after',
      channels: ['email', 'sms'],
      template: 'Dear Parent, the fee payment of ₹{amount} for {feeType} was due on {dueDate}. Please make the payment immediately to avoid late fees.',
      active: true
    },
    {
      id: '3',
      name: '7 Days After Due',
      triggerDays: 7,
      reminderType: 'after',
      channels: ['email'],
      template: 'Dear Parent, this is a final reminder for the overdue fee of ₹{amount} for {feeType}. Late fees will be applied if payment is not received within 2 days.',
      active: true
    }
  ]);

  const [dueStudents] = useState<DueStudent[]>([
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'John Doe',
      parentEmail: 'john.parent@email.com',
      parentPhone: '+1234567890',
      amount: 5000,
      feeType: 'Tuition Fee',
      dueDate: '2024-01-15',
      daysPastDue: 0,
      lastReminder: '2024-01-12'
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Jane Smith',
      parentEmail: 'jane.parent@email.com',
      parentPhone: '+1234567891',
      amount: 1500,
      feeType: 'Transport Fee',
      dueDate: '2023-12-20',
      daysPastDue: 26,
      lastReminder: '2024-01-10'
    }
  ]);

  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showBulkReminderDialog, setShowBulkReminderDialog] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ReminderRule>>({});
  const [bulkMessage, setBulkMessage] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleSendBulkReminders = async () => {
    try {
      toast({
        title: "Sending Reminders",
        description: `Sending reminders to ${selectedStudents.length} students...`,
      });

      // Simulate sending reminders
      setTimeout(() => {
        toast({
          title: "Reminders Sent",
          description: `Successfully sent reminders to ${selectedStudents.length} students.`,
        });
        setShowBulkReminderDialog(false);
        setSelectedStudents([]);
        setBulkMessage('');
      }, 2000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminders. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendIndividualReminder = async (student: DueStudent) => {
    try {
      toast({
        title: "Sending Reminder",
        description: `Sending reminder to ${student.studentName}...`,
      });

      // Simulate sending reminder
      setTimeout(() => {
        toast({
          title: "Reminder Sent",
          description: `Reminder sent to ${student.studentName} successfully.`,
        });
      }, 1000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleRule = (id: string) => {
    setReminderRules(rules => 
      rules.map(rule => 
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const getDueBadgeVariant = (daysPastDue: number) => {
    if (daysPastDue > 30) return 'destructive';
    if (daysPastDue > 7) return 'secondary';
    if (daysPastDue > 0) return 'outline';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              ₹45,000 total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              ₹18,500 total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Payment after reminder
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Students with Due Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Due Payments</CardTitle>
              <CardDescription>
                Students with upcoming or overdue fee payments
              </CardDescription>
            </div>
            <Dialog open={showBulkReminderDialog} onOpenChange={setShowBulkReminderDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Bulk Reminders
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send Bulk Reminders</DialogTitle>
                  <DialogDescription>
                    Send payment reminders to selected students
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Message Template</Label>
                    <Textarea
                      value={bulkMessage}
                      onChange={(e) => setBulkMessage(e.target.value)}
                      placeholder="Dear Parent, this is a reminder that your child's fee payment is due..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Selected Students: {selectedStudents.length}</Label>
                    <div className="max-h-40 overflow-y-auto border rounded p-2 mt-2">
                      {dueStudents.map((student) => (
                        <div key={student.id} className="flex items-center space-x-2 py-1">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudents([...selectedStudents, student.id]);
                              } else {
                                setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                              }
                            }}
                          />
                          <span className="text-sm">{student.studentName} - ₹{student.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowBulkReminderDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendBulkReminders}
                    disabled={selectedStudents.length === 0 || !bulkMessage}
                  >
                    Send Reminders
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Reminder</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dueStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-sm text-muted-foreground">{student.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {student.parentEmail}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MessageSquare className="h-3 w-3" />
                        {student.parentPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.feeType}</TableCell>
                  <TableCell>₹{student.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(student.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getDueBadgeVariant(student.daysPastDue)}>
                      {student.daysPastDue === 0 ? 'Due Today' : 
                       student.daysPastDue > 0 ? `${student.daysPastDue} days overdue` : 
                       `Due in ${Math.abs(student.daysPastDue)} days`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.lastReminder && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(student.lastReminder).toLocaleDateString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSendIndividualReminder(student)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reminder Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Automated Reminder Rules</CardTitle>
              <CardDescription>
                Configure automatic reminder triggers and templates
              </CardDescription>
            </div>
            <Button onClick={() => setShowRuleDialog(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Template Preview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminderRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {rule.triggerDays} days {rule.reminderType} due
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {rule.channels.map((channel) => (
                        <Badge key={channel} variant="secondary">
                          {channel === 'email' ? <Mail className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {rule.template}
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.active ? 'default' : 'secondary'}>
                      {rule.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
