import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  studentId?: string;
  feeStructureId?: string;
  subscriptionPlan?: string;
}

interface SSLCommerzButtonProps {
  paymentData: PaymentData;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const SSLCommerzButton = ({ 
  paymentData, 
  onSuccess, 
  onError, 
  className,
  children 
}: SSLCommerzButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Call Supabase edge function for SSLCommerz integration
      const { data, error } = await supabase.functions.invoke('sslcommerz-payment', {
        body: {
          ...paymentData,
          success_url: `${window.location.origin}/payment/success`,
          fail_url: `${window.location.origin}/payment/failed`,
          cancel_url: `${window.location.origin}/payment/cancelled`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.payment_url) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = data.payment_url;
      } else {
        throw new Error('Failed to initialize payment');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isProcessing}
      className={className}
    >
      {isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || `Pay ${paymentData.currency} ${paymentData.amount}`}
        </>
      )}
    </Button>
  );
};