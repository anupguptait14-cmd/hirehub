import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobSearch } from '../components/jobs/JobSearch';
import { JobCardSkeleton } from '../components/common/Skeleton';
import { Pagination } from '../components/common/Pagination';
import { jobService } from '../services/jobService';
import { Briefcase, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [filters, setFilters] = useState({
    workMode: searchParams.get('workMode') || '',
    jobType: searchParams.get('jobType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    minSalary: searchParams.get('minSalary') || '',
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: searchParams.get('page') || 1,
        limit: 9,
      };

      if (searchParams.get('keyword')) params.keyword = searchParams.get('keyword');
      if (searchParams.get('location')) params.location = searchParams.get('location');
      if (searchParams.get('workMode')) params.workMode = searchParams.get('workMode');
      if (searchParams.get('jobType')) params.jobType = searchParams.get('jobType');
      if (searchParams.get('experienceLevel')) params.experienceLevel = searchParams.get('experienceLevel');
      if (searchParams.get('minSalary')) params.minSalary = searchParams.get('minSalary');

      const data = await jobService.getJobs(params);
      setJobs(data.jobs || []);
      setTotalPages(data.pages || 1);
      setTotalJobs(data.total || 0);
      setPage(data.page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyParams = (newFilters, newKeyword, newLocation, newPage = 1) => {
    const params = new URLSearchParams();
    if (newKeyword) params.set('keyword', newKeyword);
    if (newLocation) params.set('location', newLocation);
    if (newFilters.workMode) params.set('workMode', newFilters.workMode);
    if (newFilters.jobType) params.set('jobType', newFilters.jobType);
    if (newFilters.experienceLevel) params.set('experienceLevel', newFilters.experienceLevel);
    if (newFilters.minSalary) params.set('minSalary', newFilters.minSalary);
    if (newPage > 1) params.set('page', newPage.toString());

    setSearchParams(params);
  };

  const handleSearch = () => {
    applyParams(filters, keyword, location, 1);
  };

  const handleFilterChange = (updatedFilters) => {
    setFilters(updatedFilters);
    applyParams(updatedFilters, keyword, location, 1);
  };

  const handleResetFilters = () => {
    const reset = { workMode: '', jobType: '', experienceLevel: '', minSalary: '' };
    setFilters(reset);
    setKeyword('');
    setLocation('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    applyParams(filters, keyword, location, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Explore Job Listings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Found {totalJobs} active position{totalJobs === 1 ? '' : 's'} matching your criteria
          </p>
        </div>

        <JobSearch
          keyword={keyword}
          location={location}
          onKeywordChange={setKeyword}
          onLocationChange={setLocation}
          onSearch={handleSearch}
        />
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Button & Drawer */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(true)}
            icon={SlidersHorizontal}
            className="w-full"
          >
            Filters & Refinements
          </Button>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
              <div className="w-full max-w-xs bg-white dark:bg-dark-card h-full p-5 overflow-y-auto flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-dark-border">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <JobFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          )}
        </div>

        {/* Job Listings Grid */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 dark:bg-dark-hover rounded-full text-gray-400">
                <Briefcase className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">No Jobs Found</h3>
              <p className="text-sm text-gray-500 max-w-md">
                We couldn't find any job listings matching your search filters. Try resetting filters or adjusting search keywords.
              </p>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset Search Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
