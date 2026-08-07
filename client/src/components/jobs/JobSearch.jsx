import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../common/Button';

export const JobSearch = ({ keyword, location, onKeywordChange, onLocationChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-2.5 sm:p-3 border shadow-xl max-w-4xl w-full flex flex-col md:flex-row gap-2.5"
    >
      <div className="flex-1 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-dark-border">
        <Search className="w-5 h-5 text-brand-500 shrink-0" />
        <input
          type="text"
          placeholder="Job title, skills, or keywords..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="w-full text-sm bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </div>

      <div className="flex-1 flex items-center gap-3 px-3 py-2">
        <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
        <input
          type="text"
          placeholder="Bengaluru, Mumbai, Delhi NCR, or Remote..."
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full text-sm bg-transparent focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto font-semibold">
        Search Jobs
      </Button>
    </form>
  );
};
