import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, FileText, Calendar, User, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  student_id: string;
  profiles: {
    full_name: string;
    email: string;
  }[];
}

interface Subject {
  id: string;
  name: string;
  code: string;
  credit_hours: number;
}

interface Grade {
  subject_name: string;
  subject_code: string;
  credit_hours: number;
  marks_obtained: number;
  max_marks: number;
  grade: string;
  gpa_points: number;
  percentage: number;
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
  generated_at: string;
  pdf_url?: string;
  drive_file_id?: string;
  transcript_data: {
    student_info: {
      name: string;
      student_id: string;
      email: string;
      class: string;
    };
    grades: Grade[];
    summary: {
      total_subjects: number;
      subjects_passed: number;
      subjects_failed: number;
      attendance_percentage: number;
    };
  };
}

export const TranscriptGenerator: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

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
      .select('*')
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
        students!inner(student_id, profiles!inner(full_name))
      `)
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('Error fetching transcripts:', error);
    } else {
      setTranscripts(data || []);
    }
  };

  const generateTranscript = async () => {
    if (!selectedStudent || !selectedYear || !selectedTerm) {
      toast({
        title: "Missing Information",
        description: "Please select student, academic year, and term.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('exam-automation', {
        body: {
          action: 'generate_transcript',
          student_id: selectedStudent,
          academic_year: selectedYear,
          term: selectedTerm
        }
      });

      if (error) throw error;

      toast({
        title: "Transcript Generated",
        description: "The transcript has been successfully generated.",
      });

      // Refresh transcripts list
      fetchTranscripts();
      
      // Reset form
      setSelectedStudent('');
      setSelectedYear('');
      setSelectedTerm('');
    } catch (error) {
      console.error('Error generating transcript:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate transcript. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadTranscript = async (transcript: Transcript) => {
    try {
      // Generate PDF (placeholder implementation)
      const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcript_${transcript.transcript_data.student_info.student_id}_${transcript.academic_year}_${transcript.term}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Transcript download has started.",
      });
    } catch (error) {
      console.error('Error downloading transcript:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download transcript.",
        variant: "destructive",
      });
    }
  };

  const shareTranscript = async (transcript: Transcript) => {
    try {
      const { data, error } = await supabase.functions.invoke('google-integrations', {
        body: {
          action: 'upload_to_drive',
          file_data: transcript.transcript_data,
          file_name: `Transcript_${transcript.transcript_data.student_info.student_id}_${transcript.academic_year}.pdf`,
          folder_name: 'Transcripts'
        }
      });

      if (error) throw error;

      toast({
        title: "Shared Successfully",
        description: "Transcript has been uploaded to Google Drive.",
      });
    } catch (error) {
      console.error('Error sharing transcript:', error);
      toast({
        title: "Share Failed",
        description: "Failed to share transcript to Google Drive.",
        variant: "destructive",
      });
    }
  };

  const academicYears = ['2024-25', '2023-24', '2022-23', '2021-22'];
  const terms = ['First Term', 'Second Term', 'Third Term', 'Annual'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transcript Generator</h2>
        <p className="text-muted-foreground">
          Generate and manage academic transcripts for students
        </p>
      </div>

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate New Transcript
          </CardTitle>
          <CardDescription>
            Select student and academic period to generate transcript
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.profiles[0]?.full_name || 'Unknown'} ({student.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Academic Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {terms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={generateTranscript} 
            disabled={generating || !selectedStudent || !selectedYear || !selectedTerm}
            className="w-full md:w-auto"
          >
            {generating ? 'Generating...' : 'Generate Transcript'}
          </Button>
        </CardContent>
      </Card>

      {/* Transcripts List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Transcripts</CardTitle>
          <CardDescription>
            View and manage previously generated transcripts
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
                <TableHead>Generated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transcripts.map((transcript) => (
                <TableRow key={transcript.id}>
                  <TableCell>
                    <div className="font-medium">
                      {transcript.transcript_data.student_info.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transcript.transcript_data.student_info.student_id}
                    </div>
                  </TableCell>
                  <TableCell>{transcript.academic_year}</TableCell>
                  <TableCell>{transcript.term}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {transcript.cumulative_gpa?.toFixed(2) || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transcript.credits_earned}/{transcript.total_credits}
                  </TableCell>
                  <TableCell>
                    {new Date(transcript.generated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadTranscript(transcript)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareTranscript(transcript)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {transcripts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No transcripts generated yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {transcripts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Transcript Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <TranscriptPreview transcript={transcripts[0]} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const TranscriptPreview: React.FC<{ transcript: Transcript }> = ({ transcript }) => {
  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A+':
        return 'bg-green-100 text-green-800';
      case 'A':
        return 'bg-green-100 text-green-700';
      case 'B+':
        return 'bg-blue-100 text-blue-800';
      case 'B':
        return 'bg-blue-100 text-blue-700';
      case 'C+':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-700';
      case 'D':
        return 'bg-orange-100 text-orange-700';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatGPA = (gpa: number | null) => {
    return gpa ? gpa.toFixed(2) : 'N/A';
  };

  return (
    <div className="space-y-6 p-6 bg-white border rounded-lg">
      {/* Header */}
      <div className="text-center border-b pb-4">
        <h3 className="text-2xl font-bold">Academic Transcript</h3>
        <p className="text-muted-foreground">Official Academic Record</p>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">Student Information</span>
          </div>
          <div className="ml-6 space-y-1">
            <p><span className="font-medium">Name:</span> {transcript.transcript_data.student_info.name}</p>
            <p><span className="font-medium">Student ID:</span> {transcript.transcript_data.student_info.student_id}</p>
            <p><span className="font-medium">Email:</span> {transcript.transcript_data.student_info.email}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Academic Summary</span>
          </div>
          <div className="ml-6 space-y-1">
            <p><span className="font-medium">Academic Year:</span> {transcript.academic_year}</p>
            <p><span className="font-medium">Term:</span> {transcript.term}</p>
            <p><span className="font-medium">Cumulative GPA:</span> {formatGPA(transcript.cumulative_gpa)}</p>
            <p><span className="font-medium">Term GPA:</span> {formatGPA(transcript.term_gpa)}</p>
          </div>
        </div>
      </div>

      {/* Academic Record */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-4 w-4" />
          <span className="font-medium">Academic Record</span>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>GPA Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transcript.transcript_data.grades.map((grade, index) => (
              <TableRow key={index}>
                <TableCell>{grade.subject_name}</TableCell>
                <TableCell>{grade.subject_code}</TableCell>
                <TableCell>{grade.credit_hours}</TableCell>
                <TableCell>{grade.marks_obtained}/{grade.max_marks}</TableCell>
                <TableCell>
                  <Badge className={getGradeColor(grade.grade)}>
                    {grade.grade}
                  </Badge>
                </TableCell>
                <TableCell>{grade.gpa_points.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{transcript.transcript_data.summary.total_subjects}</p>
            <p className="text-sm text-muted-foreground">Total Subjects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{transcript.transcript_data.summary.subjects_passed}</p>
            <p className="text-sm text-muted-foreground">Passed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{transcript.transcript_data.summary.subjects_failed}</p>
            <p className="text-sm text-muted-foreground">Failed</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{transcript.credits_earned}/{transcript.total_credits}</p>
            <p className="text-sm text-muted-foreground">Credits Earned</p>
          </div>
        </div>
      </div>
    </div>
  );
};