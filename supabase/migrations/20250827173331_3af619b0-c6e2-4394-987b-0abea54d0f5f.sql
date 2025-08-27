
-- Add missing tenant_id columns and improve the data model
ALTER TABLE students ADD COLUMN IF NOT EXISTS tenant_id uuid;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS tenant_id uuid;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_tenant_id ON students(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_tenant_id ON attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);

-- Update RLS policies for students table
DROP POLICY IF EXISTS "Students can view their own data" ON students;
DROP POLICY IF EXISTS "Only admins can manage students" ON students;

CREATE POLICY "Students viewable by tenant members" 
ON students FOR SELECT 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage students in their tenant" 
ON students FOR ALL 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- Update RLS policies for attendance table
DROP POLICY IF EXISTS "Only teachers can manage attendance" ON attendance;
DROP POLICY IF EXISTS "Users can view relevant attendance" ON attendance;

CREATE POLICY "Attendance viewable by tenant members" 
ON attendance FOR SELECT 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Teachers can manage attendance in their tenant" 
ON attendance FOR ALL 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('admin', 'teacher')
  )
);

-- Ensure classes table has proper RLS for students module
CREATE POLICY IF NOT EXISTS "Classes viewable by tenant members" 
ON classes FOR SELECT 
USING (
  tenant_id IN (
    SELECT profiles.tenant_id 
    FROM profiles 
    WHERE profiles.user_id = auth.uid()
  )
);

-- Add trigger to auto-set tenant_id for students
CREATE OR REPLACE FUNCTION set_student_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    SELECT tenant_id INTO NEW.tenant_id 
    FROM profiles 
    WHERE user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_set_student_tenant_id ON students;
CREATE TRIGGER trigger_set_student_tenant_id
  BEFORE INSERT ON students
  FOR EACH ROW
  EXECUTE FUNCTION set_student_tenant_id();

-- Add trigger to auto-set tenant_id for attendance
CREATE OR REPLACE FUNCTION set_attendance_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    SELECT tenant_id INTO NEW.tenant_id 
    FROM profiles 
    WHERE user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_set_attendance_tenant_id ON attendance;
CREATE TRIGGER trigger_set_attendance_tenant_id
  BEFORE INSERT ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION set_attendance_tenant_id();
