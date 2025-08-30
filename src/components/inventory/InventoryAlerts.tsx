
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';

interface InventoryAlertsProps {
  showCriticalOnly?: boolean;
}

export const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ showCriticalOnly = false }) => {
  const { alerts, acknowledgeAlert, alertsLoading } = useInventory();

  const filteredAlerts = showCriticalOnly 
    ? alerts.filter(alert => alert.priority === 'critical')
    : alerts;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'low_stock':
      case 'overdue_return':
      case 'warranty_expiry':
      case 'maintenance_due':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (alertsLoading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Inventory Alerts
          {filteredAlerts.length > 0 && (
            <Badge variant="secondary">{filteredAlerts.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          {showCriticalOnly ? 'Critical alerts requiring immediate attention' : 'Recent inventory alerts and notifications'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>No alerts at this time</p>
            <p className="text-sm">All inventory items are in good condition</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start justify-between p-3 border rounded-lg bg-card"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.alert_type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getPriorityColor(alert.priority)}>
                        {alert.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {alert.alert_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{alert.item?.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.alert_message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => acknowledgeAlert(alert.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Acknowledge
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
