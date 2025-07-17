import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Users, Calendar, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkOperation {
  id: string;
  type: 'import' | 'export' | 'mark_all' | 'copy_attendance';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  details: string;
  createdAt: string;
}

export const BulkAttendance: React.FC = () => {
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [markAllStatus, setMarkAllStatus] = useState<string>('');
  const [importData, setImportData] = useState<string>('');
  const { toast } = useToast();

  // Mock data for bulk operations history
  const [bulkOperations] = useState<BulkOperation[]>([
    {
      id: '1',
      type: 'import',
      status: 'completed',
      progress: 100,
      details: 'Imported 150 attendance records for Class X-A',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'mark_all',
      status: 'completed',
      progress: 100,
      details: 'Marked all students present for Class XI-B',
      createdAt: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      type: 'export',
      status: 'processing',
      progress: 65,
      details: 'Exporting attendance report for all classes',
      createdAt: '2024-01-15T11:00:00Z'
    }
  ]);

  const classes = ['Class IX', 'Class X', 'Class XI', 'Class XII'];
  const sections = ['A', 'B', 'C', 'D'];
  const operations = [
    { value: 'import', label: 'Import Attendance Data' },
    { value: 'export', label: 'Export Attendance Report' },
    { value: 'mark_all', label: 'Mark All Students' },
    { value: 'copy_attendance', label: 'Copy Previous Day Attendance' }
  ];

  const handleExecuteOperation = () => {
    if (!selectedOperation) {
      toast({
        title: "Error",
        description: "Please select an operation to execute.",
        variant: "destructive"
      });
      return;
    }

    // Here you would execute the actual bulk operation
    toast({
      title: "Operation Started",
      description: "Bulk operation has been initiated and will be processed in the background.",
    });

    console.log('Executing operation:', {
      operation: selectedOperation,
      class: selectedClass,
      section: selectedSection,
      markAllStatus,
      importData
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic
      console.log('File selected:', file.name);
    }
  };

  const downloadTemplate = () => {
    // Create and download CSV template
    const csvContent = `Student Name,Roll Number,Class,Section,Date,Status,Remarks
John Doe,R001,Class X,A,2024-01-15,present,
Jane Smith,R002,Class X,A,2024-01-15,absent,Sick leave`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-yellow-600 animate-pulse" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bulk Operations Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Attendance Operations
          </CardTitle>
          <CardDescription>
            Perform bulk operations on attendance data for efficiency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Operation Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Operation Type</Label>
              <Select value={selectedOperation} onValueChange={setSelectedOperation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  {operations.map(op => (
                    <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sections</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Operation-specific fields */}
          {selectedOperation === 'import' && (
            <div className="space-y-4">
              <div>
                <Label>Upload Attendance File</Label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <Button variant="ghost" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
              <div>
                <Label>Or Paste CSV Data</Label>
                <Textarea
                  placeholder="Paste CSV data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="mt-2 h-32"
                />
              </div>
            </div>
          )}

          {selectedOperation === 'mark_all' && (
            <div className="space-y-2">
              <Label>Mark All Students As</Label>
              <Select value={markAllStatus} onValueChange={setMarkAllStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleExecuteOperation} className="w-full">
            Execute Operation
          </Button>
        </CardContent>
      </Card>

      {/* Operations History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bulk Operations</CardTitle>
          <CardDescription>
            Track the status of your bulk attendance operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bulkOperations.map((operation) => (
              <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(operation.status)}
                  <div>
                    <div className="font-medium capitalize">
                      {operation.type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {operation.details}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(operation.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {operation.status === 'processing' && (
                    <div className="flex items-center gap-2">
                      <Progress value={operation.progress} className="w-24" />
                      <span className="text-sm text-muted-foreground">
                        {operation.progress}%
                      </span>
                    </div>
                  )}
                  {getStatusBadge(operation.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Import Template</CardTitle>
            <CardDescription>Download CSV template for bulk import</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={downloadTemplate} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Data</CardTitle>
            <CardDescription>Export attendance data for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Copy Previous Day</CardTitle>
            <CardDescription>Copy attendance from previous day</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Copy Yesterday
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};