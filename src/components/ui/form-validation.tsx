import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface FormValidationProps {
  error?: string;
  success?: string;
  showIcon?: boolean;
  className?: string;
}

interface FormFieldValidationProps extends FormValidationProps {
  touched?: boolean;
  helperText?: string;
}

export const FormValidation: React.FC<FormValidationProps> = ({
  error,
  success,
  showIcon = true,
  className = ''
}) => {
  if (!error && !success) return null;

  return (
    <div
      className={`
        flex items-center space-x-2 text-sm
        ${error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
        ${className}
      `}
    >
      {showIcon && (
        error ? (
          <XCircleIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
        )
      )}
      <span>{error || success}</span>
    </div>
  );
};

export const FormFieldValidation: React.FC<FormFieldValidationProps> = ({
  error,
  touched,
  success,
  helperText,
  showIcon = true,
  className = ''
}) => {
  if (!touched && !error && !success && !helperText) return null;

  return (
    <div className="mt-1">
      {error && touched && (
        <FormValidation error={error} showIcon={showIcon} className={className} />
      )}
      {success && (
        <FormValidation success={success} showIcon={showIcon} className={className} />
      )}
      {helperText && !error && !success && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}; 