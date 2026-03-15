import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Plus, Search, Filter, Sparkles, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  difficulty_level: string;
  bloom_taxonomy: string;
  marks: number;
  options?: any;
  correct_answer?: string;
  explanation?: string;
  tags: string[];
  past_usage_count: number;
  ai_generated: boolean;
  subject_id?: string;
  subjects?: { name: string };
}

export const QuestionBankManager = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    question_text: '', question_type: 'mcq', difficulty_level: 'medium',
    bloom_taxonomy: 'understand', marks: 1, options: ['', '', '', ''],
    correct_answer: '', explanation: '', tags: '', subject_id: '',
  });

  useEffect(() => { fetchQuestions(); fetchSubjects(); }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('question_bank')
        .select('*, subjects(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setQuestions((data as Question[]) || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch questions', variant: 'destructive' });
    }
    setLoading(false);
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await (supabase as any).from('subjects').select('id, name').eq('is_active', true);
      setSubjects(data || []);
    } catch { /* subjects table may not exist yet */ }
  };

  const saveQuestion = async () => {
    if (!formData.question_text || !formData.subject_id) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    const questionData = {
      ...formData, tenant_id: 'current-tenant-id', created_by: 'current-user-id',
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      options: formData.question_type === 'mcq' ? formData.options : null, ai_generated: false,
    };
    let result;
    if (editingQuestion) {
      result = await (supabase as any).from('question_bank').update(questionData).eq('id', editingQuestion.id);
    } else {
      result = await (supabase as any).from('question_bank').insert([questionData]);
    }
    if (result.error) {
      toast({ title: 'Error', description: 'Failed to save question', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Question ${editingQuestion ? 'updated' : 'created'}!` });
      fetchQuestions(); resetForm();
    }
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await (supabase as any).from('question_bank').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    else { toast({ title: 'Success', description: 'Question deleted!' }); fetchQuestions(); }
  };

  const resetForm = () => {
    setFormData({ question_text: '', question_type: 'mcq', difficulty_level: 'medium', bloom_taxonomy: 'understand', marks: 1, options: ['', '', '', ''], correct_answer: '', explanation: '', tags: '', subject_id: '' });
    setEditingQuestion(null); setIsDialogOpen(false);
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) || q.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || q.question_type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty_level === filterDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getDifficultyColor = (d: string) => d === 'easy' ? 'bg-green-100 text-green-800' : d === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Brain className="h-6 w-6" />Question Bank Manager</h2>
          <p className="text-muted-foreground">Create, manage, and organize exam questions with AI assistance</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button onClick={() => resetForm()}><Plus className="h-4 w-4 mr-2" />Add Question</Button></DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</DialogTitle>
              <DialogDescription>Fill in question details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={formData.subject_id} onValueChange={v => setFormData(p => ({ ...p, subject_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.question_type} onValueChange={v => setFormData(p => ({ ...p, question_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Question Text *</Label>
                <Textarea value={formData.question_text} onChange={e => setFormData(p => ({ ...p, question_text: e.target.value }))} rows={3} />
              </div>
              {formData.question_type === 'mcq' && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {formData.options.map((opt, i) => (
                    <Input key={i} value={opt} onChange={e => { const o = [...formData.options]; o[i] = e.target.value; setFormData(p => ({ ...p, options: o })); }} placeholder={`Option ${i + 1}`} />
                  ))}
                </div>
              )}
              <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={formData.tags} onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={saveQuestion} disabled={loading}>{editingQuestion ? 'Update' : 'Save'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1"><Input placeholder="Search questions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="mcq">MCQ</SelectItem><SelectItem value="essay">Essay</SelectItem></SelectContent>
            </Select>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Difficulty" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead><TableHead>Type</TableHead><TableHead>Difficulty</TableHead><TableHead>Marks</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="max-w-md truncate">{q.question_text}</TableCell>
                  <TableCell><Badge variant="secondary">{q.question_type}</Badge></TableCell>
                  <TableCell><Badge className={getDifficultyColor(q.difficulty_level)}>{q.difficulty_level}</Badge></TableCell>
                  <TableCell>{q.marks}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditingQuestion(q); setIsDialogOpen(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteQuestion(q.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredQuestions.length === 0 && <div className="text-center py-8 text-muted-foreground">No questions found</div>}
        </CardContent>
      </Card>
    </div>
  );
};
