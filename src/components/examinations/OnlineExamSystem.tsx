import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Monitor, Clock, Shield, Users, Plus, Eye, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'mcq' | 'descriptive' | 'true_false';
  question: string;
  options?: string[];
  correctAnswer?: string;
  marks: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
  status: 'draft' | 'published' | 'ongoing' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

interface StudentAttempt {
  studentId: string;
  studentName: string;
  progress: number;
  timeRemaining: number;
  status: 'not_started' | 'in_progress' | 'submitted' | 'auto_submitted';
  score?: number;
}

export const OnlineExamSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    marks: 1
  });
  const [currentExam, setCurrentExam] = useState<Partial<Exam>>({
    title: '',
    subject: '',
    duration: 60,
    questions: []
  });
  const [studentAttempts, setStudentAttempts] = useState<StudentAttempt[]>([
    { studentId: '1', studentName: 'John Doe', progress: 75, timeRemaining: 15, status: 'in_progress' },
    { studentId: '2', studentName: 'Jane Smith', progress: 100, timeRemaining: 0, status: 'submitted', score: 85 },
    { studentId: '3', studentName: 'Bob Johnson', progress: 50, timeRemaining: 30, status: 'in_progress' },
  ]);
  
  const { toast } = useToast();

  const addQuestion = () => {
    if (!newQuestion.question) {
      toast({
        title: "Error",
        description: "Please enter a question.",
        variant: "destructive",
      });
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      type: newQuestion.type as Question['type'],
      question: newQuestion.question,
      options: newQuestion.type === 'mcq' ? newQuestion.options : undefined,
      marks: newQuestion.marks || 1
    };

    setCurrentExam(prev => ({
      ...prev,
      questions: [...(prev.questions || []), question]
    }));

    setNewQuestion({
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      marks: 1
    });

    toast({
      title: "Success",
      description: "Question added successfully!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'published': return 'default';
      case 'ongoing': return 'destructive';
      case 'completed': return 'default';
      case 'not_started': return 'secondary';
      case 'in_progress': return 'destructive';
      case 'submitted': return 'default';
      case 'auto_submitted': return 'destructive';
      default: return 'default';
    }
  };

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...(newQuestion.options || [])];
    newOptions[index] = value;
    setNewQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const totalMarks = currentExam.questions?.reduce((sum, q) => sum + q.marks, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Monitor className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Online Examination System</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Exam</TabsTrigger>
          <TabsTrigger value="monitor">Live Monitoring</TabsTrigger>
          <TabsTrigger value="question-bank">Question Bank</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exam Details */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
                <CardDescription>Configure your online examination</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exam Title</label>
                  <Input
                    value={currentExam.title}
                    onChange={(e) => setCurrentExam(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter exam title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select onValueChange={(value) => setCurrentExam(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={currentExam.duration}
                    onChange={(e) => setCurrentExam(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    placeholder="60"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Questions: {currentExam.questions?.length || 0}</span>
                  <span className="text-sm font-medium">Total Marks: {totalMarks}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Proctoring Settings</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="camera" />
                      <label htmlFor="camera" className="text-sm">Enable Camera Monitoring</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="screen" />
                      <label htmlFor="screen" className="text-sm">Screen Recording</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="tab-switch" />
                      <label htmlFor="tab-switch" className="text-sm">Detect Tab Switching</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Add Question</CardTitle>
                <CardDescription>Create questions for your exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Type</label>
                  <Select 
                    value={newQuestion.type} 
                    onValueChange={(value: Question['type']) => setNewQuestion(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="descriptive">Descriptive</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Question</label>
                  <Textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter your question here..."
                    rows={3}
                  />
                </div>

                {newQuestion.type === 'mcq' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Options</label>
                    {newQuestion.options?.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => updateQuestionOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Marks</label>
                  <Input
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                    placeholder="1"
                    min="1"
                  />
                </div>

                <Button onClick={addQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Questions List */}
          {currentExam.questions && currentExam.questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questions ({currentExam.questions.length})</CardTitle>
                <CardDescription>Review and manage your exam questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentExam.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{question.type.toUpperCase()}</Badge>
                            <Badge variant="secondary">{question.marks} marks</Badge>
                          </div>
                          <p className="font-medium">Q{index + 1}: {question.question}</p>
                          {question.options && (
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                              {question.options.map((option, optIndex) => (
                                <li key={optIndex}>• {option}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Publish Exam
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Live Exam Monitoring</span>
              </CardTitle>
              <CardDescription>Real-time monitoring of ongoing examinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentAttempts.map((attempt) => (
                  <div key={attempt.studentId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{attempt.studentName}</h4>
                        <Badge variant={getStatusColor(attempt.status)}>
                          {attempt.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{attempt.timeRemaining} min left</span>
                        </div>
                        {attempt.score && (
                          <div className="font-medium text-green-600">
                            Score: {attempt.score}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{attempt.progress}%</span>
                      </div>
                      <Progress value={attempt.progress} className="w-full" />
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Screen
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4 mr-1" />
                        Flag Activity
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="question-bank">
          <Card>
            <CardHeader>
              <CardTitle>Question Bank</CardTitle>
              <CardDescription>Manage your collection of exam questions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Question bank management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
              <CardDescription>View and analyze examination results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Results analysis coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};