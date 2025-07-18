
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload, Download, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  class: string;
  examType: string;
  totalMarks: number;
  duration: string;
  instructions: string;
  status: 'draft' | 'approved' | 'published';
  createdBy: string;
  createdAt: string;
}

export const QuestionPaperManagement = () => {
  const [papers, setPapers] = useState<QuestionPaper[]>([
    {
      id: '1',
      title: 'Mathematics Mid-Term Exam',
      subject: 'Mathematics',
      class: 'Grade 10A',
      examType: 'Mid-Term',
      totalMarks: 100,
      duration: '3 hours',
      instructions: 'Read all questions carefully. Show all working.',
      status: 'approved',
      createdBy: 'Dr. Smith',
      createdAt: '2024-02-15'
    },
    {
      id: '2',
      title: 'English Literature Final',
      subject: 'English',
      class: 'Grade 11A',
      examType: 'Final',
      totalMarks: 80,
      duration: '2.5 hours',
      instructions: 'Answer all questions in Section A and any two from Section B.',
      status: 'draft',
      createdBy: 'Ms. Johnson',
      createdAt: '2024-02-20'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<QuestionPaper | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    examType: '',
    totalMarks: 100,
    duration: '',
    instructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPaper) {
      setPapers(papers.map(paper => 
        paper.id === editingPaper.id 
          ? { ...paper, ...formData }
          : paper
      ));
      toast({
        title: "Question Paper Updated",
        description: "Question paper has been updated successfully.",
      });
    } else {
      const newPaper: QuestionPaper = {
        id: Date.now().toString(),
        ...formData,
        status: 'draft',
        createdBy: 'Current User',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPapers([...papers, newPaper]);
      toast({
        title: "Question Paper Created",
        description: "New question paper has been created successfully.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      class: '',
      examType: '',
      totalMarks: 100,
      duration: '',
      instructions: ''
    });
    setEditingPaper(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (paper: QuestionPaper) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      subject: paper.subject,
      class: paper.class,
      examType: paper.examType,
      totalMarks: paper.totalMarks,
      duration: paper.duration,
      instructions: paper.instructions
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPapers(papers.filter(paper => paper.id !== id));
    toast({
      title: "Question Paper Deleted",
      description: "Question paper has been removed.",
    });
  };

  const updateStatus = (id: string, newStatus: 'draft' | 'approved' | 'published') => {
    setPapers(papers.map(paper => 
      paper.id === id ? { ...paper, status: newStatus } : paper
    ));
    toast({
      title: "Status Updated",
      description: `Question paper status changed to ${newStatus}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'published': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Question Paper Management</h3>
          <p className="text-sm text-muted-foreground">
            Create, manage and publish question papers
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Paper
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPaper ? 'Edit Question Paper' : 'Create New Question Paper'}
              </DialogTitle>
              <DialogDescription>
                {editingPaper ? 'Update question paper details' : 'Add a new question paper'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Paper Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Mathematics Mid-Term Exam"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Geography">Geography</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="class">Class</Label>
                    <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade 9A">Grade 9A</SelectItem>
                        <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                        <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                        <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="examType">Exam Type</Label>
                    <Select value={formData.examType} onValueChange={(value) => setFormData({...formData, examType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unit Test">Unit Test</SelectItem>
                        <SelectItem value="Mid-Term">Mid-Term</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                        <SelectItem value="Mock">Mock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 hour">1 hour</SelectItem>
                        <SelectItem value="2 hours">2 hours</SelectItem>
                        <SelectItem value="3 hours">3 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalMarks">Total Marks</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                    placeholder="Enter exam instructions..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPaper ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Question Papers
          </CardTitle>
          <CardDescription>
            Manage all question papers and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {papers.map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell className="font-medium">{paper.title}</TableCell>
                  <TableCell>{paper.subject}</TableCell>
                  <TableCell>{paper.class}</TableCell>
                  <TableCell>{paper.examType}</TableCell>
                  <TableCell>{paper.totalMarks}</TableCell>
                  <TableCell>{paper.duration}</TableCell>
                  <TableCell>
                    <Select
                      value={paper.status}
                      onValueChange={(value: 'draft' | 'approved' | 'published') => updateStatus(paper.id, value)}
                    >
                      <SelectTrigger className={`w-24 ${getStatusColor(paper.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(paper)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(paper.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
