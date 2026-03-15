import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  profiles: { full_name: string; email: string }[];
}

interface Subject { id: string; name: string; code: string; credit_hours: number; }

interface Grade {
  subject_name: string; subject_code: string; credit_hours: number;
  marks_obtained: number; max_marks: number; grade: string; gpa_points: number; percentage: number;
}

interface Transcript {
  id: string; student_id: string; academic_year: string; term: string;
  cumulative_gpa: number; term_gpa: number; total_credits: number; credits_earned: number;
  class_rank: number; total_students: number; generated_at: string;
  pdf_url?: string; drive_file_id?: string;
  transcript_data: {
    student_info: { name: string; student_id: string; email: string; class: string };
    grades: Grade[];
    summary: { total_subjects: number; subjects_passed: number; subjects_failed: number; attendance_percentage: number };
  };
}

export const TranscriptGenerator: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchStudents(); fetchSubjects(); fetchTranscripts(); }, []);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('students')
      .select('id, student_id')
      .eq('status', 'active');
    // Profiles join may not work perfectly with current schema, so we handle gracefully
    setStudents((data || []).map((s: any) => ({ ...s, profiles: s.profiles || [] })));
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await (supabase as any).from('subjects').select('*').eq('is_active', true);
      setSubjects((data as Subject[]) || []);
    } catch { /* table may not exist yet */ }
  };

  const fetchTranscripts = async () => {
    try {
      const { data } = await (supabase as any)
        .from('transcripts')
        .select('*')
        .order('generated_at', { ascending: false });
      const transformed = (data || []).map((item: any) => ({
        ...item,
        transcript_data: typeof item.transcript_data === 'string'
          ? JSON.parse(item.transcript_data)
          : item.transcript_data || {
              student_info: { name: '', student_id: '', email: '', class: '' },
              grades: [],
              summary: { total_subjects: 0, subjects_passed: 0, subjects_failed: 0, attendance_percentage: 0 },
            },
      }));
      setTranscripts(transformed as Transcript[]);
    } catch { /* table may not exist yet */ }
  };

  const generateTranscript = async () => {
    if (!selectedStudent || !selectedYear || !selectedTerm) {
      toast({ title: 'Missing Information', description: 'Please select all fields.', variant: 'destructive' });
      return;
    }
    setGenerating(true);
    try {
      const { error } = await supabase.functions.invoke('exam-automation', {
        body: { action: 'generate_transcript', student_id: selectedStudent, academic_year: selectedYear, term: selectedTerm },
      });
      if (error) throw error;
      toast({ title: 'Transcript Generated', description: 'Successfully generated.' });
      fetchTranscripts();
    } catch {
      toast({ title: 'Generation Failed', description: 'Please try again.', variant: 'destructive' });
    } finally { setGenerating(false); }
  };

  const academicYears = ['2025-26', '2024-25', '2023-24'];
  const terms = ['First Term', 'Second Term', 'Annual'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transcript Generator</h2>
        <p className="text-muted-foreground">Generate and manage academic transcripts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Generate New Transcript</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.profiles?.[0]?.full_name || s.student_id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>{academicYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Term</Label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger><SelectValue placeholder="Select term" /></SelectTrigger>
                <SelectContent>{terms.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generateTranscript} disabled={generating}>{generating ? 'Generating...' : 'Generate Transcript'}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Generated Transcripts</CardTitle></CardHeader>
        <CardContent>
          {transcripts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No transcripts generated yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead><TableHead>Year</TableHead><TableHead>Term</TableHead><TableHead>GPA</TableHead><TableHead>Generated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transcripts.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>{t.transcript_data.student_info.name}</TableCell>
                    <TableCell>{t.academic_year}</TableCell>
                    <TableCell>{t.term}</TableCell>
                    <TableCell><Badge variant="secondary">{t.cumulative_gpa?.toFixed(2) || 'N/A'}</Badge></TableCell>
                    <TableCell>{new Date(t.generated_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
