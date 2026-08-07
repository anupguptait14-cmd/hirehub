import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { JobSearch } from '../components/jobs/JobSearch';
import { JobCard } from '../components/jobs/JobCard';
import { JobCardSkeleton } from '../components/common/Skeleton';
import { jobService } from '../services/jobService';
import { companyService } from '../services/companyService';
import {
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  Code2,
  Palette,
  LineChart,
  Megaphone,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const jobsData = await jobService.getJobs({ limit: 6 });
      const companiesData = await companyService.getCompanies({ limit: 4 });
      setFeaturedJobs(jobsData.jobs || []);
      setFeaturedCompanies(companiesData.companies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (location) query.set('location', location);
    navigate(`/jobs?${query.toString()}`);
  };

  const categories = [
    { title: 'Software Engineering', count: '140+ Jobs', icon: Code2, color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/40' },
    { title: 'UI/UX & Product Design', count: '85+ Jobs', icon: Palette, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
    { title: 'Data & Analytics', count: '60+ Jobs', icon: LineChart, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { title: 'Marketing & Sales', count: '90+ Jobs', icon: Megaphone, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-brand-50/50 via-transparent to-transparent dark:from-brand-950/20">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 animate-fade-in">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Over 2,500+ Top Companies Hiring Today</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight max-w-4xl leading-tight">
            Find Your Dream Career & <span className="text-gradient">Connect with Industry Leaders</span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            HireHub connects talented professionals with innovative startups and Fortune 500 enterprises. Explore high-paying remote, hybrid, and on-site opportunities.
          </p>

          {/* Hero Search Box */}
          <JobSearch
            keyword={keyword}
            location={location}
            onKeywordChange={setKeyword}
            onLocationChange={setLocation}
            onSearch={handleSearch}
          />

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-gray-200/60 dark:border-dark-border w-full max-w-4xl">
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">12,500+</p>
              <p className="text-xs text-gray-500 font-medium">Active Candidates</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">3,400+</p>
              <p className="text-xs text-gray-500 font-medium">Verified Job Posts</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">98%</p>
              <p className="text-xs text-gray-500 font-medium">Placement Rate</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">450+</p>
              <p className="text-xs text-gray-500 font-medium">Global Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Popular Categories</h2>
            <p className="text-sm text-gray-500">Explore jobs by specialized industry domains</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?keyword=${encodeURIComponent(cat.title.split(' ')[0])}`)}
                className="glass-card rounded-2xl p-6 border cursor-pointer hover:-translate-y-1 transition-all flex flex-col gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{cat.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">{cat.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Job Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Featured Job Openings</h2>
            <p className="text-sm text-gray-500">Hand-picked premium positions from top verified employers</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            Explore All Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Companies */}
      {featuredCompanies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Top Hiring Companies</h2>
              <p className="text-sm text-gray-500">Discover company cultures, benefit packages, and active openings</p>
            </div>
            <Link to="/companies" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              Browse Companies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCompanies.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="glass-card rounded-2xl p-5 border text-center flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform"
              >
                <img
                  src={company.logo?.url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'}
                  alt={company.name}
                  className="w-16 h-16 rounded-2xl object-cover border p-1 bg-white"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{company.name}</h3>
                  <p className="text-xs text-gray-500">{company.industry}</p>
                </div>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">{company.location}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Dual CTA Cards (Candidate vs Recruiter) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Candidates */}
          <div className="glass-card rounded-3xl p-8 border bg-gradient-to-br from-brand-500/10 to-transparent flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">For Job Seekers</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Build Your Professional Profile & Land Your Next Role</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload your resume, showcase skills, bookmark favorite jobs, and track your application status in real-time.
              </p>
            </div>
            <Link
              to="/register?role=candidate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-white font-semibold text-sm shadow-md hover:shadow-lg w-fit"
            >
              Create Candidate Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* For Recruiters */}
          <div className="glass-card rounded-3xl p-8 border bg-gradient-to-br from-purple-500/10 to-transparent flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">For Employers</span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hire Top Talent Faster with Smart Recruitment Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Post job listings, manage applicant pipelines, review resumes, and coordinate interview stages effortlessly.
              </p>
            </div>
            <Link
              to="/register?role=recruiter"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-lg w-fit"
            >
              Start Hiring Today <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
