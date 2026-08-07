import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { candidateService } from '../../services/candidateService';
import { JobCard } from '../../components/jobs/JobCard';
import { Bookmark } from 'lucide-react';

export const CandidateSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getSavedJobs();
      setSavedJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (jobId) => {
    setSavedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Saved Job Listings</h1>
            <p className="text-xs text-gray-500">Bookmarked opportunities for future application</p>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 py-6">Loading saved jobs...</p>
          ) : savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((item) => (
                <JobCard
                  key={item._id}
                  job={item.job}
                  isSaved={true}
                  onSaveToggle={handleSaveToggle}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center text-gray-500 flex flex-col items-center gap-3">
              <Bookmark className="w-10 h-10 text-gray-400" />
              <p>You haven't bookmarked any jobs yet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
