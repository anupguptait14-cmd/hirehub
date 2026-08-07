import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationService } from '../../services/notificationService';
import { getImageUrl } from '../../utils/formatters';
import {
  Briefcase,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Building2,
  Bookmark,
  FileText,
  PlusSquare,
  ShieldCheck,
  Users,
  Settings,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, role } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      // Silent error
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'recruiter') return '/recruiter/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gradient tracking-tight">HireHub</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/jobs"
              className={`text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                location.pathname === '/jobs' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              className={`text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400 ${
                location.pathname === '/companies' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Companies
            </Link>

            {role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`text-xs font-bold transition-all text-rose-600 dark:text-rose-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 hover:shadow-sm`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-500" /> Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-dark-bg" />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-xl border z-50 max-h-96 overflow-y-auto">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-dark-border">
                        <h4 className="text-sm font-semibold">Notifications</h4>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-dark-border">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`py-3 flex flex-col gap-1 text-xs ${
                                !n.isRead ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-500'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-brand-600 dark:text-brand-400">{n.title}</span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p>{n.message}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-xs text-gray-500 py-6">No notifications yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                  >
                    <img
                      src={getImageUrl(user.avatar?.url) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-dark-border"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-2 shadow-xl border z-50">
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-dark-border">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile-settings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-emerald-500" />
                          My Account & Profile
                        </Link>

                        <Link
                          to={getDashboardLink()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                        >
                          <Building2 className="w-4 h-4 text-brand-500" />
                          Dashboard
                        </Link>

                        {role === 'candidate' && (
                          <>
                            <Link
                              to="/candidate/applications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                            >
                              <FileText className="w-4 h-4 text-indigo-500" />
                              Applications
                            </Link>
                            <Link
                              to="/candidate/saved-jobs"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                            >
                              <Bookmark className="w-4 h-4 text-amber-500" />
                              Saved Jobs
                            </Link>
                          </>
                        )}

                        {role === 'recruiter' && (
                          <>
                            <Link
                              to="/recruiter/post-job"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                            >
                              <PlusSquare className="w-4 h-4 text-brand-500" />
                              Post a Job
                            </Link>
                            <Link
                              to="/recruiter/company-profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                            >
                              <Building2 className="w-4 h-4 text-purple-500" />
                              Company Profile
                            </Link>
                          </>
                        )}

                        {role === 'admin' && (
                          <>
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors font-semibold"
                            >
                              <ShieldCheck className="w-4 h-4 text-rose-500" />
                              Admin Dashboard
                            </Link>
                            <Link
                              to="/admin/users"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-xl transition-colors"
                            >
                              <Users className="w-4 h-4 text-indigo-500" />
                              User Moderation
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="pt-1 border-t border-gray-100 dark:border-dark-border">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-gradient-brand text-white rounded-lg shadow-md shadow-brand-500/20 hover:shadow-lg transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user && (
              <Link to="/profile-settings" className="p-1">
                <img
                  src={user.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-brand-500"
                />
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Responsive Touch Drawer) */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-base font-medium text-gray-700 dark:text-gray-200"
          >
            <Briefcase className="w-4 h-4 text-brand-500" /> Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-base font-medium text-gray-700 dark:text-gray-200"
          >
            <Building2 className="w-4 h-4 text-purple-500" /> Companies Directory
          </Link>

          {role === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 py-2 text-base font-bold text-rose-600 dark:text-rose-400"
            >
              <ShieldCheck className="w-4 h-4 text-rose-500" /> Admin Dashboard
            </Link>
          )}

          {user ? (
            <div className="pt-3 border-t border-gray-200 dark:border-dark-border space-y-2">
              <div className="px-1 py-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 text-sm font-semibold text-brand-600 dark:text-brand-400"
              >
                <Building2 className="w-4 h-4" /> {role?.toUpperCase()} Dashboard
              </Link>
              <Link
                to="/profile-settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                <Settings className="w-4 h-4 text-emerald-500" /> Account & Profile Settings
              </Link>

              {role === 'candidate' && (
                <>
                  <Link
                    to="/candidate/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    <FileText className="w-4 h-4 text-indigo-500" /> My Applications
                  </Link>
                  <Link
                    to="/candidate/saved-jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    <Bookmark className="w-4 h-4 text-amber-500" /> Saved Jobs
                  </Link>
                </>
              )}

              {role === 'recruiter' && (
                <>
                  <Link
                    to="/recruiter/post-job"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    <PlusSquare className="w-4 h-4 text-brand-500" /> Post a Job
                  </Link>
                  <Link
                    to="/recruiter/manage-jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    <Briefcase className="w-4 h-4 text-purple-500" /> Manage Posted Jobs
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2.5 py-2.5 text-sm font-semibold text-rose-600"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 dark:border-dark-border flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-gray-300 dark:border-dark-border text-sm font-semibold"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold shadow-md"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
