
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SchoolConfigProvider } from "@/contexts/SchoolConfigContext";
import { ApprovalProvider } from "@/contexts/ApprovalContext";
import { TenantProvider } from "@/hooks/useTenant";
import { ThemeProvider } from "@/hooks/useTheme";
import { RBACProvider } from "@/hooks/useRBAC";
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
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AdminPortal } from './pages/admin/AdminPortal';
import SchoolSettings from './pages/settings/SchoolSettings';
import { PublicHomePage } from './pages/public/PublicHomePage';
import { PublicAboutPage } from './pages/public/PublicAboutPage';
import { PublicNewsPage } from './pages/public/PublicNewsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <TenantProvider>
            <ThemeProvider>
              <SchoolConfigProvider>
                <ApprovalProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<PublicHomePage />} />
                      <Route path="/about" element={<PublicAboutPage />} />
                      <Route path="/news" element={<PublicNewsPage />} />
                      <Route path="/gallery" element={<PublicGallery />} />
                      <Route path="/apply" element={<ApplicationForm />} />
                      <Route path="/contact" element={<PublicHomePage />} />
                      <Route path="/admissions" element={<ApplicationForm />} />
                      
                      {/* Blog Routes */}
                      <Route path="/blog" element={<BlogListing />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/author/:authorId" element={<AuthorProfile />} />
                      
                      {/* Admin Portal */}
                      <Route path="/admin-portal-xyz123" element={<AdminPortal />} />
                      
                      {/* Protected Portal Routes */}
                      <Route 
                        path="/portal/*" 
                        element={
                          <ProtectedRoute>
                            <RBACProvider>
                              <DashboardLayout>
                                <Routes>
                                  <Route index element={<Dashboard />} />
                                  <Route 
                                    path="students" 
                                    element={
                                      <ProtectedRoute requiredModule="students">
                                        <StudentManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="teachers" 
                                    element={
                                      <ProtectedRoute requiredModule="teachers">
                                        <TeacherManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="attendance" 
                                    element={
                                      <ProtectedRoute requiredModule="attendance">
                                        <AttendanceManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="classes" 
                                    element={
                                      <ProtectedRoute requiredModule="classes">
                                        <ClassTimetableManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="examinations" 
                                    element={
                                      <ProtectedRoute requiredModule="examinations">
                                        <ExaminationManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="fees" 
                                    element={
                                      <ProtectedRoute requiredModule="fees">
                                        <FeeManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="communications" 
                                    element={
                                      <ProtectedRoute requiredModule="communications">
                                        <CommunicationHub />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="blog" 
                                    element={
                                      <ProtectedRoute requiredModule="blog">
                                        <BlogDashboard />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="approvals" 
                                    element={
                                      <ProtectedRoute requiredRole="admin">
                                        <UserApprovals />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="settings" 
                                    element={
                                      <ProtectedRoute requiredRole="admin">
                                        <SchoolSettings />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route path="*" element={<Dashboard />} />
                                </Routes>
                              </DashboardLayout>
                            </RBACProvider>
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Legacy Dashboard Routes (redirect to portal) */}
                      <Route 
                        path="/dashboard/*" 
                        element={
                          <ProtectedRoute>
                            <RBACProvider>
                              <DashboardLayout>
                                <Routes>
                                  <Route index element={<Dashboard />} />
                                  <Route 
                                    path="students" 
                                    element={
                                      <ProtectedRoute requiredModule="students">
                                        <StudentManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="teachers" 
                                    element={
                                      <ProtectedRoute requiredModule="teachers">
                                        <TeacherManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="attendance" 
                                    element={
                                      <ProtectedRoute requiredModule="attendance">
                                        <AttendanceManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="classes" 
                                    element={
                                      <ProtectedRoute requiredModule="classes">
                                        <ClassTimetableManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="examinations" 
                                    element={
                                      <ProtectedRoute requiredModule="examinations">
                                        <ExaminationManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="fees" 
                                    element={
                                      <ProtectedRoute requiredModule="fees">
                                        <FeeManagement />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="communications" 
                                    element={
                                      <ProtectedRoute requiredModule="communications">
                                        <CommunicationHub />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="blog" 
                                    element={
                                      <ProtectedRoute requiredModule="blog">
                                        <BlogDashboard />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="approvals" 
                                    element={
                                      <ProtectedRoute requiredRole="admin">
                                        <UserApprovals />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route 
                                    path="settings" 
                                    element={
                                      <ProtectedRoute requiredRole="admin">
                                        <SchoolSettings />
                                      </ProtectedRoute>
                                    } 
                                  />
                                  <Route path="*" element={<Dashboard />} />
                                </Routes>
                              </DashboardLayout>
                            </RBACProvider>
                          </ProtectedRoute>
                        } 
                      />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </ApprovalProvider>
              </SchoolConfigProvider>
            </ThemeProvider>
          </TenantProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
