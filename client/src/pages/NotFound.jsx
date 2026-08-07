import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 gap-4">
      <h1 className="text-8xl font-black text-gradient">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h2>
      <p className="text-sm text-gray-500 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="mt-2">
        <Button icon={Home} size="lg">
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
};
