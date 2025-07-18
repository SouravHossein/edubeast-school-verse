import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Users, 
  BookOpen,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useApproval } from '@/contexts/ApprovalContext';
import { useNavigate } from 'react-router-dom';

export const ApplicationForm = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    qualifications: '',
    experience: '',
    subjects: [] as string[],
    classes: [] as string[],
    parentStudentId: '',
    additionalInfo: '',
  });

  const { submitApplication, isApplicationSubmitted } = useApproval();
  const navigate = useNavigate();

  const roleOptions = [
    {
      value: 'student',
      label: 'Student Admission',
      icon: BookOpen,
      description: 'Apply for student admission to join our academic programs',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'teacher',
      label: 'Teaching Position',
      icon: GraduationCap,
      description: 'Apply to join our faculty and educate the next generation',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: 'parent',
      label: 'Parent Account',
      icon: Users,
      description: 'Register as a parent to monitor your child\'s progress',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History',
    'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education'
  ];

  const classOptions = [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
    'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectToggle = (subject: string) => {
    const updatedSubjects = formData.subjects.includes(subject)
      ? formData.subjects.filter(s => s !== subject)
      : [...formData.subjects, subject];
    handleInputChange('subjects', updatedSubjects);
  };

  const handleClassToggle = (className: string) => {
    const updatedClasses = formData.classes.includes(className)
      ? formData.classes.filter(c => c !== className)
      : [...formData.classes, className];
    handleInputChange('classes', updatedClasses);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    // Check if application already exists
    if (isApplicationSubmitted(formData.email)) {
      return;
    }

    setIsSubmitting(true);

    const applicationData = {
      fullName: formData.fullName,
      email: formData.email,
      role: selectedRole,
      parentStudentId: selectedRole === 'parent' ? formData.parentStudentId : undefined,
      additionalInfo: {
        phone: formData.phone,
        address: formData.address,
        qualifications: selectedRole === 'teacher' ? formData.qualifications : undefined,
        experience: selectedRole === 'teacher' ? formData.experience : undefined,
        subjects: selectedRole === 'teacher' ? formData.subjects : undefined,
        classes: selectedRole === 'teacher' ? formData.classes : undefined,
      }
    };

    const success = await submitApplication(applicationData);
    
    if (success) {
      setIsSubmitted(true);
    }
    
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-green-700 mb-6">
                Thank you for your application. We have received your {selectedRole} application 
                and will review it shortly. You will receive an email notification once your 
                application has been processed.
              </p>
              <div className="space-y-4">
                <div className="text-sm text-green-600 bg-green-100 p-4 rounded-lg">
                  <strong>What happens next?</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Admin will review your application</li>
                    <li>You'll receive email notification upon approval</li>
                    <li>Login credentials will be provided</li>
                    <li>First login requires password change</li>
                  </ul>
                </div>
                <Button onClick={() => navigate('/')} className="w-full">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if email already has application
  const emailExists = formData.email && isApplicationSubmitted(formData.email);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Apply to EduBeast
          </h1>
          <p className="text-xl text-muted-foreground">
            Join our educational community as a student, teacher, or parent
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid md:grid-cols-3 gap-6">
            {roleOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Card 
                  key={option.value}
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary"
                  onClick={() => setSelectedRole(option.value as any)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full ${option.bgColor} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`w-8 h-8 ${option.color}`} />
                    </div>
                    <CardTitle className="text-xl">{option.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base">
                      {option.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center">
                    {(() => {
                      const option = roleOptions.find(o => o.value === selectedRole);
                      const IconComponent = option?.icon || User;
                      return (
                        <>
                          <IconComponent className="w-6 h-6 mr-2" />
                          {option?.label} Application
                        </>
                      );
                    })()}
                  </CardTitle>
                  <CardDescription>
                    Please fill out all required information below
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRole('')}
                >
                  Change Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                      {emailExists && (
                        <p className="text-sm text-red-600">
                          An application with this email already exists.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </div>

                {/* Role-specific fields */}
                {selectedRole === 'teacher' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Teaching Information
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Qualifications *</Label>
                      <Textarea
                        id="qualifications"
                        value={formData.qualifications}
                        onChange={(e) => handleInputChange('qualifications', e.target.value)}
                        placeholder="List your educational qualifications and certifications"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Teaching Experience</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="Describe your teaching experience"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Subjects You Can Teach *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {subjectOptions.map((subject) => (
                          <div key={subject} className="flex items-center space-x-2">
                            <Checkbox
                              id={subject}
                              checked={formData.subjects.includes(subject)}
                              onCheckedChange={() => handleSubjectToggle(subject)}
                            />
                            <Label htmlFor={subject} className="text-sm">
                              {subject}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preferred Classes</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {classOptions.map((className) => (
                          <div key={className} className="flex items-center space-x-2">
                            <Checkbox
                              id={className}
                              checked={formData.classes.includes(className)}
                              onCheckedChange={() => handleClassToggle(className)}
                            />
                            <Label htmlFor={className} className="text-sm">
                              {className}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === 'parent' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Student Information
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="parentStudentId">Student ID (if known)</Label>
                      <Input
                        id="parentStudentId"
                        value={formData.parentStudentId}
                        onChange={(e) => handleInputChange('parentStudentId', e.target.value)}
                        placeholder="Enter your child's student ID"
                      />
                      <p className="text-sm text-muted-foreground">
                        If your child is already enrolled, please provide their student ID. 
                        Otherwise, leave blank and admin will help link your account.
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Additional Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Comments</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      placeholder="Any additional information you'd like to share"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedRole('')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || emailExists || !formData.fullName || !formData.email}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};