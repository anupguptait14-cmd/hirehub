import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { jobService } from '../../services/jobService';
import { recruiterService } from '../../services/recruiterService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Briefcase, Users, PlusSquare, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const jobsData = await jobService.getRecruiterJobs();
      const profData = await recruiterService.getProfile();
      setJobs(jobsData || []);
      setProfile(profData || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeJobs = jobs.filter((j) => j.status === 'active').length;
  const totalApplicants = jobs.reduce((acc, curr) => acc + (curr.applicationsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Recruiter Portal 👋
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {profile?.company?.name ? `Hiring for ${profile.company.name}` : 'Setup company profile to start hiring'}
              </p>
            </div>
            <Link to="/recruiter/post-job">
              <Button icon={PlusSquare} className="font-semibold shadow-md">
                Post New Job
              </Button>
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3.5 bg-brand-50 dark:bg-brand-950/40 text-brand-600 rounded-xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Active Job Posts</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{activeJobs}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Applicants Received</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{totalApplicants}</p>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Company Profile</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {profile?.company?.name || 'Not Configured'}
                </p>
              </div>
            </div>
          </div>

          {/* Posted Jobs Management Overview */}
          <div className="glass-card rounded-2xl p-6 border space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-dark-border">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Active Job Listings</h2>
              <Link to="/recruiter/manage-jobs" className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1">
                Manage All Jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500 py-4">Loading job listings...</p>
            ) : jobs.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job._id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{job.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {job.location} • {job.workMode} • {job.jobType}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                        {job.applicationsCount || 0} Applicants
                      </span>
                      <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                        <Button size="sm" variant="outline">
                          View Applicants
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-gray-500">You haven't posted any job listings yet.</p>
                <Link to="/recruiter/post-job">
                  <Button icon={PlusSquare}>Post Your First Job</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
