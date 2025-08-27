
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Student } from '@/hooks/useStudents';

interface Class {
  id: string;
  name: string;
  section?: string;
  grade_level: number;
}

interface StudentFormProps {
  student?: Student;
  classes: Class[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Student>) => Promise<void>;
  loading?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  student,
  classes,
  open,
  onOpenChange,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    student_id: student?.student_id || '',
    admission_number: student?.admission_number || '',
    roll_number: student?.roll_number || '',
    class_id: student?.class_id || '',
    admission_date: student?.admission_date || new Date().toISOString().split('T')[0],
    parent_name: student?.parent_name || '',
    parent_phone: student?.parent_phone || '',
    parent_email: student?.parent_email || '',
    emergency_contact: student?.emergency_contact || '',
    medical_info: student?.medical_info || '',
    fee_concession: student?.fee_concession || 0,
    status: student?.status || 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!student) {
      // Reset form for new student
      setFormData({
        student_id: '',
        admission_number: '',
        roll_number: '',
        class_id: '',
        admission_date: new Date().toISOString().split('T')[0],
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        emergency_contact: '',
        medical_info: '',
        fee_concession: 0,
        status: 'active'
      });
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Student ID *</Label>
              <Input
                id="student_id"
                value={formData.student_id}
                onChange={(e) => handleChange('student_id', e.target.value)}
                placeholder="Enter student ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admission_number">Admission Number *</Label>
              <Input
                id="admission_number"
                value={formData.admission_number}
                onChange={(e) => handleChange('admission_number', e.target.value)}
                placeholder="Enter admission number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roll_number">Roll Number</Label>
              <Input
                id="roll_number"
                value={formData.roll_number}
                onChange={(e) => handleChange('roll_number', e.target.value)}
                placeholder="Enter roll number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class_id">Class *</Label>
              <Select value={formData.class_id} onValueChange={(value) => handleChange('class_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} {cls.section && `- ${cls.section}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admission_date">Admission Date *</Label>
              <Input
                id="admission_date"
                type="date"
                value={formData.admission_date}
                onChange={(e) => handleChange('admission_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Parent Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent_name">Parent Name</Label>
                <Input
                  id="parent_name"
                  value={formData.parent_name}
                  onChange={(e) => handleChange('parent_name', e.target.value)}
                  placeholder="Enter parent name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_phone">Parent Phone</Label>
                <Input
                  id="parent_phone"
                  value={formData.parent_phone}
                  onChange={(e) => handleChange('parent_phone', e.target.value)}
                  placeholder="Enter parent phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_email">Parent Email</Label>
                <Input
                  id="parent_email"
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => handleChange('parent_email', e.target.value)}
                  placeholder="Enter parent email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) => handleChange('emergency_contact', e.target.value)}
                  placeholder="Enter emergency contact"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Additional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medical_info">Medical Information</Label>
                <Textarea
                  id="medical_info"
                  value={formData.medical_info}
                  onChange={(e) => handleChange('medical_info', e.target.value)}
                  placeholder="Any medical conditions or allergies"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee_concession">Fee Concession (%)</Label>
                <Input
                  id="fee_concession"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.fee_concession}
                  onChange={(e) => handleChange('fee_concession', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
