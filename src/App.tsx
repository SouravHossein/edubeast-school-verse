
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { TenantProvider } from '@/hooks/useTenant';
import { SiteThemeProvider } from '@/components/public/ThemeProvider';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';

// Management Pages
import StudentManagement from '@/pages/students/StudentManagement';
import TeacherManagement from '@/pages/teachers/TeacherManagement';
import AttendanceManagement from '@/pages/attendance/AttendanceManagement';
import ExaminationManagement from '@/pages/examinations/ExaminationManagement';
import FeeManagement from '@/pages/fees/FeeManagement';
import ClassTimetableManagement from '@/pages/classes/ClassTimetableManagement';
import CommunicationHub from '@/pages/communications/CommunicationHub';
import AIFeatures from '@/pages/ai/AIFeatures';
import BlogDashboard from '@/pages/blog/BlogDashboard';
import BlogListing from '@/pages/blog/BlogListing';
import BlogPost from '@/pages/blog/BlogPost';
import AuthorProfile from '@/pages/blog/AuthorProfile';
import SchoolSettings from '@/pages/settings/SchoolSettings';

// Admin Pages
import { UserApprovals } from '@/pages/admin/UserApprovals';
import { AdminPortal } from '@/pages/admin/AdminPortal';

// Public Pages
import { ApplicationForm } from '@/pages/public/ApplicationForm';
import { PublicGallery } from '@/pages/public/PublicGallery';
import { PublicHomePage } from '@/pages/public/PublicHomePage';
import { PublicAboutPage } from '@/pages/public/PublicAboutPage';
import { PublicNewsPage } from '@/pages/public/PublicNewsPage';

// Components
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicSiteLayout } from '@/components/public/PublicSiteLayout';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SchoolOnboardingWizard } from '@/components/tenant/SchoolOnboardingWizard';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const queryClient = new QueryClient();

// Onboarding Gate Component
const OnboardingGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant, loading } = useTenant();
  const { isAuthenticated, isLoading } = useAuth();

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user needs to complete onboarding
  if (!tenant?.onboarding_completed) {
    return <SchoolOnboardingWizard onComplete={() => window.location.reload()} />;
  }

  return <>{children}</>;
};

// Tenant Gate Component - ensures user has access to tenant
const TenantGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant, loading } = useTenant();
  const { isAuthenticated, isLoading } = useAuth();

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!tenant) {
    return <Navigate to="/onboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <SiteThemeProvider>
            <Router>
            <ThemeProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public Landing Page */}
                  <Route path="/" element={<Index />} />
                  
                  {/* Onboarding Route */}
                  <Route 
                    path="/onboard" 
                    element={
                      <ProtectedRoute>
                        <SchoolOnboardingWizard onComplete={() => window.location.href = "/dashboard"} />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Public School Site Routes */}
                  <Route path="/s/:slug" element={<PublicSiteLayout><div /></PublicSiteLayout>}>
                    <Route index element={<PublicHomePage />} />
                    <Route path="about" element={<PublicAboutPage />} />
                    <Route path="news" element={<PublicNewsPage />} />
                    <Route path="gallery" element={<PublicGallery />} />
                    <Route path="apply" element={<ApplicationForm />} />
                    <Route path="blog" element={<BlogListing />} />
                    <Route path="blog/:slug" element={<BlogPost />} />
                    <Route path="author/:authorId" element={<AuthorProfile />} />
                  </Route>

                  <Route path="/dashboard" element={
                    <OnboardingGate>
                      <TenantGate>
                        <DashboardLayout><Outlet /></DashboardLayout>
                      </TenantGate>
                    </OnboardingGate>
                  }>
                    <Route index element={<Dashboard />} />
                    
                    {/* Management Routes */}
                    <Route path="students" element={
                      <ProtectedRoute requiredModule="studentManagement">
                        <StudentManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="teachers" element={
                      <ProtectedRoute requiredRole="admin">
                        <TeacherManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="attendance" element={
                      <ProtectedRoute requiredModule="attendanceManagement">
                        <AttendanceManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="examinations" element={
                      <ProtectedRoute requiredModule="onlineExams">
                        <ExaminationManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="fees" element={
                      <ProtectedRoute requiredModule="feeManagement">
                        <FeeManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="classes" element={
                      <ProtectedRoute requiredRole="teacher">
                        <ClassTimetableManagement />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="communications" element={
                      <ProtectedRoute requiredModule="messagingSystem">
                        <CommunicationHub />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="ai" element={
                      <ProtectedRoute requiredRole="teacher">
                        <AIFeatures />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="blog" element={
                      <ProtectedRoute requiredRole="teacher">
                        <BlogDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="admin" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminPortal />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="admin/approvals" element={
                      <ProtectedRoute requiredRole="admin">
                        <UserApprovals />
                      </ProtectedRoute>
                    } />
                    
                    {/* Settings */}
                    <Route path="settings" element={
                      <ProtectedRoute requiredRole="admin">
                        <SchoolSettings />
                      </ProtectedRoute>
                    } />
                  </Route>

                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </div>
            </ThemeProvider>
            </Router>
          </SiteThemeProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
