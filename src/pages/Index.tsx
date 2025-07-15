import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart, 
  Shield, 
  Smartphone,
  CheckCircle,
  Star,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  FileText
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Comprehensive student profiles, enrollment, and progress tracking',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: GraduationCap,
      title: 'Teacher Portal',
      description: 'Grade management, lesson planning, and class administration',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Calendar,
      title: 'Schedule Management',
      description: 'Timetables, events, and automated scheduling system',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: BarChart,
      title: 'Analytics & Reports',
      description: 'Detailed insights and customizable reporting tools',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Parent-teacher messaging and school announcements',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Role-based access control and data protection',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const benefits = [
    'Streamlined administrative processes',
    'Improved parent-teacher communication',
    'Real-time academic progress tracking',
    'Automated attendance management',
    'Customizable grade book system',
    'Mobile-responsive design'
  ];

  const stats = [
    { number: '1000+', label: 'Schools Served' },
    { number: '50k+', label: 'Active Students' },
    { number: '5k+', label: 'Teachers' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section id="home" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary">
                  Modern School Management System
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Welcome to{' '}
                  <span className="text-primary">EduBeast</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Empower your educational institution with our comprehensive, 
                  modular school management platform designed for modern learning environments.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 transition-smooth shadow-medium hover:shadow-strong">
                  Get Started Today
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 transition-smooth">
                  Schedule Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-strong">
                <img 
                  src={heroImage} 
                  alt="EduBeast School Management System"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 hero-gradient opacity-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="text-primary">
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything You Need for Modern Education
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our modular platform adapts to your school's unique needs with 
              comprehensive tools for administration, teaching, and learning.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="card-gradient border-0 shadow-soft hover:shadow-medium transition-smooth group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                      <IconComponent className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary">
                  Why Choose EduBeast
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Transforming Education Management
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of educators who trust EduBeast to streamline 
                  their operations and enhance the learning experience.
                </p>
              </div>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="transition-smooth">
                Learn More About Our Features
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Role Access Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-sm text-blue-800">Teachers</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-blue-700">Grade management & lesson planning</p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-sm text-green-800">Students</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-green-700">Access courses & track progress</p>
                  </CardContent>
                </Card>
                
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      <CardTitle className="text-sm text-orange-800">Parents</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-orange-700">Monitor child's academic journey</p>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <CardTitle className="text-sm text-purple-800">Admin</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-purple-700">Complete school management control</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 hero-gradient">
        <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join the educational revolution with EduBeast. Get started today 
            and experience the difference modern school management can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduBeast</span>
          </div>
          <p className="text-background/70 mb-6">
            Empowering education through innovative school management solutions.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-background/70">
            <a href="#privacy" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-background transition-colors">Terms of Service</a>
            <a href="#contact" className="hover:text-background transition-colors">Contact Us</a>
          </div>
          <div className="mt-8 pt-8 border-t border-background/20 text-sm text-background/60">
            © 2024 EduBeast. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
