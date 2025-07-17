import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AttendanceMarking } from '@/components/attendance/AttendanceMarking';
import { AttendanceReports } from '@/components/attendance/AttendanceReports';
import { AttendanceAnalytics } from '@/components/attendance/AttendanceAnalytics';
import { BulkAttendance } from '@/components/attendance/BulkAttendance';

export default function AttendanceManagement() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage student and staff attendance</p>
        </div>
      </div>

      <Tabs defaultValue="marking" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="marking">Mark Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="marking">
          <AttendanceMarking />
        </TabsContent>

        <TabsContent value="reports">
          <AttendanceReports />
        </TabsContent>

        <TabsContent value="analytics">
          <AttendanceAnalytics />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkAttendance />
        </TabsContent>
      </Tabs>
    </div>
  );
}