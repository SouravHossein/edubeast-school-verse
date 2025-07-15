import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap } from 'lucide-react';
import { LoginDialog } from './LoginDialog';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'student' | 'parent' | null>(null);

  const handleRoleLogin = (role: 'admin' | 'teacher' | 'student' | 'parent') => {
    setSelectedRole(role);
    setIsLoginOpen(true);
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const roleButtons = [
    { role: 'admin' as const, label: 'Admin Login', variant: 'admin' as const },
    { role: 'teacher' as const, label: 'Teacher Login', variant: 'teacher' as const },
    { role: 'student' as const, label: 'Student Login', variant: 'student' as const },
    { role: 'parent' as const, label: 'Parent Login', variant: 'parent' as const },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">EduBeast</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
              
              {/* Role Login Buttons */}
              <div className="flex items-center space-x-2">
                {roleButtons.map((button) => (
                  <Button
                    key={button.role}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoleLogin(button.role)}
                    className="transition-smooth hover:shadow-soft"
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary px-3 py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Mobile Role Buttons */}
                <div className="pt-4 border-t space-y-2">
                  {roleButtons.map((button) => (
                    <Button
                      key={button.role}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleRoleLogin(button.role);
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start transition-smooth"
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setSelectedRole(null);
        }}
        role={selectedRole}
      />
    </>
  );
};