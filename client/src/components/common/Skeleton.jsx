import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md ${className}`}
    />
  );
};

export const JobCardSkeleton = () => (
  <div className="glass-card rounded-xl p-5 border flex flex-col gap-4">
    <div className="flex gap-3 items-center">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    </div>
    <Skeleton className="w-full h-10" />
    <div className="flex gap-2">
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-20 h-6 rounded-full" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-28 h-9 rounded-lg" />
    </div>
  </div>
);
