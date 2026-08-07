import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Briefcase, Bookmark, BookmarkCheck, Clock, Building2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { candidateService } from '../../services/candidateService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const JobCard = ({ job, isSaved: initialSaved = false, onSaveToggle }) => {
  const { user, role } = useAuth();
  const { addToast } = useNotification();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Please login as a candidate to save jobs', 'warning');
      return;
    }

    if (role !== 'candidate') {
      addToast('Only candidate accounts can save jobs', 'warning');
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await candidateService.unsaveJob(job._id);
        setIsSaved(false);
        addToast('Job removed from saved list', 'info');
      } else {
        await candidateService.saveJob(job._id);
        setIsSaved(true);
        addToast('Job saved successfully!', 'success');
      }
      if (onSaveToggle) onSaveToggle(job._id, !isSaved);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const companyLogo = job.company?.logo?.url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200';
  const companyName = job.company?.name || 'Partner Company';

  return (
    <Link to={`/jobs/${job._id}`} className="group block">
      <div className="glass-card rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:border-brand-500/40 relative flex flex-col justify-between h-full gap-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3.5 items-center">
            <img
              src={companyLogo}
              alt={companyName}
              className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-dark-border p-1 bg-white"
            />
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                {companyName}
              </p>
            </div>
          </div>

          {/* Bookmark Action */}
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className="p-2 rounded-xl text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
            title={isSaved ? 'Unsave Job' : 'Save Job'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-brand-600 fill-brand-600" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Location & Details Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="primary" size="sm">
            <Briefcase className="w-3 h-3 mr-1" />
            {job.workMode}
          </Badge>
          <Badge variant="default" size="sm">
            {job.jobType}
          </Badge>
          <Badge variant="purple" size="sm">
            {job.experienceLevel}
          </Badge>
        </div>

        {/* Skills Preview */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-dark-hover text-gray-600 dark:text-gray-300"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] text-gray-400 px-1 py-0.5">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer info: Salary & Time */}
        <div className="pt-3 border-t border-gray-100 dark:border-dark-border flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-gray-100">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            {job.salaryMin > 0 ? (
              <span>
                {formatCurrency(job.salaryMin, job.salaryCurrency)} - {formatCurrency(job.salaryMax, job.salaryCurrency)}
              </span>
            ) : (
              <span>Salary Undisclosed</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(job.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
