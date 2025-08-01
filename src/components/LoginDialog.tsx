import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Mail, GraduationCap, Users, BookOpen, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'admin' | 'teacher' | 'student' | 'parent' | null;
  setSelectedRole: (role: 'admin' | 'teacher' | 'student' | 'parent' | null) => void;
}

const roleConfig = {
  admin: {
    icon: Shield,
    title: 'Admin Portal',
    description: 'Access administrative controls and school management',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  teacher: {
    icon: GraduationCap,
    title: 'Teacher Portal',
    description: 'Manage classes, assignments, and student progress',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  student: {
    icon: BookOpen,
    title: 'Student Portal',
    description: 'Access courses, assignments, and grades',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  parent: {
    icon: Users,
    title: 'Parent Portal',
    description: 'Monitor your child\'s academic progress',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
};

export const LoginDialog: React.FC<LoginDialogProps> = ({ setSelectedRole,isOpen, onClose, role }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: '',
  });
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (activeTab === 'login') {
        success = await login(formData.email, formData.password, role);
      } else {
        success = await register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role,
          studentId: formData.studentId,
        });
      }
      
      if (success) {
        onClose();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) return null;

  const config = roleConfig[role];
  const IconComponent = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {/* Change role */}
        <Tabs>
          <TabsList className="flex justify-between">
            <TabsTrigger value="student" onClick={() => setSelectedRole('student')}>
              Student
            </TabsTrigger>
            <TabsTrigger value="teacher" onClick={() => setSelectedRole('teacher')}>
              Teacher
            </TabsTrigger>
            <TabsTrigger value="parent" onClick={() =>  setSelectedRole('parent')}>
              Parent
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <DialogHeader>
          <div className={`flex items-center space-x-3 p-4 rounded-lg ${config.bgColor} mb-4`}>
            <div className={`p-2 rounded-full bg-white shadow-soft`}>
              <IconComponent className={`w-6 h-6 ${config.color}`} />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">{config.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
            </div>
          </div>
        </DialogHeader>

        

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your {role} account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full transition-smooth" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                  </Button>
                  <Button variant="link" size="sm">
                    Forgot your password?
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Sign up for your {role} account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  {role === 'student' && (
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        name="studentId"
                        type="text"
                        placeholder="Enter your student ID"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full transition-smooth" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};