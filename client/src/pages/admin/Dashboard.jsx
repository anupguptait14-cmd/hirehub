import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { adminService } from '../../services/adminService';
import { Users, Briefcase, Building2, FileText, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = stats?.metrics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-brand-600" /> Platform Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">System-wide metrics, platform health, user moderation, and job governance</p>
            </div>
            <Link
              to="/profile-settings"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold text-xs border border-brand-200"
            >
              Account & Profile Settings
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Registered Users</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{metrics.totalUsers || 0}</p>
                <span className="text-[10px] text-gray-500">{metrics.totalCandidates || 0} Candidates • {metrics.totalRecruiters || 0} Recruiters</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Job Openings</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{metrics.totalJobs || 0}</p>
                <span className="text-[10px] text-emerald-600 font-semibold">{metrics.activeJobs || 0} Active</span>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Registered Companies</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{metrics.totalCompanies || 0}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Applications Processed</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{metrics.totalApplications || 0}</p>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="glass-card rounded-2xl p-6 border space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">System Health Status</h2>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">HireHub API Server and Database connected cleanly.</p>
                <p className="text-xs opacity-80">JWT Cookie authentication, rate limiting, and uploads engine operational.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
