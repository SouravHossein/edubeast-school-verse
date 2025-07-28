-- Complete School Management System Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')),
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Schools/Institutions table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  academic_year_start DATE,
  academic_year_end DATE,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  grade_level INTEGER NOT NULL,
  section TEXT,
  capacity INTEGER DEFAULT 30,
  academic_year TEXT NOT NULL,
  class_teacher_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  credit_hours INTEGER DEFAULT 1,
  is_mandatory BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  student_id TEXT UNIQUE NOT NULL,
  admission_number TEXT UNIQUE NOT NULL,
  class_id UUID NOT NULL,
  roll_number TEXT,
  admission_date DATE NOT NULL,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  emergency_contact TEXT,
  medical_info TEXT,
  transport_info JSONB DEFAULT '{}',
  fee_concession DECIMAL(5,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  department TEXT,
  qualification TEXT,
  experience_years INTEGER DEFAULT 0,
  joining_date DATE NOT NULL,
  salary DECIMAL(10,2),
  bank_account TEXT,
  emergency_contact TEXT,
  subjects TEXT[],
  is_class_teacher BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Class Subject Assignments
CREATE TABLE public.class_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  periods_per_week INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(class_id, subject_id)
);

-- Timetable table
CREATE TABLE public.timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  period_number INTEGER NOT NULL,
  subject_id UUID NOT NULL,
  teacher_id UUID NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(class_id, day_of_week, period_number)
);

-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  class_id UUID NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  check_in_time TIME,
  check_out_time TIME,
  remarks TEXT,
  marked_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Staff Attendance table
CREATE TABLE public.staff_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'on_leave')),
  check_in_time TIME,
  check_out_time TIME,
  working_hours DECIMAL(4,2),
  remarks TEXT,
  marked_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(teacher_id, date)
);

-- Leave Applications table
CREATE TABLE public.leave_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL,
  leave_type TEXT NOT NULL CHECK (leave_type IN ('sick', 'casual', 'annual', 'maternity', 'emergency')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Examinations table
CREATE TABLE public.examinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('unit_test', 'mid_term', 'final', 'board_exam')),
  academic_year TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Exam Schedules table
CREATE TABLE public.exam_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  examination_id UUID NOT NULL,
  class_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  max_marks INTEGER NOT NULL,
  room_number TEXT,
  invigilator_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Marks Entry table
CREATE TABLE public.marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_schedule_id UUID NOT NULL,
  student_id UUID NOT NULL,
  marks_obtained DECIMAL(5,2) NOT NULL,
  max_marks DECIMAL(5,2) NOT NULL,
  grade TEXT,
  remarks TEXT,
  entered_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(exam_schedule_id, student_id)
);

-- Fee Structure table
CREATE TABLE public.fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_id UUID NOT NULL,
  academic_year TEXT NOT NULL,
  tuition_fee DECIMAL(10,2) DEFAULT 0,
  transport_fee DECIMAL(10,2) DEFAULT 0,
  library_fee DECIMAL(10,2) DEFAULT 0,
  lab_fee DECIMAL(10,2) DEFAULT 0,
  sports_fee DECIMAL(10,2) DEFAULT 0,
  other_fees JSONB DEFAULT '{}',
  total_amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  late_fee_rate DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fee Payments table
CREATE TABLE public.fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  fee_structure_id UUID NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'cheque', 'online')),
  transaction_id TEXT,
  receipt_number TEXT UNIQUE NOT NULL,
  late_fee DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  remarks TEXT,
  collected_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('general', 'urgent', 'event', 'holiday', 'exam')),
  target_audience TEXT[] NOT NULL, -- ['all', 'students', 'teachers', 'parents', 'class_id']
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE,
  expire_date TIMESTAMP WITH TIME ZONE,
  attachments TEXT[],
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Messages table (for internal communication)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_important BOOLEAN DEFAULT false,
  attachments TEXT[],
  reply_to UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Approval Requests table
CREATE TABLE public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('registration', 'role_change', 'data_update')),
  request_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_role TEXT,
  justification TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Gallery/Events table
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('events', 'achievements', 'facilities', 'activities')),
  event_date DATE,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_user_id 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.classes ADD CONSTRAINT fk_classes_teacher 
  FOREIGN KEY (class_teacher_id) REFERENCES public.teachers(id);

ALTER TABLE public.students ADD CONSTRAINT fk_students_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.students ADD CONSTRAINT fk_students_class 
  FOREIGN KEY (class_id) REFERENCES public.classes(id);

ALTER TABLE public.teachers ADD CONSTRAINT fk_teachers_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.class_subjects ADD CONSTRAINT fk_class_subjects_class 
  FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
ALTER TABLE public.class_subjects ADD CONSTRAINT fk_class_subjects_subject 
  FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
ALTER TABLE public.class_subjects ADD CONSTRAINT fk_class_subjects_teacher 
  FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

ALTER TABLE public.timetables ADD CONSTRAINT fk_timetables_class 
  FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
ALTER TABLE public.timetables ADD CONSTRAINT fk_timetables_subject 
  FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
ALTER TABLE public.timetables ADD CONSTRAINT fk_timetables_teacher 
  FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

ALTER TABLE public.attendance ADD CONSTRAINT fk_attendance_student 
  FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;
ALTER TABLE public.attendance ADD CONSTRAINT fk_attendance_class 
  FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
ALTER TABLE public.attendance ADD CONSTRAINT fk_attendance_marked_by 
  FOREIGN KEY (marked_by) REFERENCES public.teachers(id);

ALTER TABLE public.staff_attendance ADD CONSTRAINT fk_staff_attendance_teacher 
  FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;
ALTER TABLE public.staff_attendance ADD CONSTRAINT fk_staff_attendance_marked_by 
  FOREIGN KEY (marked_by) REFERENCES public.teachers(id);

ALTER TABLE public.leave_applications ADD CONSTRAINT fk_leave_applications_applicant 
  FOREIGN KEY (applicant_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.leave_applications ADD CONSTRAINT fk_leave_applications_approved_by 
  FOREIGN KEY (approved_by) REFERENCES public.profiles(id);

ALTER TABLE public.exam_schedules ADD CONSTRAINT fk_exam_schedules_examination 
  FOREIGN KEY (examination_id) REFERENCES public.examinations(id) ON DELETE CASCADE;
ALTER TABLE public.exam_schedules ADD CONSTRAINT fk_exam_schedules_class 
  FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;
ALTER TABLE public.exam_schedules ADD CONSTRAINT fk_exam_schedules_subject 
  FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;
ALTER TABLE public.exam_schedules ADD CONSTRAINT fk_exam_schedules_invigilator 
  FOREIGN KEY (invigilator_id) REFERENCES public.teachers(id);

ALTER TABLE public.marks ADD CONSTRAINT fk_marks_exam_schedule 
  FOREIGN KEY (exam_schedule_id) REFERENCES public.exam_schedules(id) ON DELETE CASCADE;
ALTER TABLE public.marks ADD CONSTRAINT fk_marks_student 
  FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;
ALTER TABLE public.marks ADD CONSTRAINT fk_marks_entered_by 
  FOREIGN KEY (entered_by) REFERENCES public.teachers(id);

ALTER TABLE public.fee_structures ADD CONSTRAINT fk_fee_structures_class 
  FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;

ALTER TABLE public.fee_payments ADD CONSTRAINT fk_fee_payments_student 
  FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;
ALTER TABLE public.fee_payments ADD CONSTRAINT fk_fee_payments_fee_structure 
  FOREIGN KEY (fee_structure_id) REFERENCES public.fee_structures(id) ON DELETE CASCADE;
ALTER TABLE public.fee_payments ADD CONSTRAINT fk_fee_payments_collected_by 
  FOREIGN KEY (collected_by) REFERENCES public.profiles(id);

ALTER TABLE public.announcements ADD CONSTRAINT fk_announcements_created_by 
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages ADD CONSTRAINT fk_messages_sender 
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD CONSTRAINT fk_messages_recipient 
  FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.messages ADD CONSTRAINT fk_messages_reply_to 
  FOREIGN KEY (reply_to) REFERENCES public.messages(id) ON DELETE SET NULL;

ALTER TABLE public.approval_requests ADD CONSTRAINT fk_approval_requests_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.approval_requests ADD CONSTRAINT fk_approval_requests_reviewed_by 
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id);

ALTER TABLE public.gallery_items ADD CONSTRAINT fk_gallery_items_uploaded_by 
  FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_students_class_id ON public.students(class_id);
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_teachers_employee_id ON public.teachers(employee_id);
CREATE INDEX idx_attendance_student_date ON public.attendance(student_id, date);
CREATE INDEX idx_attendance_class_date ON public.attendance(class_id, date);
CREATE INDEX idx_marks_student_exam ON public.marks(student_id, exam_schedule_id);
CREATE INDEX idx_fee_payments_student ON public.fee_payments(student_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id, is_read);
CREATE INDEX idx_announcements_published ON public.announcements(is_published, publish_date);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid infinite recursion in RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE
SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE
SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE
SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- RLS Policies for schools
CREATE POLICY "Schools are viewable by everyone" ON public.schools
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage schools" ON public.schools
  FOR ALL USING (public.is_admin());

-- RLS Policies for classes
CREATE POLICY "Classes are viewable by authenticated users" ON public.classes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins and teachers can manage classes" ON public.classes
  FOR ALL USING (public.is_teacher());

-- RLS Policies for subjects
CREATE POLICY "Subjects are viewable by authenticated users" ON public.subjects
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage subjects" ON public.subjects
  FOR ALL USING (public.is_admin());

-- RLS Policies for students
CREATE POLICY "Students can view their own data" ON public.students
  FOR SELECT USING (
    auth.uid() = user_id OR 
    public.is_teacher() OR
    public.get_current_user_role() = 'parent'
  );

CREATE POLICY "Only admins can manage students" ON public.students
  FOR ALL USING (public.is_admin());

-- RLS Policies for teachers
CREATE POLICY "Teachers data is viewable by authenticated users" ON public.teachers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers can update their own data" ON public.teachers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage teachers" ON public.teachers
  FOR ALL USING (public.is_admin());

-- RLS Policies for attendance
CREATE POLICY "Users can view relevant attendance" ON public.attendance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.students WHERE id = attendance.student_id AND user_id = auth.uid()) OR
    public.is_teacher()
  );

CREATE POLICY "Only teachers can manage attendance" ON public.attendance
  FOR ALL USING (public.is_teacher());

-- RLS Policies for staff attendance
CREATE POLICY "Staff can view their own attendance" ON public.staff_attendance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.teachers WHERE id = staff_attendance.teacher_id AND user_id = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "Only admins can manage staff attendance" ON public.staff_attendance
  FOR ALL USING (public.is_admin());

-- RLS Policies for examinations
CREATE POLICY "Examinations are viewable by authenticated users" ON public.examinations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage examinations" ON public.examinations
  FOR ALL USING (public.is_admin());

-- RLS Policies for marks
CREATE POLICY "Users can view relevant marks" ON public.marks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.students WHERE id = marks.student_id AND user_id = auth.uid()) OR
    public.is_teacher()
  );

CREATE POLICY "Only teachers can manage marks" ON public.marks
  FOR ALL USING (public.is_teacher());

-- RLS Policies for announcements
CREATE POLICY "Published announcements are viewable by everyone" ON public.announcements
  FOR SELECT USING (is_published = true OR public.is_teacher());

CREATE POLICY "Only admins and teachers can manage announcements" ON public.announcements
  FOR ALL USING (public.is_teacher());

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their sent messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

-- RLS Policies for approval requests
CREATE POLICY "Users can view their own approval requests" ON public.approval_requests
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create approval requests" ON public.approval_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Only admins can manage approval requests" ON public.approval_requests
  FOR ALL USING (public.is_admin());

-- RLS Policies for gallery
CREATE POLICY "Gallery items are viewable by everyone" ON public.gallery_items
  FOR SELECT USING (is_published = true OR public.is_teacher());

CREATE POLICY "Only teachers can manage gallery" ON public.gallery_items
  FOR ALL USING (public.is_teacher());

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_attendance_updated_at
  BEFORE UPDATE ON public.staff_attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_applications_updated_at
  BEFORE UPDATE ON public.leave_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_examinations_updated_at
  BEFORE UPDATE ON public.examinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exam_schedules_updated_at
  BEFORE UPDATE ON public.exam_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marks_updated_at
  BEFORE UPDATE ON public.marks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_structures_updated_at
  BEFORE UPDATE ON public.fee_structures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at
  BEFORE UPDATE ON public.fee_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_approval_requests_updated_at
  BEFORE UPDATE ON public.approval_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.schools (name, code, address, phone, email, academic_year_start, academic_year_end) VALUES
('Greenwood High School', 'GHS001', '123 Education Street, Learning City', '+1-555-0123', 'info@greenwood.edu', '2024-04-01', '2025-03-31');

INSERT INTO public.subjects (name, code, description, credit_hours, is_mandatory) VALUES
('Mathematics', 'MATH101', 'Basic Mathematics', 6, true),
('English', 'ENG101', 'English Language and Literature', 5, true),
('Science', 'SCI101', 'General Science', 5, true),
('Social Studies', 'SOC101', 'Social Studies and History', 4, true),
('Computer Science', 'CS101', 'Introduction to Computer Science', 3, false),
('Physical Education', 'PE101', 'Physical Education and Sports', 2, true),
('Art', 'ART101', 'Visual Arts and Crafts', 2, false),
('Music', 'MUS101', 'Music and Performance', 2, false);

INSERT INTO public.classes (name, code, grade_level, section, capacity, academic_year) VALUES
('Grade 1 A', 'G1A', 1, 'A', 25, '2024-25'),
('Grade 1 B', 'G1B', 1, 'B', 25, '2024-25'),
('Grade 2 A', 'G2A', 2, 'A', 30, '2024-25'),
('Grade 3 A', 'G3A', 3, 'A', 30, '2024-25'),
('Grade 4 A', 'G4A', 4, 'A', 35, '2024-25'),
('Grade 5 A', 'G5A', 5, 'A', 35, '2024-25');

INSERT INTO public.examinations (name, type, academic_year, start_date, end_date) VALUES
('First Term Examination', 'mid_term', '2024-25', '2024-09-15', '2024-09-25'),
('Second Term Examination', 'mid_term', '2024-25', '2024-12-15', '2024-12-25'),
('Final Examination', 'final', '2024-25', '2025-03-15', '2025-03-25');

-- Insert sample fee structures
INSERT INTO public.fee_structures (name, class_id, academic_year, tuition_fee, transport_fee, library_fee, lab_fee, sports_fee, total_amount, due_date) 
SELECT 
  'Standard Fee Structure ' || name,
  id,
  '2024-25',
  CASE 
    WHEN grade_level <= 2 THEN 15000
    WHEN grade_level <= 5 THEN 18000
    ELSE 20000
  END,
  3000,
  500,
  800,
  700,
  CASE 
    WHEN grade_level <= 2 THEN 20000
    WHEN grade_level <= 5 THEN 23000
    ELSE 25000
  END,
  '2024-05-31'
FROM public.classes;