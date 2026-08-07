import React from 'react';
import { clsx } from 'clsx';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={clsx(
        'glass-card rounded-xl p-5 border',
        hover && 'hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
