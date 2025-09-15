
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamScheduling } from '@/components/examinations/ExamScheduling';
import { QuestionPaperManagement } from '@/components/examinations/QuestionPaperManagement';
import { InvigilatorAssignment } from '@/components/examinations/InvigilatorAssignment';
import { MarksEntry } from '@/components/examinations/MarksEntry';
import { ResultsManagement } from '@/components/examinations/ResultsManagement';
import { ResultAnalytics } from '@/components/examinations/ResultAnalytics';
import { Calendar, FileText, Users, Calculator, TrendingUp, Award, Brain, Monitor, GraduationCap } from 'lucide-react';
import { QuestionBankManager } from '@/components/examinations/QuestionBankManager';
import { OnlineExamPortal } from '@/components/examinations/OnlineExamPortal';
import { TranscriptGenerator } from '@/components/examinations/TranscriptGenerator';

const ExaminationManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Examination & Grading System</h1>
          <p className="text-muted-foreground">
            Complete exam management with AI grading, question banks, online portals, and automated transcripts
          </p>
        </div>
      </div>

      <Tabs defaultValue="scheduling" className="space-y-4">
        <TabsList className="grid w-full grid-cols-9 text-xs">
          <TabsTrigger value="scheduling" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="papers" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Papers
          </TabsTrigger>
          <TabsTrigger value="question-bank" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            Question Bank
          </TabsTrigger>
          <TabsTrigger value="online-exam" className="flex items-center gap-1">
            <Monitor className="h-3 w-3" />
            Online Exam
          </TabsTrigger>
          <TabsTrigger value="invigilators" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Invigilators
          </TabsTrigger>
          <TabsTrigger value="marks" className="flex items-center gap-1">
            <Calculator className="h-3 w-3" />
            Marks Entry
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            Results
          </TabsTrigger>
          <TabsTrigger value="transcripts" className="flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            Transcripts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduling">
          <Card>
            <CardHeader>
              <CardTitle>Exam Scheduling & Hall Allocation</CardTitle>
              <CardDescription>
                Schedule exams and allocate examination halls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExamScheduling />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="papers">
          <Card>
            <CardHeader>
              <CardTitle>Question Paper Management</CardTitle>
              <CardDescription>
                Manage question papers and exam materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionPaperManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invigilators">
          <Card>
            <CardHeader>
              <CardTitle>Invigilator Assignment</CardTitle>
              <CardDescription>
                Assign invigilators to examination halls and time slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvigilatorAssignment />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks">
          <Card>
            <CardHeader>
              <CardTitle>Digital Marks Entry</CardTitle>
              <CardDescription>
                Enter and validate examination marks with approval workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarksEntry />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Results Management</CardTitle>
              <CardDescription>
                Manage results, generate report cards, and calculate grades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="question-bank">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Question Bank</CardTitle>
              <CardDescription>
                Create, manage, and organize questions with AI assistance and smart tagging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuestionBankManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="online-exam">
          <Card>
            <CardHeader>
              <CardTitle>Online Examination Portal</CardTitle>
              <CardDescription>
                Secure online exams with proctoring, anti-cheating, and real-time monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnlineExamPortal />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcripts">
          <Card>
            <CardHeader>
              <CardTitle>Digital Transcript Generation</CardTitle>
              <CardDescription>
                Generate official transcripts with GPA calculations and digital signatures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TranscriptGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics & Insights</CardTitle>
              <CardDescription>
                Deep analytics with AI insights, performance trends, and predictive analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultAnalytics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExaminationManagement;
