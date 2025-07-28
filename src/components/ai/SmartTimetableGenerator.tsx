import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimetableConstraint {
  id: string;
  type: 'teacher_availability' | 'room_capacity' | 'subject_priority' | 'break_timing';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface GeneratedTimetable {
  day: string;
  periods: Array<{
    time: string;
    subject: string;
    teacher: string;
    room: string;
    class: string;
  }>;
}

export const SmartTimetableGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedClass, setSelectedClass] = useState('');
  const [constraints, setConstraints] = useState<TimetableConstraint[]>([
    { id: '1', type: 'teacher_availability', description: 'Ms. Smith unavailable on Fridays', priority: 'high' },
    { id: '2', type: 'room_capacity', description: 'Lab Room A max 30 students', priority: 'medium' },
    { id: '3', type: 'subject_priority', description: 'Math classes in morning slots', priority: 'high' },
    { id: '4', type: 'break_timing', description: 'Lunch break 12:00-1:00 PM', priority: 'high' }
  ]);
  const [generatedTimetable, setGeneratedTimetable] = useState<GeneratedTimetable[]>([]);
  
  const { toast } = useToast();

  const classes = [
    { id: '1', name: 'Grade 10-A' },
    { id: '2', name: 'Grade 10-B' },
    { id: '3', name: 'Grade 11-A' },
    { id: '4', name: 'Grade 12-A' }
  ];

  const generateTimetable = async () => {
    if (!selectedClass) {
      toast({
        title: "Error",
        description: "Please select a class first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate AI processing
    const steps = [
      'Analyzing teacher availability...',
      'Checking room constraints...',
      'Optimizing subject distribution...',
      'Resolving conflicts...',
      'Finalizing timetable...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress((i + 1) * 20);
    }

    // Generate mock timetable
    const mockTimetable: GeneratedTimetable[] = [
      {
        day: 'Monday',
        periods: [
          { time: '9:00-10:00', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', class: selectedClass },
          { time: '10:00-11:00', subject: 'Physics', teacher: 'Dr. Brown', room: 'Lab A', class: selectedClass },
          { time: '11:15-12:15', subject: 'English', teacher: 'Ms. Davis', room: 'Room 205', class: selectedClass },
          { time: '1:00-2:00', subject: 'Chemistry', teacher: 'Prof. Wilson', room: 'Lab B', class: selectedClass },
        ]
      },
      {
        day: 'Tuesday',
        periods: [
          { time: '9:00-10:00', subject: 'Biology', teacher: 'Dr. Smith', room: 'Lab C', class: selectedClass },
          { time: '10:00-11:00', subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 101', class: selectedClass },
          { time: '11:15-12:15', subject: 'History', teacher: 'Ms. Taylor', room: 'Room 301', class: selectedClass },
          { time: '1:00-2:00', subject: 'Physical Education', teacher: 'Coach Martinez', room: 'Gymnasium', class: selectedClass },
        ]
      }
    ];

    setGeneratedTimetable(mockTimetable);
    setIsGenerating(false);
    
    toast({
      title: "Success",
      description: "AI-optimized timetable generated successfully!",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Smart Timetable Generator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Configuration</span>
              </CardTitle>
              <CardDescription>
                Set up constraints and preferences for AI optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateTimetable} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate AI Timetable
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    {progress}% Complete
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Constraints</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {constraints.map((constraint) => (
                  <div key={constraint.id} className="flex items-start space-x-2">
                    <Badge variant={getPriorityColor(constraint.priority)} className="mt-1">
                      {constraint.priority}
                    </Badge>
                    <p className="text-sm flex-1">{constraint.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Timetable */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Generated Timetable</span>
              </CardTitle>
              <CardDescription>
                AI-optimized schedule with conflict resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedTimetable.length > 0 ? (
                <div className="space-y-6">
                  {generatedTimetable.map((day) => (
                    <div key={day.day} className="space-y-3">
                      <h3 className="font-semibold text-lg border-b pb-2">{day.day}</h3>
                      <div className="grid gap-2">
                        {day.periods.map((period, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{period.time}</span>
                              </div>
                              <div className="font-medium">{period.subject}</div>
                            </div>
                            <div className="text-right text-sm space-y-1">
                              <div className="font-medium">{period.teacher}</div>
                              <div className="text-muted-foreground">{period.room}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Export to Calendar
                    </Button>
                    <Button variant="outline">
                      Save as Template
                    </Button>
                    <Button>
                      Apply Timetable
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Select a class and click "Generate AI Timetable" to create an optimized schedule
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};