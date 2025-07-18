
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Save, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudentMark {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  marks: number | null;
  status: 'pending' | 'entered' | 'verified' | 'approved';
}

interface ExamMarks {
  id: string;
  examTitle: string;
  subject: string;
  class: string;
  totalMarks: number;
  enteredBy?: string;
  verifiedBy?: string;
  approvedBy?: string;
  status: 'draft' | 'submitted' | 'verified' | 'approved';
  students: StudentMark[];
}

export const MarksEntry = () => {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [examMarks, setExamMarks] = useState<ExamMarks[]>([
    {
      id: '1',
      examTitle: 'Mathematics Mid-Term',
      subject: 'Mathematics',
      class: 'Grade 10A',
      totalMarks: 100,
      status: 'draft',
      students: [
        { id: '1', studentId: 's1', studentName: 'John Doe', rollNumber: '001', marks: 85, status: 'entered' },
        { id: '2', studentId: 's2', studentName: 'Jane Smith', rollNumber: '002', marks: 92, status: 'entered' },
        { id: '3', studentId: 's3', studentName: 'Mike Johnson', rollNumber: '003', marks: null, status: 'pending' },
        { id: '4', studentId: 's4', studentName: 'Sarah Wilson', rollNumber: '004', marks: 78, status: 'entered' }
      ]
    },
    {
      id: '2',
      examTitle: 'English Literature',
      subject: 'English',
      class: 'Grade 11A',
      totalMarks: 80,
      status: 'submitted',
      enteredBy: 'Ms. Johnson',
      students: [
        { id: '5', studentId: 's5', studentName: 'Alice Brown', rollNumber: '005', marks: 74, status: 'verified' },
        { id: '6', studentId: 's6', studentName: 'Bob Davis', rollNumber: '006', marks: 68, status: 'verified' }
      ]
    }
  ]);

  const getCurrentExam = () => {
    return examMarks.find(exam => exam.id === selectedExam);
  };

  const updateStudentMark = (studentId: string, marks: number) => {
    setExamMarks(prev => prev.map(exam => 
      exam.id === selectedExam 
        ? {
            ...exam,
            students: exam.students.map(student =>
              student.id === studentId
                ? { ...student, marks, status: 'entered' }
                : student
            )
          }
        : exam
    ));
  };

  const validateMarks = (marks: number, totalMarks: number): boolean => {
    return marks >= 0 && marks <= totalMarks;
  };

  const saveMarks = () => {
    const currentExam = getCurrentExam();
    if (!currentExam) return;

    const hasInvalidMarks = currentExam.students.some(student => 
      student.marks !== null && !validateMarks(student.marks, currentExam.totalMarks)
    );

    if (hasInvalidMarks) {
      toast({
        title: "Invalid Marks",
        description: "Please check marks are within valid range.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Marks Saved",
      description: "Marks have been saved successfully.",
    });
  };

  const submitForVerification = () => {
    const currentExam = getCurrentExam();
    if (!currentExam) return;

    const pendingMarks = currentExam.students.filter(student => student.marks === null);
    if (pendingMarks.length > 0) {
      toast({
        title: "Incomplete Marks",
        description: `${pendingMarks.length} students still have pending marks.`,
        variant: "destructive"
      });
      return;
    }

    setExamMarks(prev => prev.map(exam => 
      exam.id === selectedExam 
        ? { ...exam, status: 'submitted', enteredBy: 'Current User' }
        : exam
    ));

    toast({
      title: "Submitted for Verification",
      description: "Marks have been submitted for verification.",
    });
  };

  const approveMarks = (examId: string) => {
    setExamMarks(prev => prev.map(exam => 
      exam.id === examId 
        ? { 
            ...exam, 
            status: 'approved', 
            approvedBy: 'Current User',
            students: exam.students.map(student => ({ ...student, status: 'approved' }))
          }
        : exam
    ));

    toast({
      title: "Marks Approved",
      description: "Marks have been approved successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentExam = getCurrentExam();
  const completedMarks = currentExam?.students.filter(s => s.marks !== null).length || 0;
  const totalStudents = currentExam?.students.length || 0;
  const averageMarks = currentExam?.students.reduce((sum, s) => sum + (s.marks || 0), 0) / (completedMarks || 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Digital Marks Entry</h3>
          <p className="text-sm text-muted-foreground">
            Enter and validate examination marks with approval workflow
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveMarks} variant="outline" disabled={!selectedExam}>
            <Save className="h-4 w-4 mr-2" />
            Save Marks
          </Button>
          <Button onClick={submitForVerification} disabled={!selectedExam || currentExam?.status !== 'draft'}>
            <Send className="h-4 w-4 mr-2" />
            Submit for Verification
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Select Exam</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger>
                <SelectValue placeholder="Choose exam" />
              </SelectTrigger>
              <SelectContent>
                {examMarks.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id}>
                    {exam.examTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {currentExam && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedMarks}/{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Students completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageMarks.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Out of {currentExam.totalMarks}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(currentExam.status)}>
                  {currentExam.status}
                </Badge>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {currentExam && (
        <Card>
          <CardHeader>
            <CardTitle>{currentExam.examTitle}</CardTitle>
            <CardDescription>
              {currentExam.subject} - {currentExam.class} (Total Marks: {currentExam.totalMarks})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Marks Obtained</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentExam.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.studentName}</TableCell>
                    <TableCell>
                      {currentExam.status === 'draft' ? (
                        <Input
                          type="number"
                          min="0"
                          max={currentExam.totalMarks}
                          value={student.marks || ''}
                          onChange={(e) => {
                            const marks = parseInt(e.target.value);
                            if (!isNaN(marks)) {
                              updateStudentMark(student.id, marks);
                            }
                          }}
                          className="w-20"
                          placeholder="0"
                        />
                      ) : (
                        <span>{student.marks || '-'}</span>
                      )}
                      <span className="text-sm text-muted-foreground ml-2">
                        / {currentExam.totalMarks}
                      </span>
                    </TableCell>
                    <TableCell>
                      {student.marks 
                        ? `${((student.marks / currentExam.totalMarks) * 100).toFixed(1)}%`
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          student.status === 'approved' ? 'default' :
                          student.status === 'verified' ? 'secondary' :
                          student.status === 'entered' ? 'outline' : 'destructive'
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
          <CardDescription>
            Manage marks approval process for all exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Entered By</TableHead>
                <TableHead>Verified By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examMarks.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.examTitle}</TableCell>
                  <TableCell>{exam.enteredBy || '-'}</TableCell>
                  <TableCell>{exam.verifiedBy || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(exam.status)}>
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {exam.status === 'verified' && (
                      <Button 
                        size="sm" 
                        onClick={() => approveMarks(exam.id)}
                      >
                        Approve
                      </Button>
                    )}
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
