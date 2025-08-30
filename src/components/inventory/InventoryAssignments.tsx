
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Package } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';

export const InventoryAssignments = () => {
  const { assignments, assignmentsLoading } = useInventory();

  if (assignmentsLoading) {
    return <div className="p-6">Loading assignments...</div>;
  }

  const activeAssignments = assignments.filter(a => a.is_active);
  const overdueAssignments = activeAssignments.filter(a => 
    a.expected_return_date && new Date(a.expected_return_date) < new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Item Assignments</h2>
          <p className="text-muted-foreground">Track issued items and their return status</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAssignments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Returns</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueAssignments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(activeAssignments.map(a => a.assigned_to_id)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
          <CardDescription>Items currently assigned to users</CardDescription>
        </CardHeader>
        <CardContent>
          {activeAssignments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2" />
              <p>No active assignments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{assignment.item?.name}</h4>
                      <Badge variant="outline">{assignment.item?.asset_id}</Badge>
                      {assignment.expected_return_date && 
                       new Date(assignment.expected_return_date) < new Date() && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Assigned to: {assignment.assigned_to_name} ({assignment.assigned_to_type})
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span>Issued: {new Date(assignment.assigned_date).toLocaleDateString()}</span>
                      {assignment.expected_return_date && (
                        <span>Due: {new Date(assignment.expected_return_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Process Return
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
