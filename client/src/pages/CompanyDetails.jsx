import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyService } from '../services/companyService';
import { JobCard } from '../components/jobs/JobCard';
import { Building2, MapPin, Globe, Users, Calendar } from 'lucide-react';

export const CompanyDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const res = await companyService.getCompanyById(id);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center">Loading company profile...</div>;
  }

  if (!data || !data.company) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center">Company profile not found.</div>;
  }

  const { company, jobs = [] } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Banner */}
      <div className="glass-card rounded-3xl p-8 border flex flex-col md:flex-row gap-6 items-start">
        <img
          src={company.logo?.url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'}
          alt={company.name}
          className="w-24 h-24 rounded-2xl object-cover border p-1 bg-white"
        />
        <div className="space-y-3 flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{company.name}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{company.description}</p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {company.location}</span>
            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {company.industry}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {company.companySize} employees</span>
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-600 hover:underline">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Open Positions at {company.name} ({jobs.length})
        </h2>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={{ ...job, company }} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-gray-500">
            No active job openings currently posted by this company.
          </div>
        )}
      </div>
    </div>
  );
};
