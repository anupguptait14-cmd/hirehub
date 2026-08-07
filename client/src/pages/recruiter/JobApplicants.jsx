import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { useNotification } from '../../context/NotificationContext';
import { APPLICATION_STATUSES, STATUS_COLORS } from '../../utils/constants';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Search, FileText, User, Mail, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';

export const JobApplicants = () => {
  const { jobId } = useParams();
  const { addToast } = useNotification();

  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Status Update modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchJobInfo();
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [jobId, statusFilter, search]);

  const fetchJobInfo = async () => {
    try {
      const data = await jobService.getJobById(jobId);
      setJob(data);
    } catch (err) {}
  };

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getJobApplications(jobId, {
        status: statusFilter,
        search,
      });
      setApplicants(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setInternalNote(app.notes || '');
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdating(true);
      await applicationService.updateStatus(selectedApp._id, {
        status: newStatus,
        note: internalNote,
      });

      addToast(`Status updated to ${newStatus}`, 'success');
      setSelectedApp(null);
      fetchApplicants();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <Link to="/recruiter/manage-jobs" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-brand-600 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs Management
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Applicants for "{job?.title || 'Job Listing'}"
            </h1>
            <p className="text-xs text-gray-500">Review candidate profiles, resumes, and progress through hiring pipeline</p>
          </div>

          {/* Search & Status Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search candidate by name or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={Search}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  !statusFilter
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300'
                }`}
              >
                All ({applicants.length})
              </button>
              {APPLICATION_STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    statusFilter === st
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Applicants List */}
          {loading ? (
            <p className="text-sm text-gray-500 py-6">Loading applicant pipeline...</p>
          ) : applicants.length > 0 ? (
            <div className="space-y-4">
              {applicants.map((app) => {
                const candidate = app.candidate || {};
                const candidateProf = app.candidateProfile || {};

                return (
                  <div key={app._id} className="glass-card rounded-2xl p-6 border space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex gap-4 items-start">
                        <img
                          src={candidate.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{candidate.name}</h3>
                          <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                            {candidateProf.headline || 'Candidate'}
                          </p>
                          <p className="text-xs text-gray-500">{candidate.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[app.status]}`}>
                          {app.status}
                        </span>
                        <Button size="sm" onClick={() => openUpdateModal(app)}>
                          Update Status
                        </Button>
                      </div>
                    </div>

                    {/* Candidate Skills Preview */}
                    {candidateProf.skills && candidateProf.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {candidateProf.skills.map((skill, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-dark-hover text-gray-600 dark:text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Cover Letter */}
                    {app.coverLetter && (
                      <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-dark-hover border text-xs text-gray-700 dark:text-gray-300 italic">
                        "{app.coverLetter}"
                      </div>
                    )}

                    {/* Resume & Notes Bar */}
                    <div className="pt-3 border-t border-gray-100 dark:border-dark-border flex flex-wrap items-center justify-between gap-3 text-xs">
                      {app.resume?.url ? (
                        <a
                          href={app.resume.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                        >
                          <FileText className="w-4 h-4" /> View Resume Document ({app.resume.fileName || 'PDF'})
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400">No resume attached</span>
                      )}

                      {app.notes && (
                        <span className="text-gray-500 font-medium">Internal Note: {app.notes}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-500">
              No applicants match this criteria.
            </div>
          )}
        </main>
      </div>

      {/* Update Application Status Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Update Applicant Pipeline Status"
      >
        <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Select Pipeline Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card font-semibold"
            >
              {APPLICATION_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Internal Recruiter Note (Optional)</label>
            <textarea
              rows={3}
              placeholder="e.g. Scheduled technical interview for Thursday at 2 PM..."
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setSelectedApp(null)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updating}>
              Save Status Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
