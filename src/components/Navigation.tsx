import React, { useState, useEffect, useRef } from 'react';
import { LoginDialog } from './LoginDialog';

// Futuristic Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = (role) => {
    setSelectedRole(role);
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
    setSelectedRole(null);
  };

  const menuItems = [
    { name: 'Home', href: '/home', icon: '🏠' },
    { name: 'Blog', href: '/blog', icon: '🌟' },
    { name: 'Gallery', href: '/gallery', icon: '🎓' },
    { name: 'Apply', href: '/apply', icon: '📝' },
    { name: 'Events', href: '/events', icon: '🎉' },
  ];

  const roleButtons = [
    { role: 'admin', label: 'Admin', color: 'from-purple-400 to-pink-400', icon: '👑' },
    { role: 'teacher', label: 'Teacher', color: 'from-blue-400 to-cyan-400', icon: '👨‍🏫' },
    { role: 'student', label: 'Student', color: 'from-green-400 to-teal-400', icon: '🎒' },
    { role: 'parent', label: 'Parent', color: 'from-orange-400 to-yellow-400', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`mt-4 mx-auto max-w-4xl rounded-full border border-white/20 backdrop-blur-2xl transition-all duration-500 ${
              scrollY > 100 
                ? 'bg-slate-900/95 shadow-2xl shadow-teal-400/10' 
                : 'bg-white/10 shadow-xl shadow-white/5'
            }`}
          >
            <div className="flex justify-between items-center px-6 py-4">
              {/* Logo */}
              <div className="flex items-center">
                <a href="#home" className="flex items-center space-x-3 group">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-yellow-400 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-yellow-400 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </div>
                   <span className="text-xl font-black bg-gradient-to-r from-teal-400 to-yellow-400 bg-clip-text text-transparent font-mono hidden sm:block">
                     EduBeast
                   </span>
                </a>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-2">
                {menuItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 group"
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <span className="text-sm">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </span>
                    <div 
                      className={`absolute inset-0 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 transition-all duration-300 ${
                        hoveredItem === index 
                          ? 'opacity-100 scale-100 shadow-lg shadow-teal-400/20' 
                          : 'opacity-0 scale-95'
                      }`}
                    ></div>
                  </a>
                ))}
              </div>

              {/* Login Button */}
              <div className="hidden md:block">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="relative px-6 py-2 bg-gradient-to-r from-teal-400 to-yellow-400 text-slate-900 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-400/30 group overflow-hidden"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white transition-all duration-300 hover:bg-white/20"
                >
                  <div className="w-6 h-6 flex flex-col justify-around">
                    <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div 
              className={`lg:hidden overflow-hidden transition-all duration-500 ${
                isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 space-y-2 border-t border-white/10">
                {menuItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span>{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </a>
                ))}
                <button
                  onClick={() => handleLoginClick('admin')}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-teal-400 to-yellow-400 text-slate-900 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Dialog */}
      {isLoginOpen && (
        <LoginDialog isOpen={isLoginOpen} onClose={handleCloseLogin} role={selectedRole} setSelectedRole={setSelectedRole} />
      )}
      
    </>
  );
};

export default Navigation;