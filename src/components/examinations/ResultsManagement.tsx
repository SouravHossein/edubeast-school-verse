
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Download, FileText, Calculator, Users, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjects: {
    [subject: string]: {
      marks: number;
      totalMarks: number;
      grade: string;
    };
  };
  totalMarks: number;
  totalPossible: number;
  percentage: number;
  gpa: number;
  grade: string;
  rank: number;
  status: 'draft' | 'published';
}

export const ResultsManagement = () => {
  const [selectedClass, setSelectedClass] = useState<string>('Grade 10A');
  const [selectedExamType, setSelectedExamType] = useState<string>('Mid-Term');
  
  const [results, setResults] = useState<StudentResult[]>([
    {
      id: '1',
      studentId: 's1',
      studentName: 'John Doe',
      rollNumber: '001',
      subjects: {
        'Mathematics': { marks: 85, totalMarks: 100, grade: 'A' },
        'English': { marks: 78, totalMarks: 100, grade: 'B+' },
        'Science': { marks: 92, totalMarks: 100, grade: 'A+' },
        'History': { marks: 74, totalMarks: 100, grade: 'B' }
      },
      totalMarks: 329,
      totalPossible: 400,
      percentage: 82.25,
      gpa: 3.6,
      grade: 'A',
      rank: 2,
      status: 'published'
    },
    {
      id: '2',
      studentId: 's2',
      studentName: 'Jane Smith',
      rollNumber: '002',
      subjects: {
        'Mathematics': { marks: 95, totalMarks: 100, grade: 'A+' },
        'English': { marks: 88, totalMarks: 100, grade: 'A' },
        'Science': { marks: 94, totalMarks: 100, grade: 'A+' },
        'History': { marks: 86, totalMarks: 100, grade: 'A' }
      },
      totalMarks: 363,
      totalPossible: 400,
      percentage: 90.75,
      gpa: 4.0,
      grade: 'A+',
      rank: 1,
      status: 'published'
    },
    {
      id: '3',
      studentId: 's3',
      studentName: 'Mike Johnson',
      rollNumber: '003',
      subjects: {
        'Mathematics': { marks: 72, totalMarks: 100, grade: 'B' },
        'English': { marks: 65, totalMarks: 100, grade: 'B-' },
        'Science': { marks: 78, totalMarks: 100, grade: 'B+' },
        'History': { marks: 69, totalMarks: 100, grade: 'B-' }
      },
      totalMarks: 284,
      totalPossible: 400,
      percentage: 71.0,
      gpa: 2.8,
      grade: 'B',
      rank: 3,
      status: 'draft'
    }
  ]);

  const [gradeConfig, setGradeConfig] = useState({
    'A+': { min: 90, gpa: 4.0 },
    'A': { min: 80, gpa: 3.5 },
    'B+': { min: 75, gpa: 3.0 },
    'B': { min: 65, gpa: 2.5 },
    'B-': { min: 60, gpa: 2.0 },
    'C': { min: 50, gpa: 1.5 },
    'F': { min: 0, gpa: 0.0 }
  });

  const calculateGrade = (percentage: number): string => {
    for (const [grade, config] of Object.entries(gradeConfig)) {
      if (percentage >= config.min) {
        return grade;
      }
    }
    return 'F';
  };

  const calculateGPA = (percentage: number): number => {
    const grade = calculateGrade(percentage);
    return gradeConfig[grade as keyof typeof gradeConfig]?.gpa || 0;
  };

  const generateReportCard = (studentId: string) => {
    const student = results.find(r => r.id === studentId);
    if (!student) return;

    toast({
      title: "Report Card Generated",
      description: `Report card for ${student.studentName} has been generated.`,
    });
  };

  const publishResults = () => {
    setResults(results.map(result => ({ ...result, status: 'published' })));
    toast({
      title: "Results Published",
      description: "All results have been published successfully.",
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-green-100 text-green-700';
      case 'B+': return 'bg-blue-100 text-blue-800';
      case 'B': return 'bg-blue-100 text-blue-700';
      case 'B-': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const classAverage = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
  const highestScore = Math.max(...results.map(r => r.percentage));
  const passCount = results.filter(r => r.percentage >= 50).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Results Management</h3>
          <p className="text-sm text-muted-foreground">
            Generate report cards and manage examination results
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button onClick={publishResults}>
            <FileText className="h-4 w-4 mr-2" />
            Publish Results
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classAverage.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highestScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((passCount / results.length) * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Filter Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grade 9A">Grade 9A</SelectItem>
                  <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                  <SelectItem value="Grade 11A">Grade 11A</SelectItem>
                  <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Exam Type</Label>
              <Select value={selectedExamType} onValueChange={setSelectedExamType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unit Test">Unit Test</SelectItem>
                  <SelectItem value="Mid-Term">Mid-Term</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(gradeConfig).map(([grade, config]) => (
                <div key={grade} className="flex items-center justify-between">
                  <Badge className={getGradeColor(grade)}>
                    {grade}
                  </Badge>
                  <span className="text-sm">
                    {config.min}%+ (GPA: {config.gpa})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Student Results - {selectedClass} ({selectedExamType})
          </CardTitle>
          <CardDescription>
            View and manage individual student results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.sort((a, b) => a.rank - b.rank).map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">#{student.rank}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>
                    {student.totalMarks}/{student.totalPossible}
                  </TableCell>
                  <TableCell>{student.percentage.toFixed(1)}%</TableCell>
                  <TableCell>{student.gpa.toFixed(1)}</TableCell>
                  <TableCell>
                    <Badge className={getGradeColor(student.grade)}>
                      {student.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'published' ? 'default' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => generateReportCard(student.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Report Card
                    </Button>
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
