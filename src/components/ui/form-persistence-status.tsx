import React from 'react';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface FormPersistenceStatusProps {
  lastSaved?: Date;
  isSaving?: boolean;
  error?: string;
  className?: string;
}

export const FormPersistenceStatus: React.FC<FormPersistenceStatusProps> = ({
  lastSaved,
  isSaving,
  error,
  className = ''
}) => {
  if (!lastSaved && !isSaving && !error) return null;

  const getStatusText = () => {
    if (error) return 'Error saving';
    if (isSaving) return 'Saving...';
    if (lastSaved) {
      const now = new Date();
      const diff = now.getTime() - lastSaved.getTime();
      const seconds = Math.floor(diff / 1000);
      
      if (seconds < 60) return `Saved ${seconds} seconds ago`;
      if (seconds < 3600) return `Saved ${Math.floor(seconds / 60)} minutes ago`;
      return `Saved ${Math.floor(seconds / 3600)} hours ago`;
    }
    return '';
  };

  const getStatusIcon = () => {
    if (error) {
      return (
        <ExclamationCircleIcon
          className="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
      );
    }
    if (isSaving) {
      return (
        <ClockIcon
          className="h-5 w-5 text-blue-500 animate-spin"
          aria-hidden="true"
        />
      );
    }
    if (lastSaved) {
      return (
        <CheckCircleIcon
          className="h-5 w-5 text-green-500"
          aria-hidden="true"
        />
      );
    }
    return null;
  };

  return (
    <div
      className={`
        flex items-center space-x-2 text-sm
        ${error
          ? 'text-red-600 dark:text-red-400'
          : isSaving
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-green-600 dark:text-green-400'
        }
        ${className}
      `}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}; 