import React from 'react';
import { FormFieldValidation } from './form-validation';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  options: RadioOption[];
  error?: string;
  touched?: boolean;
  success?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  radioClassName?: string;
  onChange?: (value: string) => void;
}

export const FormRadio = React.forwardRef<HTMLInputElement, FormRadioProps>(
  (
    {
      label,
      options,
      error,
      touched,
      success,
      helperText,
      containerClassName = '',
      labelClassName = '',
      radioClassName = '',
      className = '',
      onChange,
      ...props
    },
    ref
  ) => {
    const radioGroupId = props.id || props.name || `radio-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value);
      }
    };

    return (
      <div className={`space-y-1 ${containerClassName}`}>
        {label && (
          <label
            className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <div className="space-y-2">
          {options.map((option) => {
            const optionId = `${radioGroupId}-${option.value}`;
            return (
              <div key={option.value} className="flex items-center">
                <input
                  ref={ref}
                  type="radio"
                  id={optionId}
                  name={radioGroupId}
                  value={option.value}
                  onChange={handleChange}
                  disabled={option.disabled || props.disabled}
                  className={`
                    h-4 w-4
                    ${error && touched
                      ? 'text-red-600 focus:ring-red-500'
                      : success
                      ? 'text-green-600 focus:ring-green-500'
                      : 'text-blue-600 focus:ring-blue-500'
                    }
                    border-gray-300 dark:border-gray-600
                    focus:ring-2
                    ${option.disabled || props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${radioClassName}
                    ${className}
                  `}
                  {...props}
                />
                <label
                  htmlFor={optionId}
                  className={`
                    ml-3 text-sm
                    ${error && touched
                      ? 'text-red-700 dark:text-red-400'
                      : success
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-gray-700 dark:text-gray-200'
                    }
                    ${option.disabled || props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
        <FormFieldValidation
          error={error}
          touched={touched}
          success={success}
          helperText={helperText}
        />
      </div>
    );
  }
);

FormRadio.displayName = 'FormRadio'; 