import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SSLCOMMERZ_STORE_ID = Deno.env.get('SSLCOMMERZ_STORE_ID');
const SSLCOMMERZ_STORE_PASSWORD = Deno.env.get('SSLCOMMERZ_STORE_PASSWORD');
const SSLCOMMERZ_ENDPOINT = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'; // Use production URL for live

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  studentId?: string;
  feeStructureId?: string;
  subscriptionPlan?: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      amount,
      currency,
      description,
      studentId,
      feeStructureId,
      subscriptionPlan,
      success_url,
      fail_url,
      cancel_url,
    }: PaymentRequest = await req.json();

    // Generate unique transaction ID
    const tran_id = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (!SSLCOMMERZ_STORE_ID || !SSLCOMMERZ_STORE_PASSWORD) {
      throw new Error('SSLCommerz credentials not configured');
    }

    // Prepare SSLCommerz payment data
    const paymentData = {
      store_id: SSLCOMMERZ_STORE_ID!,
      store_passwd: SSLCOMMERZ_STORE_PASSWORD!,
      total_amount: amount,
      currency: currency || 'BDT',
      tran_id,
      success_url,
      fail_url,
      cancel_url,
      ipn_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/sslcommerz-webhook`,
      
      // Product information
      product_name: description,
      product_category: subscriptionPlan ? 'Subscription' : 'Fee Payment',
      product_profile: 'general',
      
      // Customer information (basic)
      cus_name: 'Student/Parent',
      cus_email: 'customer@example.com',
      cus_add1: 'Address',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: '01700000000',
      
      // Additional parameters
      value_a: studentId || '',
      value_b: feeStructureId || '',
      value_c: subscriptionPlan || '',
      
      // Shipping information
      shipping_method: 'NO',
      num_of_item: 1,
    };

    // Make request to SSLCommerz
    const response = await fetch(SSLCOMMERZ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(Object.fromEntries(
        Object.entries(paymentData).map(([key, value]) => [key, String(value)])
      )).toString(),
    });

    const result = await response.json();

    if (result.status === 'SUCCESS') {
      return new Response(
        JSON.stringify({
          success: true,
          payment_url: result.GatewayPageURL,
          session_key: result.sessionkey,
          transaction_id: tran_id,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } else {
      throw new Error(result.failedreason || 'Payment initialization failed');
    }

  } catch (error: any) {
    console.error('SSLCommerz payment error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Payment initialization failed',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});