
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Calendar, Clock, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  feeType: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  dueDate: string;
  paymentDate?: string;
  installments?: number;
  paidInstallments?: number;
  fineAmount?: number;
}

interface InstallmentPlan {
  id: string;
  name: string;
  installments: number;
  frequency: 'monthly' | 'quarterly';
  description: string;
}

export const PaymentSystem = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'John Doe',
      amount: 5000,
      feeType: 'Tuition Fee',
      status: 'pending',
      dueDate: '2024-01-15',
      installments: 3,
      paidInstallments: 1
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Jane Smith',
      amount: 1500,
      feeType: 'Transport Fee',
      status: 'overdue',
      dueDate: '2023-12-20',
      fineAmount: 150
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      amount: 2000,
      feeType: 'Library Fee',
      status: 'paid',
      dueDate: '2024-01-10',
      paymentDate: '2024-01-08'
    }
  ]);

  const [installmentPlans] = useState<InstallmentPlan[]>([
    {
      id: '1',
      name: 'Quarterly Plan',
      installments: 4,
      frequency: 'quarterly',
      description: 'Pay in 4 quarterly installments'
    },
    {
      id: '2',
      name: 'Monthly Plan',
      installments: 12,
      frequency: 'monthly',
      description: 'Pay in 12 monthly installments'
    }
  ]);

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePayment = async (paymentId: string, amount: number) => {
    try {
      // Simulate SSL Commerz payment integration
      toast({
        title: "Processing Payment",
        description: "Redirecting to SSL Commerz payment gateway...",
      });

      // Simulate payment processing
      setTimeout(() => {
        setPayments(payments.map(payment => 
          payment.id === paymentId 
            ? { 
                ...payment, 
                status: 'paid' as const, 
                paymentDate: new Date().toISOString().split('T')[0]
              }
            : payment
        ));
        
        toast({
          title: "Payment Successful",
          description: `Payment of ₹${amount} has been processed successfully.`,
        });
        
        setShowPaymentDialog(false);
        setSelectedPayment(null);
        setPaymentAmount('');
      }, 2000);

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateFine = (dueDate: string): number => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 0) {
      return Math.min(daysDiff * 10, 500); // ₹10 per day, max ₹500
    }
    return 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      case 'partial': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'partial': return <DollarSign className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8,650</div>
            <p className="text-xs text-muted-foreground">
              +₹150 in fines
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,000</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,650</div>
            <p className="text-xs text-muted-foreground">
              3 students
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              This quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Records */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>
            Manage student fee payments and track due amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fine</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const fine = payment.status === 'overdue' ? (payment.fineAmount || calculateFine(payment.dueDate)) : 0;
                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.studentName}</div>
                        <div className="text-sm text-muted-foreground">{payment.studentId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payment.feeType}</TableCell>
                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(payment.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </Badge>
                      {payment.installments && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {payment.paidInstallments}/{payment.installments} installments
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {fine > 0 && (
                        <Badge variant="destructive">₹{fine}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.status !== 'paid' && (
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setPaymentAmount((payment.amount + fine).toString());
                              setShowPaymentDialog(true);
                            }}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Installment Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Installment Plans</CardTitle>
          <CardDescription>
            Available payment plans for fee installments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {installmentPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Installments:</span>
                      <span className="font-medium">{plan.installments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="font-medium capitalize">{plan.frequency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Complete payment for {selectedPayment?.studentName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Fee Type</Label>
              <Input value={selectedPayment?.feeType || ''} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <Select onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sslcommerz">SSL Commerz</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedPayment && handlePayment(selectedPayment.id, parseFloat(paymentAmount))}
              disabled={!paymentAmount || !paymentMethod}
            >
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
