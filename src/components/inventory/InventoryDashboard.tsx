
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, Users, Wrench, TrendingUp } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { InventoryAlerts } from './InventoryAlerts';
import { StockOverview } from './StockOverview';

export const InventoryDashboard = () => {
  const { 
    items, 
    assignments, 
    alerts, 
    itemsLoading,
    assignmentsLoading,
    alertsLoading 
  } = useInventory();

  if (itemsLoading || assignmentsLoading || alertsLoading) {
    return <div className="p-6">Loading inventory dashboard...</div>;
  }

  const totalItems = items.length;
  const totalAssignments = assignments.filter(a => a.is_active).length;
  const criticalAlerts = alerts.filter(a => a.priority === 'critical').length;
  const lowStockItems = items.filter(i => 
    i.item_type === 'consumable' && 
    (i.quantity_in_stock || 0) <= (i.minimum_stock_level || 0)
  ).length;

  const totalValue = items.reduce((sum, item) => sum + (item.purchase_cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Currently assigned items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Inventory valuation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {criticalAlerts > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Alerts
              <Badge variant="destructive">{criticalAlerts}</Badge>
            </CardTitle>
            <CardDescription className="text-red-700">
              Immediate attention required for these inventory issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryAlerts showCriticalOnly />
          </CardContent>
        </Card>
      )}

      {/* Stock Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockOverview />
        <InventoryAlerts />
      </div>
    </div>
  );
};
