import { useEffect, useRef } from 'react';
import { FormikProps } from 'formik';
import { z } from 'zod';

export interface FormAnalyticsEvent {
  type: 'focus' | 'blur' | 'change' | 'submit' | 'error' | 'complete';
  field?: string;
  timestamp: number;
  value?: any;
  error?: string;
}

export interface FormAnalyticsData {
  events: FormAnalyticsEvent[];
  fieldInteractions: Record<string, number>;
  errors: Record<string, number>;
  completionTime?: number;
  startTime: number;
  endTime?: number;
}

interface UseFormAnalyticsOptions<T extends z.ZodType<any, any>> {
  formId: string;
  validationSchema: T;
  onEvent?: (event: FormAnalyticsEvent) => void;
  onComplete?: (data: FormAnalyticsData) => void;
  trackFieldInteractions?: boolean;
  trackErrors?: boolean;
  trackCompletion?: boolean;
}

export const useFormAnalytics = <T extends z.ZodType<any, any>>({
  formId,
  validationSchema,
  onEvent,
  onComplete,
  trackFieldInteractions = true,
  trackErrors = true,
  trackCompletion = true
}: UseFormAnalyticsOptions<T>) => {
  const analyticsRef = useRef<FormAnalyticsData>({
    events: [],
    fieldInteractions: {},
    errors: {},
    startTime: Date.now()
  });

  const trackEvent = (event: Omit<FormAnalyticsEvent, 'timestamp'>) => {
    const timestamp = Date.now();
    const analyticsEvent: FormAnalyticsEvent = {
      ...event,
      timestamp
    };

    analyticsRef.current.events.push(analyticsEvent);

    if (event.field && trackFieldInteractions) {
      analyticsRef.current.fieldInteractions[event.field] = 
        (analyticsRef.current.fieldInteractions[event.field] || 0) + 1;
    }

    if (event.type === 'error' && event.field && trackErrors) {
      analyticsRef.current.errors[event.field] = 
        (analyticsRef.current.errors[event.field] || 0) + 1;
    }

    if (event.type === 'complete' && trackCompletion) {
      analyticsRef.current.endTime = timestamp;
      analyticsRef.current.completionTime = 
        analyticsRef.current.endTime - analyticsRef.current.startTime;
    }

    onEvent?.(analyticsEvent);

    if (event.type === 'complete') {
      onComplete?.(analyticsRef.current);
    }
  };

  const getAnalytics = () => analyticsRef.current;

  return {
    trackEvent,
    getAnalytics
  };
}; 