import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, History, FileText, Shield, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

const NavBar = ({ role, quota, showVerifiedBadge, showAdminWidget }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ isOpen: false, type: 'login' });
  const { user, logout } = useAuth();

  const handleSwitchAuthModal = () => {
    setAuthModal(prev => ({ ...prev, type: prev.type === 'login' ? 'register' : 'login' }));
  };

  const navLinks = [
    { name: 'Home', href: '/', isLink: true },
    { name: 'About', href: '/about', isLink: true },
    { name: 'Chat', href: '/chat', isLink: true },
    { name: 'Templates', href: '/templates', isLink: true },
    { name: 'Resources', href: '/resources', isLink: true },
    { name: 'FAQ', href: '/faq', isLink: true },
  ];

  // Add role-specific nav items
  if (role === 'lawyer' || role === 'admin') {
    navLinks.push({ name: 'Submit Template', href: '#', isLink: false });
  }
  if (role === 'admin') {
    navLinks.push({ name: 'Admin Dashboard', href: '#', isLink: false });
  }

  const getUserInitials = () => {
    switch (role) {
      case 'user': return 'RU';
      case 'lawyer': return 'VL';
      case 'admin': return 'AD';
      default: return 'G';
    }
  };

  const getQuotaText = () => {
    if (role === 'guest') {
      return `Quota: ${quota.uploadsRemaining}/${quota.uploadsTotal}`;
    }
    return `Quota: ${quota.uploadsRemaining}/${quota.uploadsTotal}`;
  };

  const renderRightSection = () => {
    if (!user) {
      return (
        <div className="flex items-center space-x-4">
          <RouterLink to="/login" className="text-primary font-medium">Login</RouterLink>
          <RouterLink to="/register" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold">Register</RouterLink>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        {/* Quota chip */}
        <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          {getQuotaText()}
        </div>
        
        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            {showVerifiedBadge && (
              <CheckCircle className="w-4 h-4 text-accent" />
            )}
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {getUserInitials()}
            </div>
            <User className="w-4 h-4" />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                <User className="w-4 h-4 mr-3" />
                Profile
              </Link>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <History className="w-4 h-4 mr-3" />
                History
              </a>
              <Link to="/templates" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                <FileText className="w-4 h-4 mr-3" />
                Templates
              </Link>
              <hr className="my-2" />
              <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">⚖️</span>
              <span className="text-xl font-bold text-primary">LawAssist</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isLink ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center">
            {renderRightSection()}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {navLinks.map((link) => (
                link.isLink ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-gray-700 hover:text-primary font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-gray-700 hover:text-primary font-medium py-2"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="pt-4 border-t border-gray-200">
                {renderRightSection()}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal removed in favor of dedicated pages */}
    </nav>
  );
};

export default NavBar;