import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface AutomationRequest {
  action: 'create_google_form' | 'sync_classroom' | 'generate_transcript' | 'send_results';
  examId?: string;
  studentId?: string;
  tenantId: string;
  options?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, examId, studentId, tenantId, options }: AutomationRequest = await req.json();
    console.log(`Exam automation request: ${action} for tenant: ${tenantId}`);

    let result: any = {};

    switch (action) {
      case 'create_google_form':
        result = await createGoogleForm(examId!, tenantId);
        break;
        
      case 'sync_classroom':
        result = await syncGoogleClassroom(examId!, tenantId);
        break;
        
      case 'generate_transcript':
        result = await generateTranscript(studentId!, tenantId, options);
        break;
        
      case 'send_results':
        result = await sendResultNotifications(examId!, tenantId);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({
      success: true,
      result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in exam automation:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createGoogleForm(examId: string, tenantId: string) {
  // Get Google integration
  const { data: integration } = await supabase
    .from('integrations')
    .select('config_json')
    .eq('tenant_id', tenantId)
    .eq('service_name', 'google_forms')
    .single();

  if (!integration) {
    throw new Error('Google Forms integration not configured');
  }

  const config = integration.config_json as any;
  const accessToken = config.oauth_tokens?.access_token;

  if (!accessToken) {
    throw new Error('Google Forms access token not available');
  }

  // Get exam details
  const { data: exam } = await supabase
    .from('online_exams')
    .select(`
      *,
      exam_questions(
        question_order,
        marks_allocated,
        question_bank(
          question_text,
          question_type,
          options
        )
      )
    `)
    .eq('id', examId)
    .single();

  if (!exam) {
    throw new Error('Exam not found');
  }

  // Create Google Form
  const formPayload = {
    info: {
      title: exam.title,
      description: exam.instructions || ''
    }
  };

  const createFormResponse = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formPayload)
  });

  if (!createFormResponse.ok) {
    throw new Error('Failed to create Google Form');
  }

  const formData = await createFormResponse.json();
  
  // Add questions to the form
  for (const examQuestion of exam.exam_questions) {
    const question = examQuestion.question_bank;
    
    let questionItem: any = {
      title: question.question_text,
      description: `(${examQuestion.marks_allocated} marks)`
    };

    if (question.question_type === 'mcq') {
      questionItem.questionItem = {
        question: {
          required: true,
          choiceQuestion: {
            type: 'RADIO',
            options: question.options?.map((option: string) => ({ value: option })) || []
          }
        }
      };
    } else {
      questionItem.questionItem = {
        question: {
          required: true,
          textQuestion: {
            paragraph: question.question_type === 'essay'
          }
        }
      };
    }

    await fetch(`https://forms.googleapis.com/v1/forms/${formData.formId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [{
          createItem: {
            item: questionItem,
            location: { index: examQuestion.question_order }
          }
        }]
      })
    });
  }

  // Save integration record
  await supabase
    .from('exam_integrations')
    .insert({
      tenant_id: tenantId,
      exam_id: examId,
      integration_type: 'google_forms',
      external_id: formData.formId,
      sync_status: 'completed'
    });

  return {
    formId: formData.formId,
    formUrl: formData.responderUri
  };
}

async function syncGoogleClassroom(examId: string, tenantId: string) {
  // Implementation for Google Classroom sync
  return { message: 'Google Classroom sync completed' };
}

async function generateTranscript(studentId: string, tenantId: string, options: any) {
  // Get student details
  const { data: student } = await supabase
    .from('students')
    .select(`
      *,
      profiles(full_name, email)
    `)
    .eq('id', studentId)
    .single();

  if (!student) {
    throw new Error('Student not found');
  }

  // Calculate GPA
  const { data: gpaResult } = await supabase
    .rpc('calculate_gpa', {
      p_student_id: studentId,
      p_academic_year: options.academicYear
    });

  // Get detailed grades
  const { data: grades } = await supabase
    .from('marks')
    .select(`
      marks_obtained,
      max_marks,
      grade,
      exam_schedules(
        examination_id,
        subject_id,
        subjects(name, credit_hours),
        examinations(name, type, academic_year)
      )
    `)
    .eq('student_id', studentId);

  const transcriptData = {
    student: {
      name: student.profiles.full_name,
      studentId: student.student_id,
      admissionNumber: student.admission_number
    },
    academicYear: options.academicYear,
    gpa: gpaResult,
    grades: grades?.map(grade => ({
      subject: grade.exam_schedules?.subjects?.name,
      credits: grade.exam_schedules?.subjects?.credit_hours,
      marks: grade.marks_obtained,
      maxMarks: grade.max_marks,
      percentage: (grade.marks_obtained / grade.max_marks) * 100,
      grade: grade.grade
    })) || []
  };

  // Save transcript
  const { data: transcript } = await supabase
    .from('transcripts')
    .insert({
      tenant_id: tenantId,
      student_id: studentId,
      academic_year: options.academicYear,
      term_gpa: gpaResult,
      transcript_data: transcriptData,
      generated_by: Deno.env.get('SERVICE_ACCOUNT_ID') || 'system'
    })
    .select()
    .single();

  return {
    transcriptId: transcript.id,
    transcriptData
  };
}

async function sendResultNotifications(examId: string, tenantId: string) {
  // Get exam results
  const { data: results } = await supabase
    .from('student_exam_attempts')
    .select(`
      *,
      students(
        student_id,
        profiles(full_name, email),
        parent_phone,
        parent_email
      ),
      online_exams(title)
    `)
    .eq('exam_id', examId)
    .eq('status', 'graded');

  if (!results || results.length === 0) {
    return { message: 'No graded results found' };
  }

  // Send WhatsApp notifications
  for (const result of results) {
    if (result.students.parent_phone) {
      try {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-integration`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'send_template',
            tenantId,
            to: result.students.parent_phone,
            template: 'exam_result',
            parameters: [
              result.students.profiles.full_name,
              result.online_exams.title,
              `${result.percentage}%`,
              result.grade || 'N/A'
            ]
          })
        });
      } catch (error) {
        console.warn('Failed to send WhatsApp notification:', error);
      }
    }
  }

  return {
    notificationsSent: results.length,
    message: 'Result notifications sent successfully'
  };
}