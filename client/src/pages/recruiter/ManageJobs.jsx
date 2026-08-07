import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { jobService } from '../../services/jobService';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Briefcase, Edit, Trash2, Users, Eye, PlusSquare, PauseCircle, PlayCircle } from 'lucide-react';

export const ManageJobs = () => {
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getRecruiterJobs();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await jobService.updateJob(jobId, { status: nextStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: nextStatus } : j))
      );
      addToast(`Job status updated to ${nextStatus}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteJobId) return;
    try {
      setDeleting(true);
      await jobService.deleteJob(deleteJobId);
      setJobs((prev) => prev.filter((j) => j._id !== deleteJobId));
      addToast('Job listing removed', 'info');
      setDeleteJobId(null);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Job Listings</h1>
              <p className="text-xs text-gray-500">Edit active job posts, pause recruitment, or review applicants</p>
            </div>
            <Link to="/recruiter/post-job">
              <Button icon={PlusSquare}>Post New Job</Button>
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 py-6">Loading job listings...</p>
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="glass-card rounded-2xl p-5 border flex flex-col md:flex-row justify-between md:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{job.title}</h3>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          job.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {job.location} • {job.workMode} • {job.jobType} • Created on {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                      <Button size="sm" variant="outline" icon={Users}>
                        Applicants ({job.applicationsCount || 0})
                      </Button>
                    </Link>

                    <button
                      onClick={() => handleStatusToggle(job._id, job.status)}
                      className="p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-dark-hover"
                      title={job.status === 'active' ? 'Pause Listing' : 'Activate Listing'}
                    >
                      {job.status === 'active' ? <PauseCircle className="w-5 h-5 text-amber-500" /> : <PlayCircle className="w-5 h-5 text-emerald-500" />}
                    </button>

                    <button
                      onClick={() => navigate(`/recruiter/post-job?edit=${job._id}`)}
                      className="p-2 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-dark-hover"
                      title="Edit Job Listing"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setDeleteJobId(job._id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete Job"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-500">
              No job listings found. Click "Post New Job" to list your first vacancy!
            </div>
          )}
        </main>
      </div>

      <ConfirmDialog
        isOpen={!!deleteJobId}
        onClose={() => setDeleteJobId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Listing"
        message="Are you sure you want to permanently delete this job listing? Applicants will no longer be able to view it."
        confirmText="Delete Job"
        isLoading={deleting}
      />
    </div>
  );
};
