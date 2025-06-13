import React, { useState, useRef } from 'react';
import { useField } from 'formik';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FormFileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
  error?: string;
  touched?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  onFileSelect?: (files: File[]) => void;
}

export const FormFileUpload: React.FC<FormFileUploadProps> = ({
  name,
  label,
  error,
  touched,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  multiple = false,
  onFileSelect,
  className = '',
  ...props
}) => {
  const [field, meta] = useField(name);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasError = meta.touched && meta.error;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (accept && !file.type.match(accept.replace(/,/g, '|'))) {
        return false;
      }
      if (file.size > maxSize) {
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    // Create preview URLs for images
    const previews = validFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });

    setPreview(previews);

    // Update form field
    field.onChange({
      target: {
        name: field.name,
        value: multiple ? validFiles : validFiles[0]
      }
    });

    if (onFileSelect) {
      onFileSelect(validFiles);
    }
  };

  const handleRemove = (index: number) => {
    const newPreview = [...preview];
    newPreview.splice(index, 1);
    setPreview(newPreview);

    // Update form field
    if (multiple) {
      const files = Array.from(field.value || []);
      files.splice(index, 1);
      field.onChange({
        target: {
          name: field.name,
          value: files
        }
      });
    } else {
      field.onChange({
        target: {
          name: field.name,
          value: null
        }
      });
    }
  };

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {label}
      </label>
      <div
        className={`
          relative
          border-2 border-dashed rounded-md
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : hasError
            ? 'border-red-300'
            : 'border-gray-300 dark:border-gray-600'
          }
          ${className}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={name}
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          {...props}
        />
        <div className="p-6 text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Drag and drop your files here, or{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {accept ? `Accepted formats: ${accept}` : 'All file types'} (max {maxSize / 1024 / 1024}MB)
            </p>
          </div>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {preview.map((url, index) => (
            <div key={index} className="relative group">
              {url ? (
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-lg"
                />
              ) : (
                <div className="h-24 w-24 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <span className="text-xs text-gray-500 dark:text-gray-400">File {index + 1}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {hasError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {meta.error}
        </p>
      )}
    </div>
  );
}; 