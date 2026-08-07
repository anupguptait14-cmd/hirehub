import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { applicationService } from '../../services/applicationService';
import { STATUS_COLORS, APPLICATION_STATUSES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { FileText, Building2, Clock, CheckCircle2, History } from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // History modal
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getCandidateApplications({
        status: statusFilter,
      });
      setApplications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Application History</h1>
            <p className="text-xs text-gray-500">Track application statuses and status update notes</p>
          </div>

          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-2 pb-2">
            <button
              onClick={() => setStatusFilter('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                !statusFilter
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300'
              }`}
            >
              All Applications ({applications.length})
            </button>
            {APPLICATION_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  statusFilter === status
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Applications List */}
          {loading ? (
            <p className="text-sm text-gray-500 py-6">Loading applications...</p>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="glass-card rounded-2xl p-5 border flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <img
                      src={app.job?.company?.logo?.url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'}
                      alt="Logo"
                      className="w-12 h-12 rounded-xl object-cover border p-1 bg-white"
                    />
                    <div className="space-y-1">
                      <Link to={`/jobs/${app.job?._id}`} className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-brand-600">
                        {app.job?.title || 'Position'}
                      </Link>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {app.job?.company?.name || 'Company'}
                      </p>
                      <p className="text-[11px] text-gray-400">Applied on {formatDate(app.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border w-fit ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>

                    <button
                      onClick={() => setSelectedApp(app)}
                      className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <History className="w-3.5 h-3.5" /> View Timeline & Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-500">
              No applications match this filter status.
            </div>
          )}
        </main>
      </div>

      {/* Timeline Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Status History"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-100 dark:border-dark-border">
              <h3 className="font-bold text-base">{selectedApp.job?.title}</h3>
              <p className="text-xs text-gray-500">{selectedApp.job?.company?.name}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-gray-400">Status History Timeline</h4>
              {selectedApp.statusHistory?.map((hist, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-600 mt-1" />
                    {idx < selectedApp.statusHistory.length - 1 && <span className="w-0.5 h-full bg-gray-200 dark:bg-dark-border" />}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{hist.status}</span>
                    <span className="text-gray-400 text-[10px] ml-2">{new Date(hist.updatedAt).toLocaleString()}</span>
                    {hist.note && <p className="text-gray-500 mt-0.5">{hist.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
