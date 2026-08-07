import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../services/companyService';
import { Building2, Search, MapPin, Users, ArrowRight } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Pagination } from '../components/common/Pagination';

export const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getCompanies({ keyword, page, limit: 12 });
      setCompanies(data.companies || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCompanies();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Browse Companies</h1>
        <p className="text-sm text-gray-500 mt-1">Discover leading organizations hiring tech talent</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="max-w-md flex gap-2">
        <Input
          placeholder="Search by company name, location..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          icon={Search}
        />
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
      ) : companies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((comp) => (
              <Link
                key={comp._id}
                to={`/companies/${comp._id}`}
                className="glass-card rounded-2xl p-6 border flex flex-col justify-between gap-4 hover:-translate-y-1 transition-all"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={comp.logo?.url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200'}
                    alt={comp.name}
                    className="w-14 h-14 rounded-2xl object-cover border p-1 bg-white"
                  />
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{comp.name}</h3>
                    <p className="text-xs text-gray-500">{comp.industry}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {comp.description}
                </p>

                <div className="pt-3 border-t border-gray-100 dark:border-dark-border flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> {comp.location}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400">
                    View Jobs <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center text-gray-500">
          No companies found matching your search.
        </div>
      )}
    </div>
  );
};
