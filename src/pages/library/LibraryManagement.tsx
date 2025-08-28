
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookCatalog } from '@/components/library/BookCatalog';
import { Book, Users, BarChart3, Settings } from 'lucide-react';

export default function LibraryManagement() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Library Management</h1>
        <p className="text-muted-foreground">
          Manage your school's library system, books, and borrowing
        </p>
      </div>

      <Tabs defaultValue="catalog" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Catalog
          </TabsTrigger>
          <TabsTrigger value="borrowing" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Borrowing
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="catalog">
          <BookCatalog />
        </TabsContent>

        <TabsContent value="borrowing">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Borrowing Management</h3>
            <p className="text-muted-foreground">
              Book borrowing and return system will be available here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Library Reports</h3>
            <p className="text-muted-foreground">
              Analytics and reports will be available here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Library Settings</h3>
            <p className="text-muted-foreground">
              Configure borrowing rules and library settings
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
