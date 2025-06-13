import { useEffect, useCallback, useRef } from 'react';
import { z } from 'zod';

interface UseFormPersistenceOptions<T> {
  formId: string;
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  autoSaveInterval?: number;
  onAutoSave?: (values: T) => void;
  onRestore?: (values: T) => void;
}

export function useFormPersistence<T extends Record<string, any>>({
  formId,
  initialValues,
  validationSchema,
  autoSaveInterval = 5000,
  onAutoSave,
  onRestore
}: UseFormPersistenceOptions<T>) {
  const storageKey = `form_${formId}`;
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const lastSavedValuesRef = useRef<T>(initialValues);

  const saveFormData = useCallback((values: T) => {
    try {
      const formData = {
        values,
        timestamp: Date.now()
      };
      localStorage.setItem(storageKey, JSON.stringify(formData));
      lastSavedValuesRef.current = values;
      onAutoSave?.(values);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [storageKey, onAutoSave]);

  const restoreFormData = useCallback((): T | null => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (!savedData) return null;

      const { values, timestamp } = JSON.parse(savedData);
      
      // Validate restored data against schema if provided
      if (validationSchema) {
        const result = validationSchema.safeParse(values);
        if (!result.success) {
          console.warn('Restored form data failed validation:', result.error);
          return null;
        }
        return result.data;
      }

      return values;
    } catch (error) {
      console.error('Error restoring form data:', error);
      return null;
    }
  }, [storageKey, validationSchema]);

  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      lastSavedValuesRef.current = initialValues;
    } catch (error) {
      console.error('Error clearing form data:', error);
    }
  }, [storageKey, initialValues]);

  const startAutoSave = useCallback((values: T) => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setInterval(() => {
      if (JSON.stringify(values) !== JSON.stringify(lastSavedValuesRef.current)) {
        saveFormData(values);
      }
    }, autoSaveInterval);
  }, [autoSaveInterval, saveFormData]);

  const stopAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = undefined;
    }
  }, []);

  // Restore form data on mount
  useEffect(() => {
    const restoredValues = restoreFormData();
    if (restoredValues) {
      onRestore?.(restoredValues);
    }
  }, [restoreFormData, onRestore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoSave();
    };
  }, [stopAutoSave]);

  return {
    saveFormData,
    restoreFormData,
    clearFormData,
    startAutoSave,
    stopAutoSave
  };
} 