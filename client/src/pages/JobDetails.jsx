import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { candidateService } from '../services/candidateService';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Send,
  FileText,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ArrowLeft,
  Upload,
} from 'lucide-react';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { addToast } = useNotification();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState(null);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    if (user && role === 'candidate') {
      fetchCandidateInfo();
    }
  }, [user, role]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobById(id);
      setJob(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateInfo = async () => {
    try {
      const profile = await candidateService.getProfile();
      setCandidateProfile(profile);

      // Check if user already applied to this job
      const apps = await applicationService.getCandidateApplications();
      const existing = apps.find((app) => app.job?._id === id || app.job === id);
      if (existing) {
        setHasApplied(true);
      }
    } catch (err) {}
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login as a candidate to apply', 'warning');
      navigate('/login');
      return;
    }

    if (role !== 'candidate') {
      addToast('Only candidate accounts can submit job applications', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', coverLetter);

      if (!useProfileResume && resumeFile) {
        formData.append('resume', resumeFile);
      }

      await applicationService.applyToJob(formData);
      addToast('Application submitted successfully!', 'success');
      setHasApplied(true);
      setApplyModalOpen(false);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col gap-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">Job Listing Not Found</h2>
        <Button onClick={() => navigate('/jobs')}>Return to Jobs Catalog</Button>
      </div>
    );
  }

  const company = job.company || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      {/* Main Job Banner Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-4 items-start">
          <img
            src={company.logo?.url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'}
            alt={company.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border p-1 bg-white"
          />
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <Link to={`/companies/${company._id}`} className="font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                <Building2 className="w-4 h-4" /> {company.name || 'Tech Company'}
              </Link>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="primary">{job.workMode}</Badge>
              <Badge variant="default">{job.jobType}</Badge>
              <Badge variant="purple">{job.experienceLevel}</Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col justify-center gap-3 shrink-0">
          {hasApplied ? (
            <div className="px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" /> Applied
            </div>
          ) : (
            <Button
              size="lg"
              icon={Send}
              onClick={() => setApplyModalOpen(true)}
              className="w-full font-semibold shadow-md"
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>

      {/* Grid Layout: Job Overview + Company Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Job Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl border flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium">Offered Salary</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                {job.salaryMin > 0 ? `${formatCurrency(job.salaryMin, job.salaryCurrency)} - ${formatCurrency(job.salaryMax, job.salaryCurrency)}` : 'Undisclosed'}
              </span>
            </div>
            <div className="glass-card p-4 rounded-xl border flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium">Job Type</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {job.jobType}
              </span>
            </div>
            <div className="glass-card p-4 rounded-xl border flex flex-col gap-1">
              <span className="text-xs text-gray-400 font-medium">Posted Date</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {formatDate(job.createdAt)}
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div className="glass-card rounded-2xl p-6 border space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Job Description</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Key Responsibilities</h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Qualifications */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Requirements & Qualifications</h2>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Required Technical Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, idx) => (
                  <Badge key={idx} variant="primary" size="md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Company Snapshot */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border flex flex-col gap-4 sticky top-20">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 pb-3 border-b border-gray-200 dark:border-dark-border">
              About {company.name || 'Company'}
            </h3>

            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4 leading-relaxed">
              {company.description || 'Leading employer committed to technological excellence and employee growth.'}
            </p>

            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Industry:</span>
                <span className="font-medium">{company.industry || 'Technology'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Company Size:</span>
                <span className="font-medium">{company.companySize || '50-200'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="font-medium">{company.location || 'Global'}</span>
              </div>
            </div>

            {company._id && (
              <Link to={`/companies/${company._id}`} className="mt-2">
                <Button variant="outline" className="w-full text-xs">
                  View Company Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply to ${job.title}`}
      >
        <form onSubmit={handleApplySubmit} className="flex flex-col gap-5">
          {/* Candidate Profile Resume option vs Custom File */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Resume Submission
            </label>

            {candidateProfile?.resume?.url ? (
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={useProfileResume}
                    onChange={() => setUseProfileResume(true)}
                    className="text-brand-600"
                  />
                  Use profile resume: <span className="font-semibold">{candidateProfile.resume.fileName || 'Resume.pdf'}</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    checked={!useProfileResume}
                    onChange={() => setUseProfileResume(false)}
                    className="text-brand-600"
                  />
                  Upload a new resume file (PDF/DOC)
                </label>
              </div>
            ) : (
              <p className="text-xs text-amber-600">
                No resume saved on your profile. Please upload a resume below.
              </p>
            )}

            {(!useProfileResume || !candidateProfile?.resume?.url) && (
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  required={!useProfileResume || !candidateProfile?.resume?.url}
                />
              </div>
            )}
          </div>

          {/* Cover Letter Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cover Letter / Message to Recruiter (Optional)
            </label>
            <textarea
              rows={5}
              placeholder="Introduce yourself and explain why you're a great fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting} icon={Send}>
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
