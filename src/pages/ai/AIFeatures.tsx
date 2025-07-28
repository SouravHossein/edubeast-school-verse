import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartTimetableGenerator } from '@/components/ai/SmartTimetableGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, Users, AlertCircle } from 'lucide-react';

export default function AIFeatures() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Features</h1>
          <p className="text-muted-foreground">Intelligent automation and insights for school management</p>
        </div>
      </div>

      <Tabs defaultValue="timetable" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timetable">Smart Timetable</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
          <TabsTrigger value="insights">Performance Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="timetable">
          <SmartTimetableGenerator />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Predictive Analytics</span>
              </CardTitle>
              <CardDescription>
                AI-powered insights to predict student performance and identify at-risk students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">At-Risk Students</p>
                        <p className="text-2xl font-bold text-red-600">12</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Students predicted to need additional support
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Performance Trend</p>
                        <p className="text-2xl font-bold text-green-600">+5.2%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Average improvement this term
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                        <p className="text-2xl font-bold text-blue-600">87%</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Overall student engagement level
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Predictive Insights</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Mathematics Performance</h4>
                    <p className="text-sm text-muted-foreground">AI predicts 15% improvement in Grade 10 math scores with targeted interventions</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Attendance Patterns</h4>
                    <p className="text-sm text-muted-foreground">Thursday absences are 23% higher - consider scheduling important classes on other days</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Resource Optimization</h4>
                    <p className="text-sm text-muted-foreground">Lab A is underutilized - suggest adding 2 more practical sessions per week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI Assistant</span>
              </CardTitle>
              <CardDescription>
                Intelligent chatbot to help parents, students, and staff with common queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">EduBot Assistant</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Hi! I'm EduBot, your AI assistant. I can help with:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Answering questions about school policies</li>
                  <li>• Providing homework and assignment information</li>
                  <li>• Helping with fee payment procedures</li>
                  <li>• Scheduling parent-teacher meetings</li>
                  <li>• Checking attendance and grades</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Common Queries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 rounded border hover:bg-muted">
                        "What are the school timings?"
                      </button>
                      <button className="w-full text-left p-3 rounded border hover:bg-muted">
                        "How do I check my child's grades?"
                      </button>
                      <button className="w-full text-left p-3 rounded border hover:bg-muted">
                        "What's the fee payment deadline?"
                      </button>
                      <button className="w-full text-left p-3 rounded border hover:bg-muted">
                        "How to schedule a parent meeting?"
                      </button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Queries Resolved</span>
                        <span className="font-medium">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Satisfaction Rate</span>
                        <span className="font-medium text-green-600">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Response Time</span>
                        <span className="font-medium">&lt; 2 seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Active Users</span>
                        <span className="font-medium">342</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>
                AI-generated insights about student and institutional performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Student Performance Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800">Strong Performers</h4>
                        <p className="text-sm text-blue-700">
                          Grade 11-A shows 18% above average performance in STEM subjects
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-medium text-yellow-800">Needs Attention</h4>
                        <p className="text-sm text-yellow-700">
                          History scores have declined 12% across all grades this term
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800">Improvement Opportunity</h4>
                        <p className="text-sm text-green-700">
                          Small group tutoring could boost performance by estimated 15%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Operational Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h4 className="font-medium text-purple-800">Resource Utilization</h4>
                        <p className="text-sm text-purple-700">
                          Computer lab is at 95% capacity - consider adding more slots
                        </p>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-lg">
                        <h4 className="font-medium text-indigo-800">Teacher Workload</h4>
                        <p className="text-sm text-indigo-700">
                          Math teachers have 15% higher workload than recommended
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <h4 className="font-medium text-emerald-800">Cost Optimization</h4>
                        <p className="text-sm text-emerald-700">
                          Switching to digital assignments could save $2,400 annually
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}