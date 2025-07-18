
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

export const FeeReports = () => {
  const [reportPeriod, setReportPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('collection');

  // Sample data
  const monthlyCollection = [
    { month: 'Jan', collected: 450000, due: 50000 },
    { month: 'Feb', collected: 420000, due: 80000 },
    { month: 'Mar', collected: 480000, due: 45000 },
    { month: 'Apr', collected: 510000, due: 35000 },
    { month: 'May', collected: 490000, due: 60000 },
    { month: 'Jun', collected: 520000, due: 30000 }
  ];

  const feeTypeDistribution = [
    { name: 'Tuition Fee', value: 350000, color: '#8884d8' },
    { name: 'Transport Fee', value: 150000, color: '#82ca9d' },
    { name: 'Library Fee', value: 80000, color: '#ffc658' },
    { name: 'Lab Fee', value: 120000, color: '#ff7300' },
    { name: 'Sports Fee', value: 60000, color: '#00ff88' }
  ];

  const collectionTrend = [
    { date: '2024-01-01', amount: 25000 },
    { date: '2024-01-02', amount: 32000 },
    { date: '2024-01-03', amount: 28000 },
    { date: '2024-01-04', amount: 45000 },
    { date: '2024-01-05', amount: 38000 },
    { date: '2024-01-06', amount: 52000 },
    { date: '2024-01-07', amount: 41000 }
  ];

  const paymentMethodStats = [
    { method: 'SSL Commerz', transactions: 234, amount: 345000, percentage: 65 },
    { method: 'Bank Transfer', transactions: 89, amount: 125000, percentage: 24 },
    { method: 'Cash', transactions: 45, amount: 45000, percentage: 8 },
    { method: 'Cheque', transactions: 12, amount: 15000, percentage: 3 }
  ];

  const overdueAnalysis = [
    { range: '1-7 days', count: 12, amount: 45000 },
    { range: '8-15 days', count: 8, amount: 32000 },
    { range: '16-30 days', count: 5, amount: 18000 },
    { range: '30+ days', count: 3, amount: 12000 }
  ];

  const handleExportReport = () => {
    // Simulate report export
    console.log('Exporting report for period:', reportPeriod, 'type:', reportType);
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fee Reports & Analytics</CardTitle>
              <CardDescription>
                Comprehensive analysis of fee collection and payment trends
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="current-quarter">This Quarter</SelectItem>
                  <SelectItem value="current-year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collection">Collection</SelectItem>
                  <SelectItem value="outstanding">Outstanding</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,20,000</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹30,000</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-500" />
              -8% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-muted-foreground">
              Above target (90%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Payment Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-muted-foreground">
              Before due date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Collection vs Outstanding</CardTitle>
            <CardDescription>
              Fee collection and outstanding amounts over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyCollection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="collected" fill="#8884d8" name="Collected" />
                <Bar dataKey="due" fill="#82ca9d" name="Outstanding" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Type Distribution</CardTitle>
            <CardDescription>
              Breakdown of fee collection by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feeTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {feeTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Collection Trend</CardTitle>
            <CardDescription>
              Daily fee collection amounts for the current week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={collectionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} 
                />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Analysis of payment methods used by parents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethodStats.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{method.method}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {method.transactions} transactions
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">₹{method.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{method.percentage}%</div>
                    </div>
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Overdue Analysis</CardTitle>
          <CardDescription>
            Breakdown of overdue payments by time ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overdueAnalysis} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="range" type="category" width={80} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'count' ? `${value} students` : `₹${value.toLocaleString()}`,
                  name === 'count' ? 'Students' : 'Amount'
                ]} 
              />
              <Legend />
              <Bar dataKey="count" fill="#ff7300" name="Students" />
              <Bar dataKey="amount" fill="#8884d8" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
