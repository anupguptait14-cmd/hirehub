import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-md">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gradient">HireHub</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The premier recruitment platform connecting high-caliber candidates with leading global companies.
            </p>
          </div>

          {/* Candidates */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Candidates</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link to="/candidate/profile" className="text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors">
                  Candidate Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Employers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/recruiter/post-job" className="text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recruiter/company-profile" className="text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors">
                  Company Branding
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} HireHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision and passion</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
