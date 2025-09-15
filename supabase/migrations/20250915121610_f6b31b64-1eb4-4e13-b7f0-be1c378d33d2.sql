-- Enhanced Exam & Grading Module - Question Bank and GPA System

-- Create question_bank table for storing reusable questions
CREATE TABLE public.question_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  subject_id UUID,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'short_answer', 'essay', 'coding', 'true_false', 'fill_blank')),
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  bloom_taxonomy TEXT CHECK (bloom_taxonomy IN ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create')),
  marks NUMERIC NOT NULL DEFAULT 1,
  options JSONB, -- For MCQ options
  correct_answer TEXT,
  explanation TEXT,
  tags TEXT[],
  past_usage_count INTEGER DEFAULT 0,
  ai_generated BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create exam_templates table for reusable exam structures
CREATE TABLE public.exam_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  subject_id UUID,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  total_marks NUMERIC NOT NULL,
  passing_marks NUMERIC,
  question_selection_strategy JSONB DEFAULT '{}', -- auto, manual, difficulty-based
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create online_exams table for digital exam instances
CREATE TABLE public.online_exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  exam_schedule_id UUID,
  exam_template_id UUID,
  title TEXT NOT NULL,
  instructions TEXT,
  randomize_questions BOOLEAN DEFAULT true,
  randomize_options BOOLEAN DEFAULT true,
  anti_cheating_settings JSONB DEFAULT '{}',
  proctoring_enabled BOOLEAN DEFAULT false,
  auto_submit BOOLEAN DEFAULT true,
  question_navigation TEXT DEFAULT 'linear' CHECK (question_navigation IN ('linear', 'non_linear')),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create exam_questions table linking exams to questions
CREATE TABLE public.exam_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL,
  question_id UUID NOT NULL,
  question_order INTEGER NOT NULL,
  marks_allocated NUMERIC NOT NULL,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_exam_attempts table for tracking attempts
CREATE TABLE public.student_exam_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  exam_id UUID NOT NULL,
  student_id UUID NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  time_taken_minutes INTEGER,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'auto_submitted', 'graded')),
  total_marks_obtained NUMERIC,
  percentage NUMERIC,
  grade TEXT,
  proctoring_data JSONB DEFAULT '{}',
  ip_address INET,
  browser_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_answers table for storing individual answers
CREATE TABLE public.student_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL,
  question_id UUID NOT NULL,
  answer_text TEXT,
  answer_options TEXT[], -- For MCQ selections
  marks_obtained NUMERIC DEFAULT 0,
  marks_allocated NUMERIC NOT NULL,
  auto_graded BOOLEAN DEFAULT false,
  graded_by UUID,
  grader_feedback TEXT,
  ai_grading_confidence NUMERIC,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  graded_at TIMESTAMP WITH TIME ZONE
);

-- Create grading_rubrics table for essay/subjective grading
CREATE TABLE public.grading_rubrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  question_id UUID,
  subject_id UUID,
  criteria_name TEXT NOT NULL,
  criteria_description TEXT,
  max_points NUMERIC NOT NULL,
  point_scale JSONB, -- {"excellent": 4, "good": 3, "fair": 2, "poor": 1}
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create gpa_scales table for different grading systems
CREATE TABLE public.gpa_scales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  scale_name TEXT NOT NULL,
  scale_type TEXT DEFAULT '4.0' CHECK (scale_type IN ('4.0', '10.0', 'percentage', 'letter')),
  grade_ranges JSONB NOT NULL, -- {"A+": {"min": 90, "max": 100, "gpa": 4.0}, ...}
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transcripts table for official records
CREATE TABLE public.transcripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  student_id UUID NOT NULL,
  academic_year TEXT NOT NULL,
  term TEXT,
  cumulative_gpa NUMERIC,
  term_gpa NUMERIC,
  total_credits NUMERIC,
  credits_earned NUMERIC,
  class_rank INTEGER,
  total_students INTEGER,
  transcript_data JSONB NOT NULL, -- Detailed grades per subject
  generated_by UUID NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  digitally_signed BOOLEAN DEFAULT false,
  signature_hash TEXT,
  drive_file_id TEXT, -- Google Drive storage
  pdf_url TEXT
);

-- Create exam_integrations table for Google/external integrations
CREATE TABLE public.exam_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  exam_id UUID,
  integration_type TEXT NOT NULL, -- 'google_forms', 'google_classroom', 'google_meet'
  external_id TEXT, -- External resource ID
  sync_settings JSONB DEFAULT '{}',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_question_bank_tenant_subject ON public.question_bank(tenant_id, subject_id);
CREATE INDEX idx_question_bank_tags ON public.question_bank USING GIN(tags);
CREATE INDEX idx_student_exam_attempts_student_exam ON public.student_exam_attempts(student_id, exam_id);
CREATE INDEX idx_student_answers_attempt ON public.student_answers(attempt_id);
CREATE INDEX idx_transcripts_student_year ON public.transcripts(student_id, academic_year);

-- Add foreign key constraints
ALTER TABLE public.question_bank ADD FOREIGN KEY (subject_id) REFERENCES public.subjects(id);
ALTER TABLE public.exam_templates ADD FOREIGN KEY (subject_id) REFERENCES public.subjects(id);
ALTER TABLE public.online_exams ADD FOREIGN KEY (exam_template_id) REFERENCES public.exam_templates(id);
ALTER TABLE public.exam_questions ADD FOREIGN KEY (exam_id) REFERENCES public.online_exams(id);
ALTER TABLE public.exam_questions ADD FOREIGN KEY (question_id) REFERENCES public.question_bank(id);
ALTER TABLE public.student_exam_attempts ADD FOREIGN KEY (exam_id) REFERENCES public.online_exams(id);
ALTER TABLE public.student_exam_attempts ADD FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.student_answers ADD FOREIGN KEY (attempt_id) REFERENCES public.student_exam_attempts(id);
ALTER TABLE public.student_answers ADD FOREIGN KEY (question_id) REFERENCES public.question_bank(id);
ALTER TABLE public.grading_rubrics ADD FOREIGN KEY (question_id) REFERENCES public.question_bank(id);
ALTER TABLE public.grading_rubrics ADD FOREIGN KEY (subject_id) REFERENCES public.subjects(id);
ALTER TABLE public.transcripts ADD FOREIGN KEY (student_id) REFERENCES public.students(id);
ALTER TABLE public.exam_integrations ADD FOREIGN KEY (exam_id) REFERENCES public.online_exams(id);

-- Enable RLS
ALTER TABLE public.question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grading_rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gpa_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Question Bank - Teachers can manage, students can view published
CREATE POLICY "Teachers can manage question bank" ON public.question_bank
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Question bank viewable by tenant members" ON public.question_bank
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Exam Templates - Teachers can manage
CREATE POLICY "Teachers can manage exam templates" ON public.exam_templates
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Online Exams - Teachers can manage, students can view published
CREATE POLICY "Teachers can manage online exams" ON public.online_exams
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Students can view published exams" ON public.online_exams
  FOR SELECT USING (
    published = true AND tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Student Exam Attempts - Students can manage own attempts, teachers can view all
CREATE POLICY "Students can manage own exam attempts" ON public.student_exam_attempts
  FOR ALL USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    ) OR tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Student Answers - Students can manage own answers, teachers can view/grade
CREATE POLICY "Students can manage own answers" ON public.student_answers
  FOR ALL USING (
    attempt_id IN (
      SELECT id FROM student_exam_attempts 
      WHERE student_id IN (
        SELECT id FROM students WHERE user_id = auth.uid()
      )
    ) OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Transcripts - Students can view own, teachers/admins can manage
CREATE POLICY "Students can view own transcripts" ON public.transcripts
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students WHERE user_id = auth.uid()
    ) OR tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Teachers can manage transcripts" ON public.transcripts
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- GPA Scales - Admins can manage, everyone can view
CREATE POLICY "Admins can manage GPA scales" ON public.gpa_scales
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "GPA scales viewable by tenant members" ON public.gpa_scales
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_question_bank_updated_at
  BEFORE UPDATE ON public.question_bank
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exam_templates_updated_at
  BEFORE UPDATE ON public.exam_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_online_exams_updated_at
  BEFORE UPDATE ON public.online_exams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_exam_attempts_updated_at
  BEFORE UPDATE ON public.student_exam_attempts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate GPA
CREATE OR REPLACE FUNCTION public.calculate_gpa(
  p_student_id UUID,
  p_academic_year TEXT,
  p_term TEXT DEFAULT NULL
) 
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_quality_points NUMERIC := 0;
  total_credits NUMERIC := 0;
  calculated_gpa NUMERIC;
  grade_record RECORD;
BEGIN
  -- Calculate GPA based on marks and credits
  FOR grade_record IN
    SELECT 
      m.marks_obtained,
      m.max_marks,
      s.credit_hours,
      gs.grade_ranges
    FROM marks m
    JOIN exam_schedules es ON m.exam_schedule_id = es.id
    JOIN examinations e ON es.examination_id = e.id
    JOIN subjects s ON es.subject_id = s.id
    JOIN gpa_scales gs ON gs.tenant_id = (SELECT tenant_id FROM students WHERE id = p_student_id)
    WHERE m.student_id = p_student_id
      AND e.academic_year = p_academic_year
      AND (p_term IS NULL OR e.type = p_term)
      AND gs.is_default = true
  LOOP
    -- Calculate percentage
    DECLARE
      percentage NUMERIC := (grade_record.marks_obtained / grade_record.max_marks) * 100;
      grade_info JSONB;
      gpa_points NUMERIC;
    BEGIN
      -- Find appropriate grade
      FOR grade_info IN
        SELECT value FROM jsonb_each(grade_record.grade_ranges)
      LOOP
        IF percentage >= (grade_info->>'min')::NUMERIC AND 
           percentage <= (grade_info->>'max')::NUMERIC THEN
          gpa_points := (grade_info->>'gpa')::NUMERIC;
          total_quality_points := total_quality_points + (gpa_points * grade_record.credit_hours);
          total_credits := total_credits + grade_record.credit_hours;
          EXIT;
        END IF;
      END LOOP;
    END;
  END LOOP;
  
  IF total_credits > 0 THEN
    calculated_gpa := total_quality_points / total_credits;
  ELSE
    calculated_gpa := 0;
  END IF;
  
  RETURN ROUND(calculated_gpa, 2);
END;
$$;

-- Function to auto-grade MCQ answers
CREATE OR REPLACE FUNCTION public.auto_grade_mcq_answer()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  correct_answer TEXT;
  question_marks NUMERIC;
BEGIN
  -- Get correct answer and marks for the question
  SELECT qb.correct_answer, eq.marks_allocated
  INTO correct_answer, question_marks
  FROM question_bank qb
  JOIN exam_questions eq ON qb.id = eq.question_id
  WHERE qb.id = NEW.question_id
    AND qb.question_type = 'mcq';
  
  -- Auto-grade if it's an MCQ
  IF correct_answer IS NOT NULL THEN
    IF NEW.answer_text = correct_answer THEN
      NEW.marks_obtained := question_marks;
    ELSE
      NEW.marks_obtained := 0;
    END IF;
    NEW.auto_graded := true;
    NEW.graded_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for auto-grading MCQs
CREATE TRIGGER auto_grade_mcq_trigger
  BEFORE INSERT OR UPDATE ON public.student_answers
  FOR EACH ROW EXECUTE FUNCTION public.auto_grade_mcq_answer();

-- Insert default GPA scale
INSERT INTO public.gpa_scales (tenant_id, scale_name, scale_type, grade_ranges, is_default) VALUES
  (
    '00000000-0000-0000-0000-000000000000'::UUID, -- Default tenant
    'Standard 4.0 Scale',
    '4.0',
    '{
      "A+": {"min": 97, "max": 100, "gpa": 4.0},
      "A": {"min": 93, "max": 96, "gpa": 4.0},
      "A-": {"min": 90, "max": 92, "gpa": 3.7},
      "B+": {"min": 87, "max": 89, "gpa": 3.3},
      "B": {"min": 83, "max": 86, "gpa": 3.0},
      "B-": {"min": 80, "max": 82, "gpa": 2.7},
      "C+": {"min": 77, "max": 79, "gpa": 2.3},
      "C": {"min": 73, "max": 76, "gpa": 2.0},
      "C-": {"min": 70, "max": 72, "gpa": 1.7},
      "D+": {"min": 67, "max": 69, "gpa": 1.3},
      "D": {"min": 65, "max": 66, "gpa": 1.0},
      "F": {"min": 0, "max": 64, "gpa": 0.0}
    }'::jsonb,
    true
  );