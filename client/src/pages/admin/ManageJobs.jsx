import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Briefcase, Building2, CheckCircle2, PauseCircle } from 'lucide-react';

export const ManageAdminJobs = () => {
  const { addToast } = useNotification();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      await adminService.updateJobStatus(jobId, newStatus);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
      );
      addToast(`Job status changed to ${newStatus}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Job Listing Moderation</h1>
            <p className="text-xs text-gray-500">Approve, pause, or remove job listings platform-wide</p>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 py-6">Loading job postings...</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="glass-card rounded-2xl p-5 border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{job.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> {job.company?.name || 'Company'} • Posted by {job.postedBy?.name || 'Recruiter'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={job.status}
                      onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                      <option value="pending">Pending Review</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
