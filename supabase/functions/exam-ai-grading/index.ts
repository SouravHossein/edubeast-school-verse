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

interface GradingRequest {
  answerId: string;
  questionText: string;
  studentAnswer: string;
  rubric?: any;
  maxMarks: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answerId, questionText, studentAnswer, rubric, maxMarks }: GradingRequest = await req.json();
    console.log('AI Grading request for answer:', answerId);

    // Check for OpenAI API key
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create grading prompt
    const gradingPrompt = `
You are an expert teacher grading a student's answer. Please evaluate the following:

Question: ${questionText}
Student Answer: ${studentAnswer}
Maximum Marks: ${maxMarks}
${rubric ? `Grading Rubric: ${JSON.stringify(rubric)}` : ''}

Please provide:
1. Marks awarded (out of ${maxMarks})
2. Brief feedback explaining the grade
3. Specific areas for improvement
4. Confidence level (0-100) in your assessment

Respond in JSON format:
{
  "marks": number,
  "feedback": "string",
  "improvements": ["string"],
  "confidence": number
}`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert teacher who grades student answers fairly and provides constructive feedback.'
          },
          {
            role: 'user',
            content: gradingPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    const aiGrading = JSON.parse(openaiData.choices[0].message.content);

    // Update student answer with AI grading
    const { error: updateError } = await supabase
      .from('student_answers')
      .update({
        marks_obtained: aiGrading.marks,
        grader_feedback: aiGrading.feedback,
        ai_grading_confidence: aiGrading.confidence,
        graded_at: new Date().toISOString(),
        auto_graded: true
      })
      .eq('id', answerId);

    if (updateError) {
      throw updateError;
    }

    // Log grading activity
    const { error: logError } = await supabase
      .from('integration_logs')
      .insert({
        integration_id: null,
        action: 'ai_grading_completed',
        payload: {
          answer_id: answerId,
          marks_awarded: aiGrading.marks,
          confidence: aiGrading.confidence
        },
        status: 'success'
      });

    if (logError) {
      console.warn('Failed to log AI grading:', logError);
    }

    console.log('AI grading completed for answer:', answerId);

    return new Response(JSON.stringify({
      success: true,
      grading: aiGrading
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI grading:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});