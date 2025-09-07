import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-caption block">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 rounded-md bg-background border border-muted-300 text-body placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          className
        )}
        {...props}
      />
    </div>
  );
};