import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassManagement } from '@/components/classes/ClassManagement';
import { TimetableBuilder } from '@/components/classes/TimetableBuilder';
import { SubjectAllocation } from '@/components/classes/SubjectAllocation';
import { ClassroomAssignment } from '@/components/classes/ClassroomAssignment';
import { SubstituteManagement } from '@/components/classes/SubstituteManagement';

export default function ClassTimetableManagement() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Class & Timetable Management</h1>
          <p className="text-muted-foreground">Manage classes, subjects, and create timetables</p>
        </div>
      </div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subject Allocation</TabsTrigger>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
          <TabsTrigger value="timetable">Timetable Builder</TabsTrigger>
          <TabsTrigger value="substitutes">Substitutes</TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <ClassManagement />
        </TabsContent>

        <TabsContent value="subjects">
          <SubjectAllocation />
        </TabsContent>

        <TabsContent value="classrooms">
          <ClassroomAssignment />
        </TabsContent>

        <TabsContent value="timetable">
          <TimetableBuilder />
        </TabsContent>

        <TabsContent value="substitutes">
          <SubstituteManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}