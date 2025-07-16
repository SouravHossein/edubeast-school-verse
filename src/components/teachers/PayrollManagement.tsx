import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, Download, FileText, Calculator, TrendingUp, TrendingDown } from 'lucide-react';

interface PayrollRecord {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  baseSalary: number;
  allowances: number;
  overtimePay: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending' | 'processing';
  payPeriod: string;
  payDate: string;
}

export const PayrollManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock data
  const payrollRecords: PayrollRecord[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      name: 'Dr. Sarah Johnson',
      department: 'Mathematics',
      baseSalary: 75000,
      allowances: 5000,
      overtimePay: 2000,
      deductions: 8000,
      netSalary: 74000,
      status: 'paid',
      payPeriod: '2024-01',
      payDate: '2024-01-31'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      name: 'Mr. James Wilson',
      department: 'Science',
      baseSalary: 65000,
      allowances: 3000,
      overtimePay: 1500,
      deductions: 6500,
      netSalary: 63000,
      status: 'paid',
      payPeriod: '2024-01',
      payDate: '2024-01-31'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      name: 'Ms. Emily Davis',
      department: 'English',
      baseSalary: 60000,
      allowances: 2500,
      overtimePay: 1000,
      deductions: 5500,
      netSalary: 58000,
      status: 'processing',
      payPeriod: '2024-01',
      payDate: '2024-01-31'
    }
  ];

  const filteredRecords = payrollRecords.filter(record => {
    const matchesDepartment = departmentFilter === 'all' || record.department === departmentFilter;
    const matchesMonth = record.payPeriod === selectedMonth;
    return matchesDepartment && matchesMonth;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      paid: 'default',
      pending: 'outline',
      processing: 'secondary'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const stats = {
    totalPayroll: filteredRecords.reduce((sum, r) => sum + r.netSalary, 0),
    totalAllowances: filteredRecords.reduce((sum, r) => sum + r.allowances, 0),
    totalDeductions: filteredRecords.reduce((sum, r) => sum + r.deductions, 0),
    totalOvertime: filteredRecords.reduce((sum, r) => sum + r.overtimePay, 0)
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payroll Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="month">Pay Period</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="department">Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold">${stats.totalPayroll.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Allowances</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalAllowances.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">${stats.totalDeductions.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overtime Pay</p>
                <p className="text-2xl font-bold text-blue-600">${stats.totalOvertime.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.name}</div>
                      <div className="text-sm text-muted-foreground">{record.employeeId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>${record.baseSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">+${record.allowances.toLocaleString()}</TableCell>
                  <TableCell className="text-blue-600">+${record.overtimePay.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">-${record.deductions.toLocaleString()}</TableCell>
                  <TableCell className="font-bold">${record.netSalary.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Payslip
                    </Button>
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