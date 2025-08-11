
import React from 'react';
import { useTenant } from '@/hooks/useTenant';
import { useTheme } from '@/hooks/useTheme';

interface PublicSiteLayoutProps {
  children: React.ReactNode;
}

export const PublicSiteLayout: React.FC<PublicSiteLayoutProps> = ({ children }) => {
  const { tenant } = useTenant();
  
  if (!tenant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">School Not Found</h1>
          <p className="text-muted-foreground">This school website is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Public Navigation */}
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {tenant.logo_url ? (
                <img 
                  src={tenant.logo_url} 
                  alt={tenant.name}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {tenant.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="ml-3 text-xl font-bold">{tenant.name}</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary">Home</a>
              <a href="/about" className="text-foreground hover:text-primary">About</a>
              <a href="/admissions" className="text-foreground hover:text-primary">Admissions</a>
              <a href="/news" className="text-foreground hover:text-primary">News</a>
              <a href="/contact" className="text-foreground hover:text-primary">Contact</a>
              <a 
                href="/dashboard" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Portal Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">{tenant.name}</h3>
              {tenant.address && <p className="text-muted-foreground mb-2">{tenant.address}</p>}
              {tenant.contact_phone && <p className="text-muted-foreground mb-2">Phone: {tenant.contact_phone}</p>}
              {tenant.contact_email && <p className="text-muted-foreground">Email: {tenant.contact_email}</p>}
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/about" className="hover:text-primary">About Us</a></li>
                <li><a href="/admissions" className="hover:text-primary">Admissions</a></li>
                <li><a href="/news" className="hover:text-primary">News</a></li>
                <li><a href="/contact" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Portals</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/dashboard" className="hover:text-primary">Student Portal</a></li>
                <li><a href="/dashboard" className="hover:text-primary">Teacher Portal</a></li>
                <li><a href="/dashboard" className="hover:text-primary">Parent Portal</a></li>
                <li><a href="/dashboard" className="hover:text-primary">Admin Portal</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>Follow us for updates and announcements</p>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {tenant.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
