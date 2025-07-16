
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdmissionApplication {
  id: string;
  studentName: string;
  grade: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  parentName: string;
  phone: string;
  documents: string[];
}

export const AdmissionApprovals = () => {
  const { toast } = useToast();

  // Mock data
  const applications: AdmissionApplication[] = [
    {
      id: 'ADM001',
      studentName: 'Alice Johnson',
      grade: 'Grade 5',
      applicationDate: '2024-01-15',
      status: 'pending',
      parentName: 'Robert Johnson',
      phone: '+1234567890',
      documents: ['Birth Certificate', 'Photo', 'Previous Marksheet']
    },
    {
      id: 'ADM002',
      studentName: 'Bob Smith',
      grade: 'Grade 3',
      applicationDate: '2024-01-14',
      status: 'pending',
      parentName: 'Mary Smith',
      phone: '+1234567891',
      documents: ['Birth Certificate', 'Photo']
    },
    {
      id: 'ADM003',
      studentName: 'Carol Davis',
      grade: 'Grade 8',
      applicationDate: '2024-01-13',
      status: 'approved',
      parentName: 'John Davis',
      phone: '+1234567892',
      documents: ['Birth Certificate', 'Photo', 'Transfer Certificate']
    }
  ];

  const handleApprove = (applicationId: string) => {
    toast({
      title: "Application Approved",
      description: `Admission application ${applicationId} has been approved.`,
    });
  };

  const handleReject = (applicationId: string) => {
    toast({
      title: "Application Rejected",
      description: `Admission application ${applicationId} has been rejected.`,
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock },
      approved: { variant: 'default' as const, icon: CheckCircle },
      rejected: { variant: 'destructive' as const, icon: XCircle }
    };
    
    const { variant, icon: Icon } = variants[status as keyof typeof variants];
    
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const processedApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Pending Approvals ({pendingApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pending admission applications
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id}</TableCell>
                    <TableCell>{application.studentName}</TableCell>
                    <TableCell>{application.grade}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.parentName}</p>
                        <p className="text-sm text-muted-foreground">{application.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(application.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{application.documents.length} docs</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(application.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReject(application.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
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

      {/* Processed Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Processed Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.id}</TableCell>
                  <TableCell>{application.studentName}</TableCell>
                  <TableCell>{application.grade}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.parentName}</p>
                      <p className="text-sm text-muted-foreground">{application.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>{new Date(application.applicationDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
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
