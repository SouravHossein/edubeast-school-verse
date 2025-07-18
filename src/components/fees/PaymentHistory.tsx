
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Filter, Receipt, Eye } from 'lucide-react';

interface PaymentRecord {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  amount: number;
  feeType: string;
  paymentMethod: string;
  paymentDate: string;
  status: 'completed' | 'failed' | 'refunded';
  receiptNumber: string;
}

export const PaymentHistory = () => {
  const [paymentHistory] = useState<PaymentRecord[]>([
    {
      id: '1',
      transactionId: 'TXN001234567',
      studentId: 'STU001',
      studentName: 'John Doe',
      amount: 5000,
      feeType: 'Tuition Fee',
      paymentMethod: 'SSL Commerz',
      paymentDate: '2024-01-08',
      status: 'completed',
      receiptNumber: 'RCP001'
    },
    {
      id: '2',
      transactionId: 'TXN001234568',
      studentId: 'STU002',
      studentName: 'Jane Smith',
      amount: 1500,
      feeType: 'Transport Fee',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2024-01-07',
      status: 'completed',
      receiptNumber: 'RCP002'
    },
    {
      id: '3',
      transactionId: 'TXN001234569',
      studentId: 'STU003',
      studentName: 'Mike Johnson',
      amount: 2000,
      feeType: 'Library Fee',
      paymentMethod: 'SSL Commerz',
      paymentDate: '2024-01-06',
      status: 'failed',
      receiptNumber: ''
    },
    {
      id: '4',
      transactionId: 'TXN001234570',
      studentId: 'STU004',
      studentName: 'Sarah Wilson',
      amount: 3000,
      feeType: 'Lab Fee',
      paymentMethod: 'Cash',
      paymentDate: '2024-01-05',
      status: 'completed',
      receiptNumber: 'RCP003'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  const filteredHistory = paymentHistory.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || record.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const handleDownloadReceipt = (record: PaymentRecord) => {
    // Simulate receipt download
    console.log('Downloading receipt for:', record.receiptNumber);
  };

  const handleViewReceipt = (record: PaymentRecord) => {
    // Simulate viewing receipt
    console.log('Viewing receipt for:', record.receiptNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'refunded': return 'secondary';
      default: return 'secondary';
    }
  };

  const totalAmount = filteredHistory
    .filter(record => record.status === 'completed')
    .reduce((sum, record) => sum + record.amount, 0);

  const totalTransactions = filteredHistory.filter(record => record.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {totalTransactions} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalTransactions / filteredHistory.length) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Payment success rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,000</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View and manage all payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, transaction ID, or receipt number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="SSL Commerz">SSL Commerz</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-mono text-sm">
                    {record.transactionId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.studentName}</div>
                      <div className="text-sm text-muted-foreground">{record.studentId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.feeType}</TableCell>
                  <TableCell>₹{record.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(record.paymentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.receiptNumber && (
                      <span className="font-mono text-sm">{record.receiptNumber}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.receiptNumber && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewReceipt(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadReceipt(record)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
