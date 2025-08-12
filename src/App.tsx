
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider, useTenant } from "@/hooks/useTenant";
import { ThemeProvider } from "@/hooks/useTheme";
import { RBACProvider } from "@/hooks/useRBAC";
import { SchoolOnboardingWizard } from "@/components/tenant/SchoolOnboardingWizard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { PublicHomePage } from "./pages/public/PublicHomePage";
import { PublicAboutPage } from "./pages/public/PublicAboutPage";
import { PublicNewsPage } from "./pages/public/PublicNewsPage";
import StudentManagement from "./pages/students/StudentManagement";
import TeacherManagement from "./pages/teachers/TeacherManagement";
import ClassTimetableManagement from "./pages/classes/ClassTimetableManagement";
import AttendanceManagement from "./pages/attendance/AttendanceManagement";
import ExaminationManagement from "./pages/examinations/ExaminationManagement";
import FeeManagement from "./pages/fees/FeeManagement";
import CommunicationHub from "./pages/communications/CommunicationHub";
import BlogDashboard from "./pages/blog/BlogDashboard";
import BlogPost from "./pages/blog/BlogPost";
import BlogListing from "./pages/blog/BlogListing";
import AuthorProfile from "./pages/blog/AuthorProfile";
import UserApprovals from "./pages/admin/UserApprovals";
import SchoolSettings from "./pages/settings/SchoolSettings";
import AIFeatures from "./pages/ai/AIFeatures";
import AdminPortal from "./pages/admin/AdminPortal";
import ApplicationForm from "./pages/public/ApplicationForm";
import PublicGallery from "./pages/public/PublicGallery";
import React from "react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TenantProvider>
              <ThemeProvider>
                <RBACProvider>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/public" element={<PublicHomePage />} />
                    <Route path="/about" element={<PublicAboutPage />} />
                    <Route path="/news" element={<PublicNewsPage />} />
                    <Route path="/news/:slug" element={<BlogPost />} />
                    <Route path="/apply" element={<ApplicationForm />} />
                    <Route path="/gallery" element={<PublicGallery />} />
                    
                    {/* Onboarding route */}
                    <Route 
                      path="/onboarding" 
                      element={
                        <ProtectedRoute>
                          <OnboardingGate />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Protected dashboard routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <Dashboard />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/students"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <StudentManagement />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/teachers"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <TeacherManagement />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/classes"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <ClassTimetableManagement />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/attendance"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <AttendanceManagement />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/examinations"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <ExaminationManagement />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/fees"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <FeeManagement />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/communications"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <CommunicationHub />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/blog"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <BlogDashboard />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/blog/:slug"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <BlogPost />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/blog/author/:authorId"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <AuthorProfile />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/approvals"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <UserApprovals />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/settings"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <SchoolSettings />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/ai"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <AIFeatures />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/admin"
                      element={
                        <ProtectedRoute>
                          <TenantGate>
                            <AdminPortal />
                          </TenantGate>
                        </ProtectedRoute>
                      }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </RBACProvider>
              </ThemeProvider>
            </TenantProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Component to handle onboarding flow
const OnboardingGate: React.FC = () => {
  const { tenant, loading } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (tenant?.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <SchoolOnboardingWizard 
      onComplete={() => window.location.href = '/dashboard'} 
    />
  );
};

// Component to handle tenant access
const TenantGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant, loading } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading school data...</p>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!tenant.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default App;
