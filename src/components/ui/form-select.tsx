import React from 'react';
import { useField } from 'formik';
import { FormFieldValidation } from './form-validation';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  name: string;
  label: string;
  options: Option[];
  error?: string;
  touched?: boolean;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  error,
  touched,
  success,
  helperText,
  leftIcon,
  containerClassName = '',
  labelClassName = '',
  selectClassName = '',
  className = '',
  ...props
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${labelClassName}`}
      >
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <select
          id={name}
          {...field}
          {...props}
          className={`
            block w-full rounded-md shadow-sm
            ${leftIcon ? 'pl-10' : 'pl-4'}
            pr-10 py-2
            border
            ${hasError
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : success
              ? 'border-green-300 text-green-900 placeholder-green-300 focus:ring-green-500 focus:border-green-500'
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-1
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none
            ${selectClassName}
            ${className}
          `}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {meta.error}
        </p>
      )}
      <FormFieldValidation
        error={error}
        touched={touched}
        success={success}
        helperText={helperText}
      />
    </div>
  );
};

FormSelect.displayName = 'FormSelect'; 