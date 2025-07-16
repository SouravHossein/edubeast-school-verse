import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const teacherSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  department: z.string().min(1, 'Department is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  experience: z.number().min(0, 'Experience must be positive'),
  salary: z.number().min(0, 'Salary must be positive'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  emergencyContact: z.string().min(10, 'Emergency contact is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
});

type TeacherForm = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  open: boolean;
  onClose: () => void;
  teacher?: any;
}

export const TeacherForm = ({ open, onClose, teacher }: TeacherFormProps) => {
  const [subjects, setSubjects] = React.useState<string[]>([]);
  const [newSubject, setNewSubject] = React.useState('');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<TeacherForm>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacher || {
      name: '',
      email: '',
      phone: '',
      department: '',
      qualification: '',
      experience: 0,
      salary: 0,
      address: '',
      emergencyContact: '',
      joiningDate: '',
    }
  });

  const addSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const onSubmit = (data: TeacherForm) => {
    console.log('Teacher data:', { ...data, subjects });
    // Handle form submission
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {teacher ? 'Edit Teacher' : 'Add New Teacher'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    {...register('address')}
                    placeholder="Enter full address"
                    rows={3}
                  />
                  {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    {...register('emergencyContact')}
                    placeholder="Enter emergency contact"
                  />
                  {errors.emergencyContact && <p className="text-sm text-red-600">{errors.emergencyContact.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select onValueChange={(value) => setValue('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="arts">Arts</SelectItem>
                      <SelectItem value="physical-education">Physical Education</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-red-600">{errors.department.message}</p>}
                </div>

                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    {...register('qualification')}
                    placeholder="Enter qualification (e.g., MSc Mathematics)"
                  />
                  {errors.qualification && <p className="text-sm text-red-600">{errors.qualification.message}</p>}
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    {...register('experience', { valueAsNumber: true })}
                    placeholder="Enter years of experience"
                  />
                  {errors.experience && <p className="text-sm text-red-600">{errors.experience.message}</p>}
                </div>

                <div>
                  <Label htmlFor="salary">Monthly Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    {...register('salary', { valueAsNumber: true })}
                    placeholder="Enter monthly salary"
                  />
                  {errors.salary && <p className="text-sm text-red-600">{errors.salary.message}</p>}
                </div>

                <div>
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    {...register('joiningDate')}
                  />
                  {errors.joiningDate && <p className="text-sm text-red-600">{errors.joiningDate.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Add subject"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                  />
                  <Button type="button" onClick={addSubject}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                      {subject}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSubject(subject)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Resume/CV</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload resume</p>
                  </div>
                </div>
                <div>
                  <Label>Certificates</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload certificates</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {teacher ? 'Update Teacher' : 'Add Teacher'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};