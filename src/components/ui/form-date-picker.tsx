import React, { useState, useRef, useEffect } from 'react';
import { useField } from 'formik';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format, parse, isValid } from 'date-fns';

interface FormDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
  format?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  error,
  touched,
  format: dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  className = '',
  ...props
}) => {
  const [field, meta] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const hasError = meta.touched && meta.error;

  useEffect(() => {
    if (field.value) {
      const parsedDate = parse(field.value, dateFormat, new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      }
    }
  }, [field.value, dateFormat]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = format(date, dateFormat);
    field.onChange({
      target: {
        name: field.name,
        value: formattedDate
      }
    });
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    if (!selectedDate) return [];
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <div className="relative" ref={calendarRef}>
        <div className="relative">
          <input
            id={name}
            type="text"
            {...field}
            {...props}
            className={`
              block w-full rounded-md shadow-sm
              pl-4 pr-10 py-2
              border
              ${hasError
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              }
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-1
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            onClick={() => setIsOpen(true)}
            readOnly
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    {day}
                  </div>
                ))}
                {calendarDays.map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => date && handleDateSelect(date)}
                    disabled={!date || (minDate && date < minDate) || (maxDate && date > maxDate)}
                    className={`
                      h-8 w-8 rounded-full text-sm
                      ${!date
                        ? 'cursor-default'
                        : date.getTime() === selectedDate?.getTime()
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }
                      ${(minDate && date && date < minDate) || (maxDate && date && date > maxDate)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                      }
                    `}
                  >
                    {date?.getDate()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {meta.error}
        </p>
      )}
    </div>
  );
}; 