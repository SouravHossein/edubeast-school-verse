import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Download, 
  Share, 
  Award, 
  TrendingUp, 
  Calendar,
  GraduationCap,
  Star,
  Shield
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  student_id: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

interface Subject {
  id: string;
  name: string;
  credit_hours: number;
}

interface Grade {
  subject_id: string;
  subject_name: string;
  credit_hours: number;
  marks_obtained: number;
  max_marks: number;
  percentage: number;
  grade: string;
  gpa_points: number;
}

interface Transcript {
  id: string;
  student_id: string;
  academic_year: string;
  term: string;
  cumulative_gpa: number;
  term_gpa: number;
  total_credits: number;
  credits_earned: number;
  class_rank: number;
  total_students: number;
  transcript_data: any;
  generated_at: string;
  digitally_signed: boolean;
  drive_file_id?: string;
}

export const TranscriptGenerator = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [previewTranscript, setPreviewTranscript] = useState<Transcript | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
    fetchTranscripts();
  }, []);

  const fetchStudents = async () => {
  const { data, error } = await supabase
      .from('students')
      .select(`
        id,
        student_id,
        profiles!inner(full_name, email)
      `)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching students:', error);
    } else {
      setStudents(data || []);
    }
  };

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('id, name, credit_hours')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching subjects:', error);
    } else {
      setSubjects(data || []);
    }
  };

  const fetchTranscripts = async () => {
    const { data, error } = await supabase
      .from('transcripts')
      .select(`
        *,
        students(
          student_id,
          profiles(full_name)
        )
      `)
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching transcripts:', error);
    } else {
      setTranscripts(data || []);
    }
  };

  const generateTranscript = async () => {
    if (!selectedStudent || !selectedYear) {
      toast({
        title: "Error",
        description: "Please select a student and academic year",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call the exam automation function to generate transcript
      const response = await supabase.functions.invoke('exam-automation', {
        body: {
          action: 'generate_transcript',
          studentId: selectedStudent,
          tenantId: 'current-tenant-id', // Get from context
          options: {
            academicYear: selectedYear,
            term: selectedTerm
          }
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Transcript generated successfully!",
      });

      fetchTranscripts();
      setSelectedStudent('');
      setSelectedYear('');
      setSelectedTerm('');
    } catch (error) {
      console.error('Error generating transcript:', error);
      toast({
        title: "Error",
        description: "Failed to generate transcript",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const downloadTranscript = async (transcript: Transcript) => {
    try {
      // Generate PDF (implement PDF generation logic)
      const pdfBlob = await generatePDF(transcript);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript-${transcript.student_id}-${transcript.academic_year}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Transcript downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading transcript:', error);
      toast({
        title: "Error",
        description: "Failed to download transcript",
        variant: "destructive",
      });
    }
  };

  const generatePDF = async (transcript: Transcript): Promise<Blob> => {
    // This would implement actual PDF generation
    // For now, return a mock blob
    return new Blob(['PDF content'], { type: 'application/pdf' });
  };

  const shareTranscript = async (transcript: Transcript) => {
    try {
      // Upload to Google Drive via integration
      const response = await supabase.functions.invoke('google-integrations', {
        body: {
          action: 'upload_to_drive',
          tenantId: 'current-tenant-id',
          fileData: {
            name: `Transcript-${transcript.student_id}-${transcript.academic_year}.pdf`,
            content: await generatePDF(transcript),
            folderId: 'transcripts-folder-id'
          }
        }
      });

      if (response.error) throw response.error;

      // Update transcript with Drive file ID
      await supabase
        .from('transcripts')
        .update({
          drive_file_id: response.data.fileId,
          pdf_url: response.data.webViewLink
        })
        .eq('id', transcript.id);

      toast({
        title: "Success",
        description: "Transcript shared to Google Drive!",
      });
    } catch (error) {
      console.error('Error sharing transcript:', error);
      toast({
        title: "Error",
        description: "Failed to share transcript",
        variant: "destructive",
      });
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade.charAt(0)) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatGPA = (gpa: number) => {
    return gpa?.toFixed(2) || '0.00';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Transcript Generator
          </h2>
          <p className="text-muted-foreground">
            Generate official academic transcripts with GPA calculations and digital signatures
          </p>
        </div>
      </div>

      {/* Generate New Transcript */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate New Transcript
          </CardTitle>
          <CardDescription>
            Create official transcripts for students with automatic GPA calculation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.profiles.full_name} - {student.student_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2025-2026">2025-2026</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger>
                <SelectValue placeholder="Term (Optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Full Year</SelectItem>
                <SelectItem value="Fall">Fall Term</SelectItem>
                <SelectItem value="Spring">Spring Term</SelectItem>
                <SelectItem value="Summer">Summer Term</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={generateTranscript} disabled={loading}>
              <Award className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transcripts List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Transcripts</CardTitle>
          <CardDescription>
            View, download, and manage student transcripts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transcripts.map((transcript) => (
                <TableRow key={transcript.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {transcript.transcript_data?.student?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transcript.transcript_data?.student?.studentId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{transcript.academic_year}</TableCell>
                  <TableCell>{transcript.term || 'Full Year'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-mono">
                        {formatGPA(transcript.cumulative_gpa)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {transcript.credits_earned}/{transcript.total_credits}
                  </TableCell>
                  <TableCell>
                    {transcript.class_rank && (
                      <Badge variant="outline">
                        #{transcript.class_rank} of {transcript.total_students}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(transcript.generated_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {transcript.digitally_signed && (
                        <Badge variant="secondary">
                          <Shield className="h-3 w-3 mr-1" />
                          Signed
                        </Badge>
                      )}
                      {transcript.drive_file_id && (
                        <Badge variant="outline">
                          <Share className="h-3 w-3 mr-1" />
                          Shared
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewTranscript(transcript)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Transcript Preview</DialogTitle>
                            <DialogDescription>
                              Official Academic Transcript
                            </DialogDescription>
                          </DialogHeader>
                          {previewTranscript && (
                            <TranscriptPreview transcript={previewTranscript} />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadTranscript(transcript)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareTranscript(transcript)}
                      >
                        <Share className="h-4 w-4" />
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

const TranscriptPreview: React.FC<{ transcript: Transcript }> = ({ transcript }) => {
  const data = transcript.transcript_data;
  
  return (
    <div className="space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h1 className="text-2xl font-bold">Official Academic Transcript</h1>
        <p className="text-muted-foreground">Academic Year {transcript.academic_year}</p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Student Information</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Name:</strong> {data.student?.name}</p>
            <p><strong>Student ID:</strong> {data.student?.studentId}</p>
            <p><strong>Admission Number:</strong> {data.student?.admissionNumber}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Academic Summary</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Cumulative GPA:</strong> {formatGPA(transcript.cumulative_gpa)}</p>
            <p><strong>Credits Earned:</strong> {transcript.credits_earned}</p>
            <p><strong>Class Rank:</strong> #{transcript.class_rank} of {transcript.total_students}</p>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div>
        <h3 className="font-semibold mb-4">Academic Record</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.grades?.map((grade: Grade, index: number) => (
              <TableRow key={index}>
                <TableCell>{grade.subject_name}</TableCell>
                <TableCell>{grade.credit_hours}</TableCell>
                <TableCell>{grade.marks_obtained}/{grade.max_marks}</TableCell>
                <TableCell>{grade.percentage.toFixed(1)}%</TableCell>
                <TableCell>
                  <Badge className={getGradeColor(grade.grade)}>
                    {grade.grade}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground border-t pt-4">
        <p>Generated on {new Date(transcript.generated_at).toLocaleDateString()}</p>
        {transcript.digitally_signed && (
          <p className="flex items-center justify-center gap-1 mt-1">
            <Shield className="h-3 w-3" />
            Digitally Signed and Verified
          </p>
        )}
      </div>
    </div>
  );
};

const getGradeColor = (grade: string) => {
  switch (grade.charAt(0)) {
    case 'A': return 'bg-green-100 text-green-800';
    case 'B': return 'bg-blue-100 text-blue-800';
    case 'C': return 'bg-yellow-100 text-yellow-800';
    case 'D': return 'bg-orange-100 text-orange-800';
    case 'F': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatGPA = (gpa: number) => {
  return gpa?.toFixed(2) || '0.00';
};