import React from 'react';
import { useField } from 'formik';

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  error,
  touched,
  className = '',
  ...props
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="space-y-1">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={name}
            type="checkbox"
            {...field}
            {...props}
            className={`
              h-4 w-4 rounded
              border
              ${hasError
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 text-blue-600 focus:border-blue-500 focus:ring-blue-500'
              }
              bg-white dark:bg-gray-800
              focus:outline-none focus:ring-1
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
          />
        </div>
        <div className="ml-3">
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {label}
          </label>
        </div>
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {meta.error}
        </p>
      )}
    </div>
  );
}; 