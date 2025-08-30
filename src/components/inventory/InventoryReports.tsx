
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Package } from 'lucide-react';

export const InventoryReports = () => {
  const reports = [
    {
      title: 'Inventory Valuation Report',
      description: 'Total value of all inventory items',
      icon: TrendingUp,
      action: 'Generate PDF'
    },
    {
      title: 'Stock Level Report',
      description: 'Current stock levels for all consumables',
      icon: Package,
      action: 'Generate Excel'
    },
    {
      title: 'Assignment History',
      description: 'Complete history of item assignments',
      icon: FileText,
      action: 'Generate PDF'
    },
    {
      title: 'Maintenance Schedule',
      description: 'Upcoming and overdue maintenance tasks',
      icon: FileText,
      action: 'Generate PDF'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Inventory Reports</h2>
        <p className="text-muted-foreground">Generate and export various inventory reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className="h-5 w-5" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {report.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
