import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { applicationService } from '../../services/applicationService';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../components/common/Badge';
import { STATUS_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { FileText, Bookmark, CheckCircle2, User, ArrowRight, Building2 } from 'lucide-react';

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const apps = await applicationService.getCandidateApplications();
      const saved = await candidateService.getSavedJobs();
      const prof = await candidateService.getProfile();

      setApplications(apps || []);
      setSavedJobs(saved || []);
      setProfile(prof || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shortlistedCount = applications.filter((a) => ['Shortlisted', 'Interview', 'Hired'].includes(a.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {user?.name || 'Candidate'} 👋
              </h1>
              <p className="text-xs text-gray-500 mt-1">Track your job applications and saved listings</p>
            </div>
            <Link
              to="/candidate/profile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 font-semibold text-xs border border-brand-200"
            >
              <User className="w-4 h-4" /> Edit Profile
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Applied Jobs</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{applications.length}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Shortlisted / Interviews</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{shortlistedCount}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-xl">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Saved Jobs</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{savedJobs.length}</p>
              </div>
            </div>
          </div>

          {/* Recent Applications List */}
          <div className="glass-card rounded-2xl p-6 border space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-dark-border">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Recent Applications</h2>
              <Link to="/candidate/applications" className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500 py-4">Loading application history...</p>
            ) : applications.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {applications.slice(0, 4).map((app) => (
                  <div key={app._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.job?.company?.logo?.url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'}
                        alt="Company"
                        className="w-10 h-10 rounded-xl object-cover border p-1 bg-white"
                      />
                      <div>
                        <Link to={`/jobs/${app.job?._id}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-600">
                          {app.job?.title || 'Position'}
                        </Link>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {app.job?.company?.name || 'Company'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        {formatDate(app.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 py-6">You haven't submitted any job applications yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
