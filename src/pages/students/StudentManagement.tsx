
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Download, Users, UserCheck, GraduationCap } from 'lucide-react';
import { StudentList } from '@/components/students/StudentList';
import { AdmissionForm } from '@/components/students/AdmissionForm';
import { BatchOperations } from '@/components/students/BatchOperations';
import { AdmissionApprovals } from '@/components/students/AdmissionApprovals';

const StudentManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);

  const stats = [
    { title: 'Total Students', value: '1,245', icon: Users, color: 'text-blue-600' },
    { title: 'Pending Admissions', value: '23', icon: UserCheck, color: 'text-orange-600' },
    { title: 'Active Classes', value: '42', icon: GraduationCap, color: 'text-green-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage student admissions, profiles, and academic records
          </p>
        </div>
        <Button onClick={() => setShowAdmissionForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Admission
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Student List</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="batch">Batch Operations</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <StudentList />
        </TabsContent>

        <TabsContent value="admissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admission Management</CardTitle>
              <CardDescription>Process new student admissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowAdmissionForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Start New Admission
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <BatchOperations />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <AdmissionApprovals />
        </TabsContent>
      </Tabs>

      {/* Admission Form Modal */}
      {showAdmissionForm && (
        <AdmissionForm 
          open={showAdmissionForm}
          onClose={() => setShowAdmissionForm(false)}
        />
      )}
    </div>
  );
};

export default StudentManagement;
