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
  Clock, 
  Camera, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Flag,
  Monitor,
  Wifi,
  WifiOff
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
  const intervalRef = useRef<NodeJS.Timeout>();
  const proctoringIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Monitor connection status
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
          if (prev <= 1) {
            autoSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [exam, timeRemaining]);

  useEffect(() => {
    if (proctoringActive) {
      startProctoring();
    } else {
      stopProctoring();
    }
    
    return () => stopProctoring();
  }, [proctoringActive]);

  const startExam = async () => {
    try {
      // Request camera permission if proctoring is enabled
      if (exam?.proctoring_enabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setProctoringActive(true);
      }

      // Create exam attempt
      const { data: attemptData, error } = await supabase
        .from('student_exam_attempts')
        .insert({
          tenant_id: 'current-tenant-id',
          exam_id: exam!.id,
          student_id: 'current-student-id', // Get from auth context
          started_at: new Date().toISOString(),
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      setAttempt(attemptData);
      setTimeRemaining(exam!.duration_minutes);
      setExamStarted(true);
      
      toast({
        title: "Exam Started",
        description: "Good luck! Remember to save your answers frequently.",
      });
    } catch (error) {
      console.error('Error starting exam:', error);
      toast({
        title: "Error",
        description: "Failed to start exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startProctoring = () => {
    if (!exam?.proctoring_enabled) return;

    // Monitor tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addViolation('Tab switching detected');
      }
    };

    // Monitor window focus
    const handleBlur = () => {
      addViolation('Window lost focus');
    };

    // Monitor right-click and copy-paste
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation('Right-click attempted');
    };

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

    // Take periodic screenshots
    proctoringIntervalRef.current = setInterval(() => {
      takeScreenshot();
    }, 30000); // Every 30 seconds

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  };

  const stopProctoring = () => {
    if (proctoringIntervalRef.current) {
      clearInterval(proctoringIntervalRef.current);
    }
    
    // Stop camera stream
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const addViolation = (violation: string) => {
    setViolations(prev => [...prev, `${new Date().toLocaleTimeString()}: ${violation}`]);
    
    // Log violation to backend
    supabase
      .from('student_exam_attempts')
      .update({
        proctoring_data: {
          violations: [...violations, violation],
          timestamp: new Date().toISOString()
        }
      })
      .eq('id', attempt?.id);
  };

  const takeScreenshot = async () => {
    try {
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx?.drawImage(videoRef.current, 0, 0);
        
        // Convert to blob and save (implement storage logic)
        canvas.toBlob(blob => {
          // Save screenshot to storage
          console.log('Screenshot taken:', blob);
        });
      }
    } catch (error) {
      console.error('Screenshot error:', error);
    }
  };

  const saveAnswer = async (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Auto-save to backend
    try {
      await supabase
        .from('student_answers')
        .upsert({
          attempt_id: attempt!.id,
          question_id: questionId,
          answer_text: answer,
          marks_allocated: exam!.questions.find(q => q.id === questionId)?.marks_allocated || 0
        });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const submitExam = async () => {
    setIsSubmitting(true);
    
    try {
      // Update attempt status
      await supabase
        .from('student_exam_attempts')
        .update({
          submitted_at: new Date().toISOString(),
          status: 'submitted',
          time_taken_minutes: exam!.duration_minutes - timeRemaining
        })
        .eq('id', attempt!.id);

      stopProctoring();
      
      toast({
        title: "Exam Submitted",
        description: "Your exam has been submitted successfully!",
      });
      
      // Redirect to results or dashboard
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const autoSubmitExam = () => {
    toast({
      title: "Time's Up!",
      description: "Exam auto-submitted due to time limit.",
      variant: "destructive",
    });
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
    return (
      <Card>
        <CardContent className="p-6">
          <p>Loading exam...</p>
        </CardContent>
      </Card>
    );
  }

  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              {exam.title}
            </CardTitle>
            <CardDescription>
              Read the instructions carefully before starting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-semibold">Duration</p>
                  <p className="text-sm text-muted-foreground">{exam.duration_minutes} minutes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="font-semibold">Questions</p>
                  <p className="text-sm text-muted-foreground">{exam.questions.length} questions</p>
                </CardContent>
              </Card>
              
              {exam.proctoring_enabled && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    <p className="font-semibold">Proctored</p>
                    <p className="text-sm text-muted-foreground">Camera monitoring</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Instructions</h3>
              <div className="prose prose-sm max-w-none">
                <p>{exam.instructions}</p>
              </div>
              
              {exam.proctoring_enabled && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This exam is proctored. Your camera will be activated and your activity will be monitored.
                    Ensure you're in a quiet environment with good lighting.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-center">
              <Button onClick={startExam} size="lg">
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exam Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{exam.title}</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {connectionStatus === 'online' ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">{connectionStatus}</span>
              </div>
              
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="h-5 w-5" />
                <span className={timeRemaining <= 5 ? 'text-red-500' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="mt-3" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3 space-y-6">
          {currentQuestion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Question {currentQuestionIndex + 1}</span>
                  <Badge variant="secondary">
                    {currentQuestion.marks_allocated} marks
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-base leading-relaxed">
                    {currentQuestion.question_text}
                  </p>
                </div>

                {currentQuestion.question_type === 'mcq' && currentQuestion.options && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={(value) => saveAnswer(currentQuestion.id, value)}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {String.fromCharCode(65 + index)}. {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {['short_answer', 'essay'].includes(currentQuestion.question_type) && (
                  <Textarea
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => saveAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={currentQuestion.question_type === 'essay' ? 8 : 4}
                  />
                )}

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Flag question for review
                        toast({
                          title: "Question Flagged",
                          description: "Question marked for review",
                        });
                      }}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Flag
                    </Button>
                    
                    {currentQuestionIndex === exam.questions.length - 1 ? (
                      <Button
                        onClick={submitExam}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Submit Exam
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Question Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentQuestionIndex ? "default" : "outline"}
                    size="sm"
                    className={`w-full aspect-square ${
                      answers[exam.questions[index].id] ? 'bg-green-100 border-green-300' : ''
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proctoring Status */}
          {exam.proctoring_enabled && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Proctoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full rounded border"
                  style={{ maxHeight: '120px' }}
                />
                
                {violations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-600">
                      Violations Detected ({violations.length})
                    </p>
                    <div className="max-h-24 overflow-y-auto text-xs space-y-1">
                      {violations.slice(-3).map((violation, index) => (
                        <p key={index} className="text-red-600">{violation}</p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span>{Object.keys(answers).length}/{exam.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Used:</span>
                  <span>{formatTime(exam.duration_minutes - timeRemaining)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className={timeRemaining <= 5 ? 'text-red-500 font-bold' : ''}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};