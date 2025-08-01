
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
import BlogListing from "./pages/blog/BlogListing";
import BlogPost from "./pages/blog/BlogPost";
import BlogDashboard from "./pages/blog/BlogDashboard";
import AuthorProfile from "./pages/blog/AuthorProfile";
import { ThemeProvider } from './contexts/ThemeContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminPortal } from './pages/admin/AdminPortal';


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SchoolConfigProvider>
        <ApprovalProvider>
          <AdminAuthProvider>
            <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ThemeProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/gallery" element={<PublicGallery />} />
                  <Route path="/apply" element={<ApplicationForm />} />
                  <Route path="/blog" element={<BlogListing />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/author/:authorId" element={<AuthorProfile />} />
                  <Route path="/admin-portal-xyz123" element={<AdminPortal />} />
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
                          <Route path="blog" element={<BlogDashboard />} />
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
              </ThemeProvider>
            </BrowserRouter>
            </AuthProvider>
          </AdminAuthProvider>
        </ApprovalProvider>
      </SchoolConfigProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
