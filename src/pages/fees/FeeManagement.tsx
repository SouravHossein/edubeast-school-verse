
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeeStructure } from '@/components/fees/FeeStructure';
import { PaymentSystem } from '@/components/fees/PaymentSystem';
import { PaymentHistory } from '@/components/fees/PaymentHistory';
import { DueReminders } from '@/components/fees/DueReminders';
import { FeeReports } from '@/components/fees/FeeReports';
import { CreditCard, Receipt, Bell, BarChart3, Settings } from 'lucide-react';

const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState('structure');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
        <p className="text-muted-foreground">
          Manage fee structure, payments, and student billing
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Fee Structure
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="reminders" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Reminders
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-6">
          <FeeStructure />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentSystem />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <DueReminders />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <FeeReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeeManagement;
