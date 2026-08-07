import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import { Building2, MapPin } from 'lucide-react';

export const ManageCompanies = () => {
  const { addToast } = useNotification();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCompanies();
      setCompanies(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (companyId, newStatus) => {
    try {
      await adminService.updateCompanyStatus(companyId, newStatus);
      setCompanies((prev) =>
        prev.map((c) => (c._id === companyId ? { ...c, status: newStatus } : c))
      );
      addToast(`Company status updated to ${newStatus}`, 'success');
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Profile Governance</h1>
            <p className="text-xs text-gray-500">Approve or suspend registered company brands</p>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 py-6">Loading company profiles...</p>
          ) : (
            <div className="space-y-4">
              {companies.map((comp) => (
                <div key={comp._id} className="glass-card rounded-2xl p-5 border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={comp.logo?.url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'}
                      alt={comp.name}
                      className="w-12 h-12 rounded-xl object-cover border p-1 bg-white"
                    />
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{comp.name}</h3>
                      <p className="text-xs text-gray-500">
                        {comp.industry} • Created by {comp.createdBy?.name || 'Recruiter'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={comp.status}
                      onChange={(e) => handleUpdateStatus(comp._id, e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
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
