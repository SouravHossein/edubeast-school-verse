import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SchoolConfigProvider } from "@/contexts/SchoolConfigContext";
import { ApprovalProvider } from "@/contexts/ApprovalContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StudentManagement from "./pages/students/StudentManagement";
import TeacherManagement from "./pages/teachers/TeacherManagement";
import AttendanceManagement from "./pages/attendance/AttendanceManagement";
import ClassTimetableManagement from "./pages/classes/ClassTimetableManagement";
import ExaminationManagement from "@/pages/examinations/ExaminationManagement";
import FeeManagement from "@/pages/fees/FeeManagement";
import NotFound from "./pages/NotFound";
import CommunicationHub from "./pages/communications/CommunicationHub";
import { PublicGallery } from "./pages/public/PublicGallery";
import { ApplicationForm } from "./pages/public/ApplicationForm";
import { UserApprovals } from "./pages/admin/UserApprovals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SchoolConfigProvider>
        <ApprovalProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/gallery" element={<PublicGallery />} />
                <Route path="/apply" element={<ApplicationForm />} />
                <Route 
                  path="/dashboard/*" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="students" element={<StudentManagement />} />
                          <Route path="teachers" element={<TeacherManagement />} />
                          <Route path="attendance" element={<AttendanceManagement />} />
                          <Route path="classes" element={<ClassTimetableManagement />} />
                          <Route path="examinations" element={<ExaminationManagement />} />
                          <Route path="fees" element={<FeeManagement />} />
                          <Route path="communications" element={<CommunicationHub />} />
                          <Route 
                            path="approvals" 
                            element={
                              <ProtectedRoute requiredRole="admin">
                                <UserApprovals />
                              </ProtectedRoute>
                            } 
                          />
                          <Route path="*" element={<Dashboard />} />
                        </Routes>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ApprovalProvider>
      </SchoolConfigProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
