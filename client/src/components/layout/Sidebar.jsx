import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Bookmark,
  Briefcase,
  PlusSquare,
  Building2,
  Users,
  ShieldCheck,
  Settings,
} from 'lucide-react';

export const Sidebar = () => {
  const { role } = useAuth();

  const candidateLinks = [
    { to: '/candidate/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/profile-settings', label: 'My Account & Profile', icon: User },
    { to: '/candidate/applications', label: 'My Applications', icon: FileText },
    { to: '/candidate/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/recruiter/manage-jobs', label: 'Manage Jobs', icon: Briefcase },
    { to: '/recruiter/post-job', label: 'Post a Job', icon: PlusSquare },
    { to: '/recruiter/company-profile', label: 'Company Profile', icon: Building2 },
    { to: '/profile-settings', label: 'Recruiter Account', icon: Settings },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Moderation', icon: Users },
    { to: '/admin/jobs', label: 'Job Moderation', icon: Briefcase },
    { to: '/admin/companies', label: 'Company Moderation', icon: Building2 },
    { to: '/profile-settings', label: 'Admin Account', icon: Settings },
  ];

  let links = candidateLinks;
  if (role === 'recruiter') links = recruiterLinks;
  if (role === 'admin') links = adminLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="glass-card rounded-2xl p-4 sticky top-20 flex flex-col gap-2">
        <div className="px-3 py-2">
          <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
            {role} Portal
          </p>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-brand text-white shadow-md shadow-brand-500/20'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
