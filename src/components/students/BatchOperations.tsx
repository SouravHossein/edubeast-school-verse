
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Users, ArrowRightLeft, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BatchOperations = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transferData, setTransferData] = useState({
    fromGrade: '',
    toGrade: '',
    fromSection: '',
    toSection: '',
  });
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} has been selected for import.`,
      });
    }
  };

  const handleBulkImport = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to import.",
        variant: "destructive",
      });
      return;
    }

    // Simulate import process
    toast({
      title: "Import Started",
      description: "Processing student data import...",
    });

    setTimeout(() => {
      toast({
        title: "Import Completed",
        description: "Successfully imported student data.",
      });
    }, 2000);
  };

  const handleBulkExport = () => {
    // Simulate export process
    toast({
      title: "Export Started",
      description: "Generating student data export...",
    });

    setTimeout(() => {
      toast({
        title: "Export Completed",
        description: "Student data has been exported successfully.",
      });
    }, 1500);
  };

  const handleGradeTransfer = () => {
    if (!transferData.fromGrade || !transferData.toGrade) {
      toast({
        title: "Missing Information",
        description: "Please select both source and target grades.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transfer Initiated",
      description: `Transferring students from ${transferData.fromGrade} to ${transferData.toGrade}...`,
    });

    setTimeout(() => {
      toast({
        title: "Transfer Completed",
        description: "Students have been successfully transferred.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import-export" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="grade-transfer">Grade Transfer</TabsTrigger>
        </TabsList>

        <TabsContent value="import-export" className="space-y-4">
          {/* Bulk Import */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Bulk Student Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="import-file">Select CSV/Excel File</Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </div>
              {selectedFile && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Selected File:</p>
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleBulkImport} disabled={!selectedFile}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Students
                </Button>
                <Button variant="outline">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Supported formats: CSV, Excel (.xlsx, .xls)</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Bulk Student Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Filter</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="grade-1">Grade 1</SelectItem>
                      <SelectItem value="grade-2">Grade 2</SelectItem>
                      <SelectItem value="grade-3">Grade 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select defaultValue="excel">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleBulkExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Students
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade-transfer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5" />
                Grade Transfer System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Grade</Label>
                  <Select
                    value={transferData.fromGrade}
                    onValueChange={(value) =>
                      setTransferData(prev => ({ ...prev, fromGrade: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade-1">Grade 1</SelectItem>
                      <SelectItem value="grade-2">Grade 2</SelectItem>
                      <SelectItem value="grade-3">Grade 3</SelectItem>
                      <SelectItem value="grade-4">Grade 4</SelectItem>
                      <SelectItem value="grade-5">Grade 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Grade</Label>
                  <Select
                    value={transferData.toGrade}
                    onValueChange={(value) =>
                      setTransferData(prev => ({ ...prev, toGrade: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade-2">Grade 2</SelectItem>
                      <SelectItem value="grade-3">Grade 3</SelectItem>
                      <SelectItem value="grade-4">Grade 4</SelectItem>
                      <SelectItem value="grade-5">Grade 5</SelectItem>
                      <SelectItem value="grade-6">Grade 6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Section</Label>
                  <Select
                    value={transferData.fromSection}
                    onValueChange={(value) =>
                      setTransferData(prev => ({ ...prev, fromSection: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Section</Label>
                  <Select
                    value={transferData.toSection}
                    onValueChange={(value) =>
                      setTransferData(prev => ({ ...prev, toSection: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Transfer Summary:</p>
                <p className="text-sm text-muted-foreground">
                  This will transfer all students from{' '}
                  <strong>{transferData.fromGrade || 'selected grade'}</strong>
                  {transferData.fromSection && ` Section ${transferData.fromSection}`} to{' '}
                  <strong>{transferData.toGrade || 'target grade'}</strong>
                  {transferData.toSection && ` Section ${transferData.toSection}`}.
                </p>
              </div>
              <Button onClick={handleGradeTransfer} className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Execute Grade Transfer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
