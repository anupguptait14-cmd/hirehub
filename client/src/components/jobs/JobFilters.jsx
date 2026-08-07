import React from 'react';
import { WORK_MODES, JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';

export const JobFilters = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="glass-card rounded-2xl p-5 border flex flex-col gap-5 sticky top-20">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <Filter className="w-4 h-4 text-brand-500" />
          Filter Jobs
        </div>
        <button
          onClick={onReset}
          className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Work Mode */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Work Mode
        </label>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="radio"
              name="workMode"
              checked={!filters.workMode}
              onChange={() => handleChange('workMode', '')}
              className="text-brand-600 focus:ring-brand-500"
            />
            All Modes
          </label>
          {WORK_MODES.map((mode) => (
            <label key={mode} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="radio"
                name="workMode"
                checked={filters.workMode === mode}
                onChange={() => handleChange('workMode', mode)}
                className="text-brand-600 focus:ring-brand-500"
              />
              {mode}
            </label>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Job Type
        </label>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="radio"
              name="jobType"
              checked={!filters.jobType}
              onChange={() => handleChange('jobType', '')}
              className="text-brand-600 focus:ring-brand-500"
            />
            All Types
          </label>
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="radio"
                name="jobType"
                checked={filters.jobType === type}
                onChange={() => handleChange('jobType', type)}
                className="text-brand-600 focus:ring-brand-500"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Experience Level
        </label>
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="radio"
              name="experienceLevel"
              checked={!filters.experienceLevel}
              onChange={() => handleChange('experienceLevel', '')}
              className="text-brand-600 focus:ring-brand-500"
            />
            All Levels
          </label>
          {EXPERIENCE_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="radio"
                name="experienceLevel"
                checked={filters.experienceLevel === level}
                onChange={() => handleChange('experienceLevel', level)}
                className="text-brand-600 focus:ring-brand-500"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      {/* Min Salary Input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Min Salary (₹/year)
        </label>
        <input
          type="number"
          placeholder="e.g. 1200000 (12 LPA)"
          value={filters.minSalary || ''}
          onChange={(e) => handleChange('minSalary', e.target.value)}
          className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
};
