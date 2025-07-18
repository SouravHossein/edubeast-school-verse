import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  User, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  GraduationCap,
  BookOpen,
  Shield
} from 'lucide-react';
import { useApproval, type PendingUser } from '@/contexts/ApprovalContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const UserApprovals = () => {
  const { pendingUsers, approvedUsers, approveUser, rejectUser } = useApproval();
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [assignments, setAssignments] = useState({
    classes: [] as string[],
    subjects: [] as string[],
    linkedStudents: [] as string[]
  });

  const classOptions = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
    'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
    'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education'
  ];

  const handleApprove = async (userId: string) => {
    const user = pendingUsers.find(u => u.id === userId);
    if (!user) return;

    // For teachers, assignments are required
    if (user.role === 'teacher' && assignments.classes.length === 0) {
      return;
    }

    await approveUser(userId, assignments);
    setSelectedUser(null);
    setAssignments({ classes: [], subjects: [], linkedStudents: [] });
  };

  const handleReject = async (userId: string) => {
    await rejectUser(userId, 'Application does not meet requirements');
    setSelectedUser(null);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return GraduationCap;
      case 'student': return BookOpen;
      case 'parent': return Users;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const UserCard = ({ user, type }: { user: PendingUser | any, type: 'pending' | 'approved' }) => {
    const IconComponent = getRoleIcon(user.role);
    
    return (
      <Card className="hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">{user.fullName}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            <Badge className={getRoleColor(user.role)}>
              {user.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Applied:</span>
              <span>{new Date(user.appliedAt || user.approvedAt).toLocaleDateString()}</span>
            </div>
            
            {user.additionalInfo && (
              <>
                {user.additionalInfo.phone && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{user.additionalInfo.phone}</span>
                  </div>
                )}
                
                {user.role === 'teacher' && user.additionalInfo.subjects && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Subjects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.additionalInfo.subjects.slice(0, 3).map((subject: string) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {user.additionalInfo.subjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.additionalInfo.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {type === 'approved' && user.assignedClasses && user.assignedClasses.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Assigned Classes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.assignedClasses.slice(0, 3).map((className: string) => (
                        <Badge key={className} variant="secondary" className="text-xs">
                          {className}
                        </Badge>
                      ))}
                      {user.assignedClasses.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.assignedClasses.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {type === 'pending' && (
              <div className="flex space-x-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Review Application - {user.fullName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Personal Information</h4>
                          <div className="space-y-2 text-sm">
                            <div><strong>Name:</strong> {user.fullName}</div>
                            <div><strong>Email:</strong> {user.email}</div>
                            <div><strong>Role:</strong> {user.role}</div>
                            {user.additionalInfo?.phone && (
                              <div><strong>Phone:</strong> {user.additionalInfo.phone}</div>
                            )}
                            {user.additionalInfo?.address && (
                              <div><strong>Address:</strong> {user.additionalInfo.address}</div>
                            )}
                          </div>
                        </div>
                        
                        {user.role === 'teacher' && (
                          <div>
                            <h4 className="font-semibold mb-2">Teaching Information</h4>
                            <div className="space-y-2 text-sm">
                              {user.additionalInfo?.qualifications && (
                                <div>
                                  <strong>Qualifications:</strong>
                                  <p className="mt-1 text-muted-foreground">
                                    {user.additionalInfo.qualifications}
                                  </p>
                                </div>
                              )}
                              {user.additionalInfo?.experience && (
                                <div>
                                  <strong>Experience:</strong>
                                  <p className="mt-1 text-muted-foreground">
                                    {user.additionalInfo.experience}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {user.role === 'teacher' && (
                        <div className="space-y-4">
                          <h4 className="font-semibold">Class Assignments (Required)</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {classOptions.map((className) => (
                              <div key={className} className="flex items-center space-x-2">
                                <Checkbox
                                  id={className}
                                  checked={assignments.classes.includes(className)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setAssignments(prev => ({
                                        ...prev,
                                        classes: [...prev.classes, className]
                                      }));
                                    } else {
                                      setAssignments(prev => ({
                                        ...prev,
                                        classes: prev.classes.filter(c => c !== className)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={className} className="text-sm">
                                  {className}
                                </Label>
                              </div>
                            ))}
                          </div>
                          
                          <h4 className="font-semibold">Subject Assignments</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {subjectOptions.map((subject) => (
                              <div key={subject} className="flex items-center space-x-2">
                                <Checkbox
                                  id={subject}
                                  checked={assignments.subjects.includes(subject)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setAssignments(prev => ({
                                        ...prev,
                                        subjects: [...prev.subjects, subject]
                                      }));
                                    } else {
                                      setAssignments(prev => ({
                                        ...prev,
                                        subjects: prev.subjects.filter(s => s !== subject)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={subject} className="text-sm">
                                  {subject}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => handleReject(user.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          onClick={() => handleApprove(user.id)}
                          disabled={user.role === 'teacher' && assignments.classes.length === 0}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            
            {type === 'approved' && (
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approved
                </Badge>
                {user.studentId && (
                  <span className="text-xs text-muted-foreground">
                    ID: {user.studentId}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Review and approve user applications
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingUsers.length}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{approvedUsers.length}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Pending Applications ({pendingUsers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Approved Users ({approvedUsers.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Pending Applications
                </h3>
                <p className="text-muted-foreground">
                  All applications have been reviewed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingUsers.map((user) => (
                <UserCard key={user.id} user={user} type="pending" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Approved Users
                </h3>
                <p className="text-muted-foreground">
                  No users have been approved yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedUsers.map((user) => (
                <UserCard key={user.id} user={user} type="approved" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};