
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InventoryDashboard } from '@/components/inventory/InventoryDashboard';
import { InventoryItems } from '@/components/inventory/InventoryItems';
import { InventoryAssignments } from '@/components/inventory/InventoryAssignments';
import { InventoryReports } from '@/components/inventory/InventoryReports';
import { useRBAC } from '@/hooks/useRBAC';

export default function InventoryManagement() {
  const { isAdmin, isTeacher } = useRBAC();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAdmin && !isTeacher) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">You don't have permission to access inventory management.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Inventory & Assets</h1>
        <p className="text-muted-foreground">
          Manage school inventory, track assets, and monitor stock levels
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <InventoryDashboard />
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <InventoryItems />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <InventoryAssignments />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <InventoryReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
