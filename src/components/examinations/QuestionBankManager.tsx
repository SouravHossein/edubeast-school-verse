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
import { Brain, Plus, Search, Filter, Upload, Download, Sparkles, Edit, Trash2 } from 'lucide-react';
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
    question_text: '',
    question_type: 'mcq',
    difficulty_level: 'medium',
    bloom_taxonomy: 'understand',
    marks: 1,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    tags: '',
    subject_id: ''
  });

  useEffect(() => {
    fetchQuestions();
    fetchSubjects();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('question_bank')
      .select(`
        *,
        subjects(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive",
      });
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  };

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from('subjects')
      .select('id, name')
      .eq('is_active', true);
    setSubjects(data || []);
  };

  const generateAIQuestion = async () => {
    if (!formData.subject_id) {
      toast({
        title: "Error",
        description: "Please select a subject first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedSubject = subjects.find(s => s.id === formData.subject_id);
      
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject?.name,
          questionType: formData.question_type,
          difficulty: formData.difficulty_level,
          bloomLevel: formData.bloom_taxonomy,
          marks: formData.marks
        })
      });

      if (!response.ok) throw new Error('Failed to generate question');
      
      const generatedQuestion = await response.json();
      
      setFormData(prev => ({
        ...prev,
        question_text: generatedQuestion.question,
        options: generatedQuestion.options || prev.options,
        correct_answer: generatedQuestion.correctAnswer || '',
        explanation: generatedQuestion.explanation || ''
      }));

      toast({
        title: "Success",
        description: "AI question generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI question",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const saveQuestion = async () => {
    if (!formData.question_text || !formData.subject_id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const questionData = {
      ...formData,
      tenant_id: 'current-tenant-id',
      created_by: 'current-user-id',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      options: formData.question_type === 'mcq' ? formData.options : null,
      ai_generated: false
    };

    let result;
    if (editingQuestion) {
      result = await supabase
        .from('question_bank')
        .update(questionData)
        .eq('id', editingQuestion.id);
    } else {
      result = await supabase
        .from('question_bank')
        .insert([questionData]);
    }

    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to save question",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Question ${editingQuestion ? 'updated' : 'created'} successfully!`,
      });
      fetchQuestions();
      resetForm();
    }
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase
      .from('question_bank')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Question deleted successfully!",
      });
      fetchQuestions();
    }
  };

  const resetForm = () => {
    setFormData({
      question_text: '',
      question_type: 'mcq',
      difficulty_level: 'medium',
      bloom_taxonomy: 'understand',
      marks: 1,
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      tags: '',
      subject_id: ''
    });
    setEditingQuestion(null);
    setIsDialogOpen(false);
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || question.question_type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || question.difficulty_level === filterDifficulty;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mcq': return 'bg-blue-100 text-blue-800';
      case 'essay': return 'bg-purple-100 text-purple-800';
      case 'coding': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Question Bank Manager
          </h2>
          <p className="text-muted-foreground">
            Create, manage, and organize your exam questions with AI assistance
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingQuestion ? 'Edit Question' : 'Create New Question'}
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </DialogTitle>
              <DialogDescription>
                Use AI assistance to generate questions or create them manually
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject_id} onValueChange={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="question_type">Question Type</Label>
                    <Select value={formData.question_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, question_type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="short_answer">Short Answer</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="true_false">True/False</SelectItem>
                        <SelectItem value="fill_blank">Fill in the Blank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty_level} onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty_level: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloom_taxonomy">Bloom's Level</Label>
                    <Select value={formData.bloom_taxonomy} onValueChange={(value: any) => setFormData(prev => ({ ...prev, bloom_taxonomy: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remember">Remember</SelectItem>
                        <SelectItem value="understand">Understand</SelectItem>
                        <SelectItem value="apply">Apply</SelectItem>
                        <SelectItem value="analyze">Analyze</SelectItem>
                        <SelectItem value="evaluate">Evaluate</SelectItem>
                        <SelectItem value="create">Create</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marks">Marks</Label>
                    <Input
                      type="number"
                      value={formData.marks}
                      onChange={(e) => setFormData(prev => ({ ...prev, marks: parseInt(e.target.value) || 1 }))}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={generateAIQuestion} disabled={loading} variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="question_text">Question Text *</Label>
                  <Textarea
                    value={formData.question_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
                    placeholder="Enter your question here..."
                    rows={3}
                  />
                </div>
                
                {formData.question_type === 'mcq' && (
                  <div className="space-y-4">
                    <Label>Options</Label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="text-sm font-medium w-8">{String.fromCharCode(65 + index)}.</span>
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = e.target.value;
                            setFormData(prev => ({ ...prev, options: newOptions }));
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                      </div>
                    ))}
                    
                    <div className="space-y-2">
                      <Label htmlFor="correct_answer">Correct Answer</Label>
                      <Select value={formData.correct_answer} onValueChange={(value) => setFormData(prev => ({ ...prev, correct_answer: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.options.map((option, index) => (
                            <SelectItem key={index} value={option} disabled={!option}>
                              {String.fromCharCode(65 + index)}. {option || 'Empty option'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                    placeholder="Provide explanation for the answer..."
                    rows={2}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="metadata" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="algebra, equations, linear"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={saveQuestion} disabled={loading}>
                {editingQuestion ? 'Update Question' : 'Save Question'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Question Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mcq">Multiple Choice</SelectItem>
                <SelectItem value="essay">Essay</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="short_answer">Short Answer</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
          <CardDescription>
            Manage your question bank with smart filtering and organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="max-w-[300px]">
                    <div className="space-y-1">
                      <p className="font-medium truncate">{question.question_text}</p>
                      <div className="flex gap-1 flex-wrap">
                        {question.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {question.ai_generated && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{question.subjects?.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(question.question_type)}>
                      {question.question_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(question.difficulty_level)}>
                      {question.difficulty_level}
                    </Badge>
                  </TableCell>
                  <TableCell>{question.marks}</TableCell>
                  <TableCell>{question.past_usage_count}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingQuestion(question);
                          setFormData({
                            question_text: question.question_text,
                            question_type: question.question_type,
                            difficulty_level: question.difficulty_level,
                            bloom_taxonomy: question.bloom_taxonomy,
                            marks: question.marks,
                            options: question.options || ['', '', '', ''],
                            correct_answer: question.correct_answer || '',
                            explanation: question.explanation || '',
                            tags: question.tags.join(', '),
                            subject_id: question.subject_id || ''
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(question.id)}
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