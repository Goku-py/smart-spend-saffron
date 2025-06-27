import { useCallback } from 'react';
import { z } from 'zod';

interface UseFormDataExportOptions<T extends z.ZodType<any, any>> {
  formId: string;
  schema: T;
  onExport?: (data: z.infer<T>) => void;
  onImport?: (data: z.infer<T>) => void;
  onError?: (error: Error) => void;
}

export const useFormDataExport = <T extends z.ZodType<any, any>>({
  formId,
  schema,
  onExport,
  onImport,
  onError
}: UseFormDataExportOptions<T>) => {
  const exportData = useCallback((data: z.infer<T>) => {
    try {
      const exportData = {
        formId,
        timestamp: new Date().toISOString(),
        version: '1.0',
        data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formId}-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onExport?.(data);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to export data'));
    }
  }, [formId, onExport, onError]);

  const importData = useCallback((file: File): Promise<z.infer<T>> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const importedData = JSON.parse(content);

          if (importedData.formId !== formId) {
            throw new Error('Invalid form data: form ID mismatch');
          }

          const validatedData = schema.parse(importedData.data);
          onImport?.(validatedData);
          resolve(validatedData);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to import data';
          onError?.(new Error(errorMessage));
          reject(new Error(errorMessage));
        }
      };

      reader.onerror = () => {
        const error = new Error('Failed to read file');
        onError?.(error);
        reject(error);
      };

      reader.readAsText(file);
    });
  }, [formId, schema, onImport, onError]);

  return {
    exportData,
    importData
  };
}; 