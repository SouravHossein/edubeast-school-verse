import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Video, FileText, Users, Play, Clock, Star, Upload, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  progress?: number;
  thumbnail: string;
  status: 'published' | 'draft' | 'archived';
}

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  subject: string;
  startTime: string;
  duration: number;
  participants: number;
  status: 'upcoming' | 'live' | 'ended';
  meetingLink?: string;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  submitted: boolean;
  grade?: number;
  status: 'pending' | 'submitted' | 'graded';
}

export const ELearningPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Advanced Mathematics',
      description: 'Comprehensive calculus and algebra course',
      instructor: 'Dr. Smith',
      duration: '12 weeks',
      lessons: 48,
      students: 156,
      rating: 4.8,
      progress: 65,
      thumbnail: '/placeholder.svg',
      status: 'published'
    },
    {
      id: '2', 
      title: 'Physics Fundamentals',
      description: 'Basic principles of physics with practical applications',
      instructor: 'Prof. Johnson',
      duration: '10 weeks',
      lessons: 35,
      students: 89,
      rating: 4.6,
      progress: 30,
      thumbnail: '/placeholder.svg',
      status: 'published'
    }
  ]);

  const [liveClasses] = useState<LiveClass[]>([
    {
      id: '1',
      title: 'Calculus Review Session',
      instructor: 'Dr. Smith',
      subject: 'Mathematics',
      startTime: '10:00 AM',
      duration: 60,
      participants: 45,
      status: 'upcoming',
      meetingLink: 'https://meet.google.com/abc-def-ghi'
    },
    {
      id: '2',
      title: 'Chemistry Lab Demo',
      instructor: 'Ms. Davis',
      subject: 'Chemistry',
      startTime: '2:00 PM',
      duration: 90,
      participants: 32,
      status: 'live'
    }
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Quadratic Equations Worksheet',
      course: 'Advanced Mathematics',
      dueDate: '2024-07-20',
      submitted: false,
      status: 'pending'
    },
    {
      id: '2',
      title: 'Physics Lab Report',
      course: 'Physics Fundamentals',
      dueDate: '2024-07-18',
      submitted: true,
      grade: 92,
      status: 'graded'
    }
  ]);

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': case 'live': case 'graded': return 'default';
      case 'draft': case 'upcoming': case 'pending': return 'secondary';
      case 'archived': case 'ended': case 'submitted': return 'outline';
      default: return 'default';
    }
  };

  const joinLiveClass = (classItem: LiveClass) => {
    if (classItem.meetingLink) {
      window.open(classItem.meetingLink, '_blank');
    } else {
      toast({
        title: "Joining Class",
        description: `Starting ${classItem.title}...`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">E-Learning Platform</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="live">Live Classes</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="library">Digital Library</TabsTrigger>
          <TabsTrigger value="create">Create Content</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Video className="h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-muted-foreground">by {course.instructor}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.progress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="w-full" />
                    </div>
                  )}
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <div className="grid gap-4">
            {liveClasses.map((classItem) => (
              <Card key={classItem.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{classItem.title}</h3>
                        <Badge variant={getStatusColor(classItem.status)}>
                          {classItem.status}
                        </Badge>
                        {classItem.status === 'live' && (
                          <Badge variant="destructive" className="animate-pulse">
                            LIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {classItem.subject} • {classItem.instructor}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{classItem.startTime} ({classItem.duration} min)</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{classItem.participants} participants</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {classItem.status === 'live' && (
                        <Button onClick={() => joinLiveClass(classItem)}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Now
                        </Button>
                      )}
                      {classItem.status === 'upcoming' && (
                        <Button variant="outline" onClick={() => joinLiveClass(classItem)}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Class
                        </Button>
                      )}
                      {classItem.status === 'ended' && (
                        <Button variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Recording
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <div className="grid gap-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{assignment.title}</h3>
                        <Badge variant={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{assignment.course}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span>Due: {assignment.dueDate}</span>
                        {assignment.grade && (
                          <span className="font-medium text-green-600">
                            Grade: {assignment.grade}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!assignment.submitted && (
                        <Button>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit
                        </Button>
                      )}
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Digital Library</CardTitle>
              <CardDescription>Access course materials, e-books, and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Textbooks', 'Video Lectures', 'Research Papers', 'Practice Tests'].map((category) => (
                  <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">{category}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.floor(Math.random() * 50) + 10} items
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Learning Content</CardTitle>
              <CardDescription>Upload videos, documents, and create interactive content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Title</label>
                <Input placeholder="Enter content title" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Lecture</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="quiz">Interactive Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Describe your content..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Files</label>
                <Input type="file" multiple />
              </div>

              <div className="flex space-x-2">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};