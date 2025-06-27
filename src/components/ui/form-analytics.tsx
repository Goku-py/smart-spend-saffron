import React from 'react';
import { FormAnalyticsData } from '@/hooks/useFormAnalytics';
import {
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface FormAnalyticsProps {
  data: FormAnalyticsData;
  className?: string;
}

export const FormAnalytics: React.FC<FormAnalyticsProps> = ({
  data,
  className = ''
}) => {
  const totalInteractions = Object.values(data.fieldInteractions).reduce(
    (sum, count) => sum + count,
    0
  );

  const totalErrors = Object.values(data.errors).reduce(
    (sum, count) => sum + count,
    0
  );

  const completionRate = data.completionTime
    ? Math.round((data.events.filter(e => e.type === 'complete').length / data.events.length) * 100)
    : 0;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Form Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Interactions
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {totalInteractions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completion Time
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.completionTime
                  ? `${Math.round(data.completionTime / 1000)}s`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Errors
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {totalErrors}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completion Rate
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {completionRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Field Interactions
        </h4>
        <div className="space-y-2">
          {Object.entries(data.fieldInteractions)
            .sort(([, a], [, b]) => b - a)
            .map(([field, count]) => (
              <div
                key={field}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-2"
              >
                <span className="text-sm text-gray-900 dark:text-white">
                  {field}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {count} interactions
                </span>
              </div>
            ))}
        </div>
      </div>

      {totalErrors > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Field Errors
          </h4>
          <div className="space-y-2">
            {Object.entries(data.errors)
              .sort(([, a], [, b]) => b - a)
              .map(([field, count]) => (
                <div
                  key={field}
                  className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-2"
                >
                  <span className="text-sm text-red-900 dark:text-red-200">
                    {field}
                  </span>
                  <span className="text-sm font-medium text-red-500 dark:text-red-400">
                    {count} errors
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}; 