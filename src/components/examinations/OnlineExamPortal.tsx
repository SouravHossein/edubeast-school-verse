import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Clock, Camera, Shield, AlertTriangle, CheckCircle, Eye, Flag, Monitor, Wifi, WifiOff
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options?: string[];
  marks_allocated: number;
  question_order: number;
}

interface ExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  started_at: string;
  time_taken_minutes: number;
  status: string;
}

interface OnlineExam {
  id: string;
  title: string;
  instructions: string;
  duration_minutes: number;
  randomize_questions: boolean;
  randomize_options: boolean;
  anti_cheating_settings: any;
  proctoring_enabled: boolean;
  auto_submit: boolean;
  questions: Question[];
}

export const OnlineExamPortal = () => {
  const [exam, setExam] = useState<OnlineExam | null>(null);
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [proctoringActive, setProctoringActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');
  const [violations, setViolations] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const proctoringIntervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (exam && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) { autoSubmitExam(); return 0; }
          return prev - 1;
        });
      }, 60000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [exam, timeRemaining]);

  useEffect(() => {
    if (proctoringActive) startProctoring();
    else stopProctoring();
    return () => stopProctoring();
  }, [proctoringActive]);

  const startExam = async () => {
    try {
      if (exam?.proctoring_enabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setProctoringActive(true);
      }

      // Tables not yet created — using type assertion
      const { data: attemptData, error } = await (supabase as any)
        .from('student_exam_attempts')
        .insert({
          exam_id: exam!.id,
          student_id: 'current-student-id',
          started_at: new Date().toISOString(),
          status: 'in_progress',
        })
        .select()
        .single();

      if (error) throw error;
      setAttempt(attemptData as ExamAttempt);
      setTimeRemaining(exam!.duration_minutes);
      setExamStarted(true);
      toast({ title: 'Exam Started', description: 'Good luck!' });
    } catch (error) {
      console.error('Error starting exam:', error);
      toast({ title: 'Error', description: 'Failed to start exam.', variant: 'destructive' });
    }
  };

  const startProctoring = () => {
    if (!exam?.proctoring_enabled) return;
    const handleVisibilityChange = () => { if (document.hidden) addViolation('Tab switching detected'); };
    const handleBlur = () => addViolation('Window lost focus');
    const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); addViolation('Right-click attempted'); };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        addViolation(`Keyboard shortcut ${e.key} blocked`);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    proctoringIntervalRef.current = setInterval(() => takeScreenshot(), 30000);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  };

  const stopProctoring = () => {
    if (proctoringIntervalRef.current) clearInterval(proctoringIntervalRef.current);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  const addViolation = (violation: string) => {
    setViolations(prev => [...prev, `${new Date().toLocaleTimeString()}: ${violation}`]);
    if (attempt?.id) {
      (supabase as any)
        .from('student_exam_attempts')
        .update({ proctoring_data: { violations: [...violations, violation], timestamp: new Date().toISOString() } })
        .eq('id', attempt.id);
    }
  };

  const takeScreenshot = async () => {
    try {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx?.drawImage(videoRef.current, 0, 0);
        canvas.toBlob(blob => console.log('Screenshot taken:', blob));
      }
    } catch (error) { console.error('Screenshot error:', error); }
  };

  const saveAnswer = async (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    try {
      await (supabase as any)
        .from('student_answers')
        .upsert({
          attempt_id: attempt!.id,
          question_id: questionId,
          answer_text: answer,
          marks_allocated: exam!.questions.find(q => q.id === questionId)?.marks_allocated || 0,
        });
    } catch (error) { console.error('Error saving answer:', error); }
  };

  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      await (supabase as any)
        .from('student_exam_attempts')
        .update({
          submitted_at: new Date().toISOString(),
          status: 'submitted',
          time_taken_minutes: exam!.duration_minutes - timeRemaining,
        })
        .eq('id', attempt!.id);
      stopProctoring();
      toast({ title: 'Exam Submitted', description: 'Your exam has been submitted successfully!' });
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({ title: 'Error', description: 'Failed to submit exam.', variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  const autoSubmitExam = () => {
    toast({ title: "Time's Up!", description: 'Exam auto-submitted.', variant: 'destructive' });
    submitExam();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const currentQuestion = exam?.questions[currentQuestionIndex];
  const progress = exam ? ((currentQuestionIndex + 1) / exam.questions.length) * 100 : 0;

  if (!exam) {
    return <Card><CardContent className="p-6"><p>Loading exam...</p></CardContent></Card>;
  }

  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-6 w-6" />{exam.title}</CardTitle>
            <CardDescription>Read the instructions carefully before starting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card><CardContent className="p-4 text-center"><Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" /><p className="font-semibold">Duration</p><p className="text-sm text-muted-foreground">{exam.duration_minutes} minutes</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" /><p className="font-semibold">Questions</p><p className="text-sm text-muted-foreground">{exam.questions.length} questions</p></CardContent></Card>
              {exam.proctoring_enabled && (
                <Card><CardContent className="p-4 text-center"><Camera className="h-8 w-8 mx-auto mb-2 text-red-500" /><p className="font-semibold">Proctored</p><p className="text-sm text-muted-foreground">Camera monitoring</p></CardContent></Card>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Instructions</h3>
              <p>{exam.instructions}</p>
              {exam.proctoring_enabled && (
                <Alert><AlertTriangle className="h-4 w-4" /><AlertDescription>This exam is proctored. Your camera will be activated and activity monitored.</AlertDescription></Alert>
              )}
            </div>
            <div className="flex justify-center"><Button onClick={startExam} size="lg">Start Exam</Button></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{exam.title}</CardTitle>
              <CardDescription>Question {currentQuestionIndex + 1} of {exam.questions.length}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {connectionStatus === 'online' ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
                <span className="text-sm">{connectionStatus}</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="h-5 w-5" />
                <span className={timeRemaining <= 5 ? 'text-red-500' : ''}>{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-3" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {currentQuestion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Question {currentQuestionIndex + 1}</span>
                  <Badge variant="secondary">{currentQuestion.marks_allocated} marks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base leading-relaxed">{currentQuestion.question_text}</p>
                {currentQuestion.question_type === 'mcq' && currentQuestion.options && (
                  <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={(value) => saveAnswer(currentQuestion.id, value)}>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded hover:bg-muted">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">{String.fromCharCode(65 + index)}. {option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {['short_answer', 'essay'].includes(currentQuestion.question_type) && (
                  <Textarea value={answers[currentQuestion.id] || ''} onChange={(e) => saveAnswer(currentQuestion.id, e.target.value)} placeholder="Type your answer here..." rows={currentQuestion.question_type === 'essay' ? 8 : 4} />
                )}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} disabled={currentQuestionIndex === 0}>Previous</Button>
                  <div className="flex gap-2">
                    {currentQuestionIndex < exam.questions.length - 1 ? (
                      <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>Next</Button>
                    ) : (
                      <Button onClick={submitExam} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Exam'}</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {exam.proctoring_enabled && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Proctoring</CardTitle></CardHeader>
              <CardContent>
                <video ref={videoRef} autoPlay muted className="w-full rounded-lg" />
                {violations.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-red-600">Violations: {violations.length}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Question Navigator</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-1">
                {exam.questions.map((q, i) => (
                  <Button key={q.id} variant={i === currentQuestionIndex ? 'default' : answers[q.id] ? 'secondary' : 'outline'} size="sm" className="w-8 h-8 p-0" onClick={() => setCurrentQuestionIndex(i)}>{i + 1}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
