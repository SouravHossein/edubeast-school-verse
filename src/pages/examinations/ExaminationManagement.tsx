
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamScheduling } from '@/components/examinations/ExamScheduling';
import { QuestionPaperManagement } from '@/components/examinations/QuestionPaperManagement';
import { InvigilatorAssignment } from '@/components/examinations/InvigilatorAssignment';
import { MarksEntry } from '@/components/examinations/MarksEntry';
import { ResultsManagement } from '@/components/examinations/ResultsManagement';
import { ResultAnalytics } from '@/components/examinations/ResultAnalytics';
import { Calendar, FileText, Users, Calculator, TrendingUp, Award } from 'lucide-react';

const ExaminationManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examination Management</h1>
          <p className="text-muted-foreground">
            Manage exams, marks, and results comprehensively
          </p>
        </div>
      </div>

      <Tabs defaultValue="scheduling" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Exam Scheduling
          </TabsTrigger>
          <TabsTrigger value="papers" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Question Papers
          </TabsTrigger>
          <TabsTrigger value="invigilators" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Invigilators
          </TabsTrigger>
          <TabsTrigger value="marks" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Marks Entry
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
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

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Result Analytics & Insights</CardTitle>
              <CardDescription>
                Analyze examination results and generate insights
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
