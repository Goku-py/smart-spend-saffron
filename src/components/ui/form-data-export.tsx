import React, { useRef } from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface FormDataExportProps {
  onExport: () => void;
  onImport: (file: File) => void;
  className?: string;
}

export const FormDataExport: React.FC<FormDataExportProps> = ({
  onExport,
  onImport,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset the input value to allow importing the same file again
      event.target.value = '';
    }
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
        Export Data
      </button>

      <button
        type="button"
        onClick={handleImportClick}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
        Import Data
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}; 