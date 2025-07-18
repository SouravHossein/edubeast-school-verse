
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, AlertCircle } from 'lucide-react';

export const ResultAnalytics = () => {
  const [selectedClass, setSelectedClass] = useState<string>('Grade 10A');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  // Sample data for analytics
  const gradeDistribution = [
    { grade: 'A+', count: 8, percentage: 20 },
    { grade: 'A', count: 12, percentage: 30 },
    { grade: 'B+', count: 10, percentage: 25 },
    { grade: 'B', count: 6, percentage: 15 },
    { grade: 'B-', count: 3, percentage: 7.5 },
    { grade: 'C', count: 1, percentage: 2.5 }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', average: 78.5, highest: 98, lowest: 45 },
    { subject: 'English', average: 82.3, highest: 95, lowest: 52 },
    { subject: 'Science', average: 75.8, highest: 96, lowest: 38 },
    { subject: 'History', average: 80.1, highest: 92, lowest: 48 },
    { subject: 'Geography', average: 77.4, highest: 89, lowest: 43 }
  ];

  const trendData = [
    { exam: 'Unit Test 1', average: 75.2 },
    { exam: 'Unit Test 2', average: 78.1 },
    { exam: 'Mid-Term', average: 80.5 },
    { exam: 'Unit Test 3', average: 82.3 },
    { exam: 'Final', average: 85.1 }
  ];

  const performanceBands = [
    { band: 'Excellent (90-100%)', count: 8, color: '#22c55e' },
    { band: 'Good (80-89%)', count: 15, color: '#3b82f6' },
    { band: 'Average (70-79%)', count: 12, color: '#f59e0b' },
    { band: 'Below Average (60-69%)', count: 4, color: '#f97316' },
    { band: 'Poor (<60%)', count: 1, color: '#ef4444' }
  ];

  const classComparison = [
    { class: 'Grade 9A', average: 76.5 },
    { class: 'Grade 9B', average: 74.2 },
    { class: 'Grade 10A', average: 80.5 },
    { class: 'Grade 10B', average: 78.8 },
    { class: 'Grade 11A', average: 82.1 },
    { class: 'Grade 12A', average: 85.3 }
  ];

  const topPerformers = [
    { name: 'Jane Smith', rollNo: '002', percentage: 90.75, rank: 1 },
    { name: 'John Doe', rollNo: '001', percentage: 82.25, rank: 2 },
    { name: 'Alice Brown', rollNo: '005', percentage: 81.50, rank: 3 },
    { name: 'Bob Wilson', rollNo: '008', percentage: 79.25, rank: 4 },
    { name: 'Carol Davis', rollNo: '012', percentage: 78.75, rank: 5 }
  ];

  const improvementNeeded = [
    { name: 'Mike Johnson', rollNo: '003', percentage: 71.0, subjects: ['Mathematics', 'Science'] },
    { name: 'Sarah Lee', rollNo: '015', percentage: 68.5, subjects: ['English', 'History'] },
    { name: 'Tom Brown', rollNo: '018', percentage: 65.2, subjects: ['Mathematics'] }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Result Analytics & Insights</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive analysis of examination results and performance trends
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Grade 9A">Grade 9A</SelectItem>
              <SelectItem value="Grade 10A">Grade 10A</SelectItem>
              <SelectItem value="Grade 11A">Grade 11A</SelectItem>
              <SelectItem value="Grade 12A">Grade 12A</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="History">History</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last exam
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-muted-foreground">
              37 out of 40 students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Jane Smith (Roll: 002)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Students need support
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Distribution of grades across the class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Class average performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exam" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="average" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Average performance by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="subject" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="average" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Bands</CardTitle>
            <CardDescription>Students grouped by performance levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceBands}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ band, count }) => `${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {performanceBands.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Top Performers
            </CardTitle>
            <CardDescription>Students with highest performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((student, index) => (
                <div key={student.rollNo} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-700">
                      #{student.rank}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Roll: {student.rollNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">{student.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Needs Improvement
            </CardTitle>
            <CardDescription>Students requiring additional support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {improvementNeeded.map((student) => (
                <div key={student.rollNo} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Roll: {student.rollNo}</p>
                    <p className="text-xs text-orange-600">
                      Focus: {student.subjects.join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-700">{student.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Class Comparison</CardTitle>
          <CardDescription>Average performance across different classes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
